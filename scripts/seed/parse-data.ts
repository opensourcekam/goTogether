import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export type AtlasPlace = {
  link: string;
  name: string;
  subName: string;
  subTitle: string;
  src: string;
};

export type CityPriceRow = {
  city: string;
  country: string;
  hostel: string | null;
  hotel: string | null;
  backpacker: string | null;
  priceIndex: string | null;
};

type RawCity = {
  city?: unknown;
  hostels?: unknown;
  hotels?: unknown;
  backpacker?: unknown;
  price_index?: unknown;
};

type RawPriceFile = {
  country?: RawCity[];
};

export function loadAtlasPlaces(filePath: string): AtlasPlace[] {
  const raw = JSON.parse(readFileSync(filePath, "utf8")) as unknown;
  if (!Array.isArray(raw)) {
    throw new Error(`Expected an array in ${filePath}`);
  }

  const places: AtlasPlace[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const name = typeof row.name === "string" ? row.name.trim() : "";
    if (!name) continue;
    places.push({
      link: typeof row.link === "string" ? row.link : "",
      name,
      subName: typeof row.subName === "string" ? row.subName : "",
      subTitle: typeof row.subTitle === "string" ? row.subTitle : "",
      src: typeof row.src === "string" ? row.src : "",
    });
  }
  return places;
}

/**
 * Split Atlas Obscura `name` ("Leiden, Netherlands") into city + country/region.
 */
export function splitPlaceLabel(name: string): {
  cityLabel: string;
  country: string | null;
} {
  const idx = name.lastIndexOf(",");
  if (idx === -1) {
    return { cityLabel: name.trim(), country: null };
  }
  const cityLabel = name.slice(0, idx).trim();
  const country = name.slice(idx + 1).trim();
  return {
    cityLabel: cityLabel || name.trim(),
    country: country || null,
  };
}

/**
 * `UnitedStates_travel_prices.json` → `United States`
 * `BosniaAndHerzegovina_travel_prices.json` → `Bosnia And Herzegovina`
 */
export function countryFromPriceFilename(filename: string): string {
  const base = path.basename(filename, ".json").replace(/_travel_prices$/i, "");
  return base
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .trim();
}

function toNumericString(value: unknown, scale: number): string | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(String(value).trim());
  if (!Number.isFinite(n)) return null;
  return n.toFixed(scale);
}

export function loadCityPrices(dirPath: string): CityPriceRow[] {
  const files = readdirSync(dirPath)
    .filter((f) => f.endsWith(".json"))
    .sort();

  const rows: CityPriceRow[] = [];
  const seen = new Set<string>();

  for (const file of files) {
    const country = countryFromPriceFilename(file);
    const fullPath = path.join(dirPath, file);
    let parsed: RawPriceFile;
    try {
      parsed = JSON.parse(readFileSync(fullPath, "utf8")) as RawPriceFile;
    } catch (err) {
      console.warn(
        `  skip ${file}: ${err instanceof Error ? err.message : String(err)}`
      );
      continue;
    }

    const cities = Array.isArray(parsed.country) ? parsed.country : [];
    for (const cityRow of cities) {
      const city =
        typeof cityRow.city === "string" ? cityRow.city.trim() : "";
      if (!city) continue;

      const key = `${city.toLowerCase()}::${country.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);

      rows.push({
        city,
        country,
        hostel: toNumericString(cityRow.hostels, 2),
        hotel: toNumericString(cityRow.hotels, 2),
        backpacker: toNumericString(cityRow.backpacker, 2),
        priceIndex: toNumericString(cityRow.price_index, 4),
      });
    }
  }

  return rows;
}
