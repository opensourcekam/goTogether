/**
 * Neon Auth (Managed Better Auth) is optional at build time. When
 * `NEON_AUTH_BASE_URL` / `NEON_AUTH_COOKIE_SECRET` are missing or still
 * placeholders, protected routes redirect to `/auth/sign-in` with setup
 * instructions instead of inventing a fake session.
 */
export function isNeonAuthConfigured(): boolean {
  const baseUrl = process.env.NEON_AUTH_BASE_URL?.trim();
  const secret = process.env.NEON_AUTH_COOKIE_SECRET?.trim();

  if (!baseUrl || !secret) return false;
  if (baseUrl.includes("ep-xxx") || baseUrl.includes("your-neon-auth")) {
    return false;
  }
  if (secret.includes("your-secret") || secret.length < 32) return false;

  return true;
}
