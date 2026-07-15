import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema";

/**
 * Single entry point for database access. Later phases should import from here:
 *
 *   import { db, schema } from "@/db";
 *   import type { Poi, Preference } from "@/db";
 *
 * The client is created lazily on first use so that `next build` (and any
 * module that transitively imports this file) doesn't require a live
 * `DATABASE_URL` at build time — it's only required when a query actually runs.
 */

export type Database = NeonHttpDatabase<typeof schema>;

let cached: Database | undefined;

export function getDb(): Database {
  if (cached) return cached;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and add your Neon connection string."
    );
  }

  cached = drizzle(neon(url), { schema });
  return cached;
}

/**
 * Lazy proxy so `db` can be imported at module scope without eagerly
 * connecting. The underlying client is resolved on first property access.
 */
export const db = new Proxy({} as Database, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});

export { schema };
export * from "./schema";
export * from "./geometry";
