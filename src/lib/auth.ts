import "server-only";

import { createHash } from "node:crypto";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db, schema, type User } from "@/db";
import { isNeonAuthConfigured } from "@/lib/auth/config";
import { auth } from "@/lib/auth/server";

export type AuthIdentity = {
  authUserId: string;
  email: string;
  name: string | null;
  image: string | null;
};

export type AppUser = User;

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return false;
  if (url.includes("user:password@")) return false;
  return true;
}

/** Stable local id when Postgres sync is unavailable (offline UI only). */
function sessionOnlyUser(identity: AuthIdentity): User {
  const hash = createHash("sha256").update(identity.authUserId).digest("hex");
  const id = [
    hash.slice(0, 8),
    hash.slice(8, 12),
    `4${hash.slice(13, 16)}`,
    `${((Number.parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, "0")}${hash.slice(18, 20)}`,
    hash.slice(20, 32),
  ].join("-");

  return {
    id,
    authUserId: identity.authUserId,
    email: identity.email,
    name: identity.name,
    image: identity.image,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function upsertLocalUser(identity: AuthIdentity): Promise<User> {
  if (!isDatabaseConfigured()) {
    return sessionOnlyUser(identity);
  }

  try {
    const existing = await db.query.users.findFirst({
      where: eq(schema.users.authUserId, identity.authUserId),
    });

    if (existing) {
      const [updated] = await db
        .update(schema.users)
        .set({
          email: identity.email,
          name: identity.name,
          image: identity.image,
          updatedAt: new Date(),
        })
        .where(eq(schema.users.id, existing.id))
        .returning();
      return updated ?? existing;
    }

    const byEmail = await db.query.users.findFirst({
      where: eq(schema.users.email, identity.email),
    });

    if (byEmail) {
      const [updated] = await db
        .update(schema.users)
        .set({
          authUserId: identity.authUserId,
          name: identity.name ?? byEmail.name,
          image: identity.image ?? byEmail.image,
          updatedAt: new Date(),
        })
        .where(eq(schema.users.id, byEmail.id))
        .returning();
      return updated ?? byEmail;
    }

    const [created] = await db
      .insert(schema.users)
      .values({
        authUserId: identity.authUserId,
        email: identity.email,
        name: identity.name,
        image: identity.image,
      })
      .returning();

    if (!created) {
      console.error("Failed to create local user record for", identity.authUserId);
      return sessionOnlyUser(identity);
    }

    return created;
  } catch (error) {
    console.error("Failed to sync local user with Postgres:", error);
    return sessionOnlyUser(identity);
  }
}

async function resolveNeonIdentity(): Promise<AuthIdentity | null> {
  if (!isNeonAuthConfigured()) return null;

  try {
    const { data: session, error } = await auth.getSession();
    if (error) {
      console.error("Neon Auth getSession error:", error);
      return null;
    }
    if (!session?.user) return null;

    const user = session.user;
    return {
      authUserId: user.id,
      email: user.email ?? `${user.id}@users.neon-auth.local`,
      name: user.name ?? null,
      image: user.image ?? null,
    };
  } catch (error) {
    console.error("Neon Auth getSession failed:", error);
    return null;
  }
}

export async function getCurrentIdentity(): Promise<AuthIdentity | null> {
  return resolveNeonIdentity();
}

export async function getCurrentAppUser(): Promise<AppUser | null> {
  const identity = await getCurrentIdentity();
  if (!identity) return null;

  return upsertLocalUser(identity);
}

/**
 * Require a signed-in Neon Auth user. Redirects to sign-in when unauthenticated
 * (or when Neon Auth env is not configured — the sign-in page explains setup).
 */
export async function requireAppUser(options?: {
  redirectTo?: string;
}): Promise<AppUser> {
  if (!isNeonAuthConfigured()) {
    redirect(options?.redirectTo ?? "/auth/sign-in");
  }

  const identity = await getCurrentIdentity();
  if (!identity) {
    redirect(options?.redirectTo ?? "/auth/sign-in");
  }

  return upsertLocalUser(identity);
}

export { isNeonAuthConfigured };
