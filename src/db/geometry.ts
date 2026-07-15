import { customType } from "drizzle-orm/pg-core";
import { sql, type SQL } from "drizzle-orm";

/**
 * PostGIS geometry support for Drizzle.
 *
 * Drizzle's built-in `geometry` type emits `geometry(point)` and drops the
 * SRID, but the suggestion engine relies on SRID 4326 (WGS84 lng/lat) so that
 * `ST_DWithin` distance-ring queries are correct. We therefore define a custom
 * type that:
 *   - emits the exact DDL `geometry(Point,4326)`,
 *   - serialises `{ lng, lat }` to EWKT (`SRID=4326;POINT(lng lat)`) on write,
 *   - parses PostGIS's default HEXEWKB output back to `{ lng, lat }` on read.
 *
 * PostGIS + the GiST indexes on these columns are created by the SQL migration
 * in `drizzle/` (which also runs `CREATE EXTENSION IF NOT EXISTS postgis`).
 */

export const SRID = 4326;

export type LngLat = {
  lng: number;
  lat: number;
};

export const geoPoint = customType<{
  data: LngLat;
  driverData: string;
  config: { srid?: number };
}>({
  dataType(config) {
    const srid = config?.srid ?? SRID;
    return `geometry(Point,${srid})`;
  },
  toDriver(value) {
    return `SRID=${SRID};POINT(${value.lng} ${value.lat})`;
  },
  fromDriver(value) {
    return parseHexEwkbPoint(value);
  },
});

/**
 * SQL fragment for an SRID-4326 point literal, e.g. for inserts/updates via
 * raw SQL or for spatial predicates.
 */
export function makePoint(point: LngLat): SQL {
  return sql`ST_SetSRID(ST_MakePoint(${point.lng}, ${point.lat}), ${SRID})`;
}

/**
 * `ST_DWithin` predicate in meters. Casts to `geography` so the radius is a
 * true great-circle distance rather than degrees. Used by the distance-ring
 * POI query in the suggestion engine phase.
 */
export function withinMeters(
  column: SQL | unknown,
  center: LngLat,
  meters: number
): SQL {
  return sql`ST_DWithin(${column}::geography, ${makePoint(center)}::geography, ${meters})`;
}

function parseHexEwkbPoint(hex: string): LngLat {
  const bytes = hexToBytes(hex);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  let offset = 0;
  const littleEndian = view.getUint8(offset) === 1;
  offset += 1;

  const type = view.getUint32(offset, littleEndian);
  offset += 4;

  const hasSrid = (type & 0x20000000) !== 0;
  if (hasSrid) {
    offset += 4; // skip embedded SRID
  }

  const lng = view.getFloat64(offset, littleEndian);
  offset += 8;
  const lat = view.getFloat64(offset, littleEndian);

  return { lng, lat };
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}
