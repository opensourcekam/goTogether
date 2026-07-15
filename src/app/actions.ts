"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db, schema, type LngLat } from "@/db";
import {
  getCurrentAppUser,
  isDatabaseConfigured,
  type AppUser,
} from "@/lib/auth";
import { CADENCE_OPTIONS, type Cadence } from "@/lib/cadence";
import { isStyleTag } from "@/lib/travel-styles";
import {
  generateSuggestions,
  persistSuggestion,
  preferencesAreComplete,
  type SuggestedTrip,
} from "@/lib/suggestions";

export type SavePreferencesInput = {
  homeBaseLabel: string;
  homeBase: LngLat;
  styleTags: string[];
  maxDistanceKm: number;
  cadence: Cadence;
};

export type ActionResult<T = void> =
  | { status: "ok"; data: T }
  | { status: "error"; error: string };

async function requireActionUser(): Promise<ActionResult<AppUser>> {
  const user = await getCurrentAppUser();
  if (!user) {
    return { status: "error", error: "Sign in to continue." };
  }
  return { status: "ok", data: user };
}

function validatePreferences(
  input: SavePreferencesInput
): ActionResult<SavePreferencesInput> {
  const homeBaseLabel = input.homeBaseLabel?.trim();
  if (!homeBaseLabel) {
    return { status: "error", error: "Pick a home base from the suggestions." };
  }

  const { lng, lat } = input.homeBase ?? {};
  if (
    typeof lng !== "number" ||
    typeof lat !== "number" ||
    Number.isNaN(lng) ||
    Number.isNaN(lat)
  ) {
    return { status: "error", error: "Home base location is invalid." };
  }

  const styleTags = input.styleTags.filter(isStyleTag);
  if (styleTags.length === 0) {
    return {
      status: "error",
      error: "Choose at least one travel style.",
    };
  }

  const maxDistanceKm = Number(input.maxDistanceKm);
  if (!Number.isFinite(maxDistanceKm) || maxDistanceKm < 50 || maxDistanceKm > 5000) {
    return {
      status: "error",
      error: "Max distance must be between 50 and 5000 km.",
    };
  }

  const cadenceOk = CADENCE_OPTIONS.some((option) => option.value === input.cadence);
  if (!cadenceOk) {
    return { status: "error", error: "Pick how often you want to get away." };
  }

  return {
    status: "ok",
    data: {
      homeBaseLabel,
      homeBase: { lng, lat },
      styleTags,
      maxDistanceKm,
      cadence: input.cadence,
    },
  };
}

export async function savePreferencesAction(
  input: SavePreferencesInput
): Promise<ActionResult> {
  const userResult = await requireActionUser();
  if (userResult.status === "error") return userResult;
  const user = userResult.data;

  const validated = validatePreferences(input);
  if (validated.status === "error") return validated;

  if (!isDatabaseConfigured()) {
    return {
      status: "error",
      error:
        "Database is not configured. Set DATABASE_URL in .env to save preferences.",
    };
  }

  const data = validated.data;

  try {
    const existing = await db.query.preferences.findFirst({
      where: eq(schema.preferences.userId, user.id),
    });

    if (existing) {
      await db
        .update(schema.preferences)
        .set({
          homeBase: data.homeBase,
          homeBaseLabel: data.homeBaseLabel,
          styleTags: data.styleTags,
          maxDistanceKm: data.maxDistanceKm,
          cadence: data.cadence,
          updatedAt: new Date(),
        })
        .where(eq(schema.preferences.id, existing.id));
    } else {
      await db.insert(schema.preferences).values({
        userId: user.id,
        homeBase: data.homeBase,
        homeBaseLabel: data.homeBaseLabel,
        styleTags: data.styleTags,
        maxDistanceKm: data.maxDistanceKm,
        cadence: data.cadence,
      });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save preferences.";
    return { status: "error", error: message };
  }

  revalidatePath("/onboarding");
  revalidatePath("/discover");
  return { status: "ok", data: undefined };
}

export type DiscoverPreferencesInput = {
  styleTags: string[];
  maxDistanceKm: number;
  cadence: Cadence;
};

function validateDiscoverPreferences(
  input: DiscoverPreferencesInput
): ActionResult<DiscoverPreferencesInput> {
  const styleTags = input.styleTags.filter(isStyleTag);
  if (styleTags.length === 0) {
    return { status: "error", error: "Keep at least one travel style." };
  }

  const maxDistanceKm = Number(input.maxDistanceKm);
  if (
    !Number.isFinite(maxDistanceKm) ||
    maxDistanceKm < 50 ||
    maxDistanceKm > 5000
  ) {
    return {
      status: "error",
      error: "Max distance must be between 50 and 5000 km.",
    };
  }

  const cadenceOk = CADENCE_OPTIONS.some(
    (option) => option.value === input.cadence
  );
  if (!cadenceOk) {
    return { status: "error", error: "Pick a valid cadence." };
  }

  return {
    status: "ok",
    data: { styleTags, maxDistanceKm, cadence: input.cadence },
  };
}

/**
 * Persist the inline discover dials (style/distance/cadence) and re-run the
 * suggestion engine in one round-trip so the feed can update live without a
 * full navigation back through onboarding.
 */
export async function updateDiscoverPreferencesAction(
  input: DiscoverPreferencesInput
): Promise<ActionResult<{ suggestions: SuggestedTrip[] }>> {
  const userResult = await requireActionUser();
  if (userResult.status === "error") return userResult;
  const user = userResult.data;

  const validated = validateDiscoverPreferences(input);
  if (validated.status === "error") return validated;

  if (!isDatabaseConfigured()) {
    return {
      status: "error",
      error: "Database is not configured. Set DATABASE_URL to tune suggestions.",
    };
  }

  const data = validated.data;

  try {
    const existing = await db.query.preferences.findFirst({
      where: eq(schema.preferences.userId, user.id),
    });

    if (!existing?.homeBase || !existing.homeBaseLabel) {
      return {
        status: "error",
        error: "Set your home base in preferences before tuning suggestions.",
      };
    }

    await db
      .update(schema.preferences)
      .set({
        styleTags: data.styleTags,
        maxDistanceKm: data.maxDistanceKm,
        cadence: data.cadence,
        updatedAt: new Date(),
      })
      .where(eq(schema.preferences.id, existing.id));

    const merged = {
      ...existing,
      styleTags: data.styleTags,
      maxDistanceKm: data.maxDistanceKm,
      cadence: data.cadence,
    };

    const suggestions = await generateSuggestions(merged);
    revalidatePath("/discover");
    return { status: "ok", data: { suggestions } };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not update suggestions.";
    return { status: "error", error: message };
  }
}

export async function acceptSuggestionAction(
  suggestion: SuggestedTrip
): Promise<ActionResult<{ tripId: string }>> {
  const userResult = await requireActionUser();
  if (userResult.status === "error") return userResult;
  const user = userResult.data;

  try {
    const { tripId } = await persistSuggestion({
      ownerId: user.id,
      suggestion,
    });
    revalidatePath("/discover");
    revalidatePath(`/trips/${tripId}`);
    return { status: "ok", data: { tripId } };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save trip.";
    return { status: "error", error: message };
  }
}

export async function loadSuggestionsForCurrentUser(): Promise<
  ActionResult<{
    suggestions: SuggestedTrip[];
    needsOnboarding: boolean;
  }>
> {
  const userResult = await requireActionUser();
  if (userResult.status === "error") return userResult;
  const user = userResult.data;

  if (!isDatabaseConfigured()) {
    return {
      status: "ok",
      data: { suggestions: [], needsOnboarding: true },
    };
  }

  try {
    const prefs = await db.query.preferences.findFirst({
      where: eq(schema.preferences.userId, user.id),
    });

    if (!preferencesAreComplete(prefs)) {
      return {
        status: "ok",
        data: { suggestions: [], needsOnboarding: true },
      };
    }

    const suggestions = await generateSuggestions(prefs!);
    return {
      status: "ok",
      data: { suggestions, needsOnboarding: false },
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not generate suggestions.";
    return { status: "error", error: message };
  }
}
