import "server-only";

import { createNeonAuth } from "@neondatabase/auth/next/server";

import { isNeonAuthConfigured } from "@/lib/auth/config";

/**
 * Build/import-safe placeholders so `createNeonAuth` can construct during
 * `next build` when env is unset. Runtime paths gate on `isNeonAuthConfigured()`.
 */
const PLACEHOLDER_BASE_URL =
  "https://placeholder.neonauth.local/neondb/auth";
const PLACEHOLDER_COOKIE_SECRET =
  "build-time-placeholder-cookie-secret-32chars";

const baseUrl =
  process.env.NEON_AUTH_BASE_URL?.trim() || PLACEHOLDER_BASE_URL;
const cookieSecret =
  process.env.NEON_AUTH_COOKIE_SECRET?.trim() || PLACEHOLDER_COOKIE_SECRET;

export const auth = createNeonAuth({
  baseUrl,
  cookies: {
    secret: cookieSecret.length >= 32 ? cookieSecret : PLACEHOLDER_COOKIE_SECRET,
  },
  logLevel: isNeonAuthConfigured() ? "warn" : "silent",
});
