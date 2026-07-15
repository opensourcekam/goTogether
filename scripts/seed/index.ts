/**
 * One-time enrichment + seed pipeline for goTogether.
 *
 * 1. Read Atlas Obscura POIs (no coordinates)
 * 2. Geocode each place `name` via Nominatim (disk-cached, rate-limited, resumable)
 * 3. Infer styleTags from subtitle/name
 * 4. Seed `pois` (PostGIS point as {lng,lat})
 * 5. Seed `city_prices` from averageTravelPrices/*.json
 *
 * Usage:
 *   pnpm db:seed -- --dry-run
 *   pnpm db:seed -- --fixture --dry-run
 *   pnpm db:seed -- --cache-only
 *   pnpm db:seed -- --limit 100
 *   pnpm db:seed
 */

import "dotenv/config";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { NewCityPrice, NewPoi } from "../../src/db/schema";
import type { StyleTag } from "../../src/lib/travel-styles";
import {
  Geocoder,
  loadGeocodeCache,
  mergeGeocodeCaches,
  saveGeocodeCache,
  type GeocodeCache,
} from "./geocode";
import { inferStyleTags } from "./infer-style-tags";
import {
  loadAtlasPlaces,
  loadCityPrices,
  splitPlaceLabel,
  type AtlasPlace,
} from "./parse-data";

async function getDbModules() {
  const [{ db, schema }] = await Promise.all([
    import("../../src/db"),
  ]);
  return { db, schema };
}
const ROOT = process.cwd();
const ATLAS_PATH = path.join(
  ROOT,
  "legacy/placesData/atlasObscure/atlasObscurePlaces.json"
);
const PRICES_DIR = path.join(
  ROOT,
  "legacy/public/places/averageTravelPrices"
);
const CACHE_DIR = path.join(ROOT, "scripts/seed/.cache");
const CACHE_PATH = path.join(CACHE_DIR, "geocode-cache.json");
const FIXTURE_PATH = path.join(
  ROOT,
  "scripts/seed/fixtures/geocode-sample.json"
);

const POI_BATCH_SIZE = 100;
const PRICE_BATCH_SIZE = 200;
const CACHE_FLUSH_EVERY = 25;
/** Nominatim public instance: ≤1 request/second. */
const DEFAULT_MIN_INTERVAL_MS = 1100;

type CliArgs = {
  dryRun: boolean;
  cacheOnly: boolean;
  fixture: boolean;
  limit: number | null;
  skipPrices: boolean;
  skipPois: boolean;
  help: boolean;
};

type EnrichedPoi = {
  place: AtlasPlace;
  cityLabel: string;
  country: string | null;
  styleTags: StyleTag[];
  geo: { lng: number; lat: number } | null;
};

function printHelp(): void {
  console.log(`
goTogether enrichment + seed

Usage:
  pnpm db:seed -- [options]

Options:
  --dry-run       Enrich + report counts; do not write to the database
  --cache-only    Never call Nominatim; only use the on-disk geocode cache
  --fixture       Seed/demo with the checked-in sample geocode cache
                  (implies --cache-only; limits POIs to fixture keys unless
                  --limit is set lower)
  --limit N       Process at most N Atlas Obscura places
  --skip-pois     Skip POI enrichment / pois table seed
  --skip-prices   Skip city_prices seed
  --help          Show this help

Environment:
  DATABASE_URL    Required unless --dry-run
                  Live geocoding uses free Nominatim (no API key); ~1 req/s

Cache file:
  ${CACHE_PATH}
`);
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    dryRun: false,
    cacheOnly: false,
    fixture: false,
    limit: null,
    skipPrices: false,
    skipPois: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "--dry-run":
        args.dryRun = true;
        break;
      case "--cache-only":
        args.cacheOnly = true;
        break;
      case "--fixture":
        args.fixture = true;
        args.cacheOnly = true;
        break;
      case "--skip-pois":
        args.skipPois = true;
        break;
      case "--skip-prices":
        args.skipPrices = true;
        break;
      case "--help":
      case "-h":
        args.help = true;
        break;
      case "--limit": {
        const next = argv[i + 1];
        const n = Number(next);
        if (!next || !Number.isFinite(n) || n < 1) {
          throw new Error(`--limit requires a positive number (got: ${next})`);
        }
        args.limit = Math.floor(n);
        i += 1;
        break;
      }
      default:
        if (arg === "--") break;
        if (arg.startsWith("-")) {
          throw new Error(`Unknown flag: ${arg} (pass --help)`);
        }
    }
  }

  return args;
}

function failEnv(message: string): never {
  console.error(`\n✖ ${message}\n`);
  console.error("  Copy .env.example → .env and fill in the values, or re-run");
  console.error("  with --dry-run / --cache-only / --fixture as appropriate.\n");
  process.exit(1);
}

function loadFixtureCache(): GeocodeCache {
  if (!existsSync(FIXTURE_PATH)) {
    throw new Error(`Fixture cache missing at ${FIXTURE_PATH}`);
  }
  return JSON.parse(readFileSync(FIXTURE_PATH, "utf8")) as GeocodeCache;
}

async function enrichPlaces(
  places: AtlasPlace[],
  geocoder: Geocoder,
  cachePath: string
): Promise<{
  enriched: EnrichedPoi[];
  geocoded: number;
  uncached: number;
  failed: number;
}> {
  const enriched: EnrichedPoi[] = [];
  let geocoded = 0;
  let uncached = 0;
  let failed = 0;
  let sinceFlush = 0;

  for (let i = 0; i < places.length; i += 1) {
    const place = places[i]!;
    const { cityLabel, country } = splitPlaceLabel(place.name);
    const styleTags = inferStyleTags({
      name: place.name,
      subName: place.subName,
      subTitle: place.subTitle,
    });

    const result = await geocoder.geocode(place.name);
    let geo: EnrichedPoi["geo"] = null;

    if (!result) {
      uncached += 1;
    } else if (result.status === "ok") {
      geo = { lng: result.lng, lat: result.lat };
      geocoded += 1;
    } else {
      failed += 1;
    }

    enriched.push({ place, cityLabel, country, styleTags, geo });
    sinceFlush += 1;

    if (sinceFlush >= CACHE_FLUSH_EVERY) {
      saveGeocodeCache(cachePath, geocoder.getCache());
      sinceFlush = 0;
    }

    if ((i + 1) % 100 === 0 || i + 1 === places.length) {
      console.log(
        `  … ${i + 1}/${places.length} places (geocoded=${geocoded}, failed=${failed}, uncached=${uncached})`
      );
    }
  }

  saveGeocodeCache(cachePath, geocoder.getCache());
  return { enriched, geocoded, uncached, failed };
}

async function seedPois(rows: EnrichedPoi[]): Promise<number> {
  const { db, schema } = await getDbModules();
  const withGeo = rows.filter((r) => r.geo != null);
  console.log(
    `  Inserting ${withGeo.length} pois (${rows.length - withGeo.length} skipped — no geo)…`
  );

  await db.delete(schema.pois);

  let inserted = 0;
  for (let i = 0; i < withGeo.length; i += POI_BATCH_SIZE) {
    const chunk = withGeo.slice(i, i + POI_BATCH_SIZE);
    const values: NewPoi[] = chunk.map((row) => ({
      name: row.place.subName?.trim() || row.place.name,
      cityLabel: row.cityLabel,
      country: row.country,
      subtitle: row.place.subTitle?.trim() || null,
      imageUrl: row.place.src || null,
      sourceLink: row.place.link || null,
      geo: row.geo!,
      styleTags: row.styleTags,
    }));
    await db.insert(schema.pois).values(values);
    inserted += values.length;
  }

  return inserted;
}

async function seedCityPrices(): Promise<number> {
  const { db, schema } = await getDbModules();
  const prices = loadCityPrices(PRICES_DIR);
  console.log(`  Parsed ${prices.length} city_prices rows from ${PRICES_DIR}`);

  await db.delete(schema.cityPrices);

  let inserted = 0;
  for (let i = 0; i < prices.length; i += PRICE_BATCH_SIZE) {
    const chunk = prices.slice(i, i + PRICE_BATCH_SIZE);
    const values: NewCityPrice[] = chunk.map((row) => ({
      city: row.city,
      country: row.country,
      hostel: row.hostel,
      hotel: row.hotel,
      backpacker: row.backpacker,
      priceIndex: row.priceIndex,
    }));
    await db.insert(schema.cityPrices).values(values);
    inserted += values.length;
  }

  return inserted;
}

function summarizeStyleTags(rows: EnrichedPoi[]): void {
  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const tag of row.styleTags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  console.log("  styleTags distribution:");
  for (const [tag, n] of sorted) {
    console.log(`    ${tag.padEnd(14)} ${n}`);
  }
}

async function main(): Promise<void> {
  let args: CliArgs;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  if (args.help) {
    printHelp();
    return;
  }

  console.log("\ngoTogether seed / enrichment\n");
  console.log(
    `  mode: ${args.dryRun ? "dry-run" : "write"} | cache-only=${args.cacheOnly} | fixture=${args.fixture}`
  );

  const databaseUrl = process.env.DATABASE_URL?.trim() || null;

  if (!args.dryRun && !databaseUrl) {
    failEnv(
      "DATABASE_URL is not set. Needed to seed Neon. Use --dry-run to enrich without a database."
    );
  }

  if (!args.skipPois && !args.cacheOnly) {
    console.log(
      "  Geocoder: Nominatim (OpenStreetMap) — free, ~1 req/s, no API key"
    );
  }

  if (!existsSync(ATLAS_PATH)) {
    console.error(`✖ Atlas Obscura file not found: ${ATLAS_PATH}`);
    process.exit(1);
  }
  if (!existsSync(PRICES_DIR)) {
    console.error(`✖ Travel prices directory not found: ${PRICES_DIR}`);
    process.exit(1);
  }

  // --- Geocode cache ---
  let cache = loadGeocodeCache(CACHE_PATH);
  if (args.fixture) {
    const fixture = loadFixtureCache();
    cache = mergeGeocodeCaches(cache, fixture);
    // Persist merged cache so --fixture also bootstraps local resume.
    saveGeocodeCache(CACHE_PATH, cache);
    console.log(
      `  Loaded fixture cache (${Object.keys(fixture).length} entries) → ${CACHE_PATH}`
    );
  } else {
    console.log(
      `  Geocode cache: ${CACHE_PATH} (${Object.keys(cache).length} entries)`
    );
  }

  const geocoder = new Geocoder({
    cachePath: CACHE_PATH,
    cacheOnly: args.cacheOnly,
    minIntervalMs: DEFAULT_MIN_INTERVAL_MS,
    cache: cache,
  });

  let poiInserted = 0;
  let priceInserted = 0;

  // --- POIs ---
  if (!args.skipPois) {
    let places = loadAtlasPlaces(ATLAS_PATH);
    console.log(`\n1) Atlas Obscura: ${places.length} places`);

    if (args.fixture) {
      const fixtureKeys = new Set(Object.keys(loadFixtureCache()));
      places = places.filter((p) => fixtureKeys.has(p.name));
      console.log(`   fixture filter → ${places.length} places`);
    }

    if (args.limit != null) {
      places = places.slice(0, args.limit);
      console.log(`   --limit ${args.limit} → ${places.length} places`);
    }

    console.log("\n2) Geocode + styleTags…");
    const { enriched, geocoded, uncached, failed } = await enrichPlaces(
      places,
      geocoder,
      CACHE_PATH
    );

    console.log("\n   Geocode summary:");
    console.log(`     ok (with coords)  ${geocoded}`);
    console.log(`     not found/error   ${failed}`);
    console.log(`     uncached/skipped  ${uncached}`);
    console.log(
      `     cache hits=${geocoder.stats.cacheHits} apiOk=${geocoder.stats.apiOk} apiMiss=${geocoder.stats.apiMiss} apiError=${geocoder.stats.apiError}`
    );
    summarizeStyleTags(enriched);

    if (args.dryRun) {
      console.log("\n3) pois seed skipped (--dry-run)");
      const sample = enriched.find((e) => e.geo);
      if (sample) {
        console.log("   sample enriched row:");
        console.log(
          `     ${sample.place.subName} @ ${sample.cityLabel}, ${sample.country}`
        );
        console.log(
          `     geo={lng:${sample.geo!.lng}, lat:${sample.geo!.lat}} tags=[${sample.styleTags.join(", ")}]`
        );
      }
    } else {
      console.log("\n3) Seeding pois…");
      poiInserted = await seedPois(enriched);
      console.log(`   inserted ${poiInserted} pois`);
    }
  } else {
    console.log("\n1–3) POI enrichment skipped (--skip-pois)");
  }

  // --- city_prices ---
  if (!args.skipPrices) {
    if (args.dryRun) {
      const prices = loadCityPrices(PRICES_DIR);
      console.log(
        `\n4) city_prices dry-run: would insert ${prices.length} rows`
      );
      if (prices[0]) {
        console.log(
          `   sample: ${prices[0].city}, ${prices[0].country} hostel=${prices[0].hostel} hotel=${prices[0].hotel}`
        );
      }
    } else {
      console.log("\n4) Seeding city_prices…");
      priceInserted = await seedCityPrices();
      console.log(`   inserted ${priceInserted} city_prices`);
    }
  } else {
    console.log("\n4) city_prices skipped (--skip-prices)");
  }

  console.log("\n✔ Done.");
  if (args.dryRun) {
    console.log("  (dry-run — no database writes)");
  } else {
    console.log(`  pois=${poiInserted}  city_prices=${priceInserted}`);
  }
  console.log(`  geocode cache: ${CACHE_PATH}\n`);
}

main().catch((err) => {
  console.error("\n✖ Seed failed:");
  console.error(err instanceof Error ? err.stack ?? err.message : err);
  process.exit(1);
});
