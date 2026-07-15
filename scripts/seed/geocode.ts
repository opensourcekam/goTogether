import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  NOMINATIM_MIN_INTERVAL_MS,
  NOMINATIM_SEARCH_URL,
  NOMINATIM_USER_AGENT,
  type NominatimResult,
} from "../../src/lib/geocoding";

export type GeocodeOk = {
  status: "ok";
  lng: number;
  lat: number;
  placeName: string;
  cachedAt: string;
};

export type GeocodeMiss = {
  status: "not_found" | "error";
  message?: string;
  cachedAt: string;
};

export type GeocodeCacheEntry = GeocodeOk | GeocodeMiss;

export type GeocodeCache = Record<string, GeocodeCacheEntry>;

export type GeocodeOptions = {
  cachePath: string;
  /** When true, never call Nominatim — only return cached hits. */
  cacheOnly: boolean;
  /** Minimum delay between live API calls (ms). Default ~1 req/s. */
  minIntervalMs: number;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function loadGeocodeCache(cachePath: string): GeocodeCache {
  if (!existsSync(cachePath)) return {};
  try {
    const raw = readFileSync(cachePath, "utf8");
    const parsed = JSON.parse(raw) as GeocodeCache;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    throw new Error(
      `Failed to read geocode cache at ${cachePath}: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

export function saveGeocodeCache(cachePath: string, cache: GeocodeCache): void {
  mkdirSync(path.dirname(cachePath), { recursive: true });
  writeFileSync(cachePath, `${JSON.stringify(cache, null, 2)}\n`, "utf8");
}

export function mergeGeocodeCaches(
  base: GeocodeCache,
  overlay: GeocodeCache
): GeocodeCache {
  return { ...base, ...overlay };
}

/**
 * Disk-backed Nominatim (OpenStreetMap) forward geocoder.
 *
 * Cache keys are the exact query string (Atlas Obscura `name`, e.g.
 * "Leiden, Netherlands"). Successful and failed lookups are both cached so
 * re-runs / resumes skip the API. The cache is flushed to disk periodically by
 * the caller via `saveGeocodeCache`.
 *
 * Polite usage: identifying User-Agent + ~1 request/second on the public
 * Nominatim instance.
 */
export class Geocoder {
  private readonly cacheOnly: boolean;
  private readonly minIntervalMs: number;
  private readonly cache: GeocodeCache;
  private lastRequestAt = 0;

  stats = {
    cacheHits: 0,
    apiOk: 0,
    apiMiss: 0,
    apiError: 0,
    skippedCacheOnly: 0,
  };

  constructor(options: GeocodeOptions & { cache: GeocodeCache }) {
    this.cacheOnly = options.cacheOnly;
    this.minIntervalMs = options.minIntervalMs ?? NOMINATIM_MIN_INTERVAL_MS;
    this.cache = options.cache;
  }

  getCache(): GeocodeCache {
    return this.cache;
  }

  async geocode(query: string): Promise<GeocodeCacheEntry | null> {
    const key = query.trim();
    if (!key) return null;

    const cached = this.cache[key];
    if (cached) {
      this.stats.cacheHits += 1;
      return cached;
    }

    if (this.cacheOnly) {
      this.stats.skippedCacheOnly += 1;
      return null;
    }

    await this.throttle();

    try {
      const entry = await this.fetchNominatim(key);
      this.cache[key] = entry;
      if (entry.status === "ok") this.stats.apiOk += 1;
      else if (entry.status === "not_found") this.stats.apiMiss += 1;
      else this.stats.apiError += 1;
      return entry;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const entry: GeocodeMiss = {
        status: "error",
        message,
        cachedAt: new Date().toISOString(),
      };
      // Don't cache transient errors permanently — leave uncached so resume
      // can retry. Count and return the miss for this run.
      this.stats.apiError += 1;
      return entry;
    }
  }

  private async throttle(): Promise<void> {
    const now = Date.now();
    const wait = this.minIntervalMs - (now - this.lastRequestAt);
    if (wait > 0) await sleep(wait);
    this.lastRequestAt = Date.now();
  }

  private async fetchNominatim(query: string): Promise<GeocodeCacheEntry> {
    const url = new URL(NOMINATIM_SEARCH_URL);
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    url.searchParams.set("addressdetails", "0");

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": NOMINATIM_USER_AGENT,
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      if (res.status === 429) {
        throw new Error(
          `Nominatim rate limited (429). Slow down and re-run (≤1 req/s).`
        );
      }
      throw new Error(`Nominatim HTTP ${res.status}: ${body.slice(0, 200)}`);
    }

    const data = (await res.json()) as NominatimResult[];
    const feature = data[0];
    const lng = feature ? Number(feature.lon) : NaN;
    const lat = feature ? Number(feature.lat) : NaN;

    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      return {
        status: "not_found",
        message: "No features returned",
        cachedAt: new Date().toISOString(),
      };
    }

    return {
      status: "ok",
      lng,
      lat,
      placeName: feature.display_name ?? query,
      cachedAt: new Date().toISOString(),
    };
  }
}
