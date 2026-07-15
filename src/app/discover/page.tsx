import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { DiscoverExperience } from "@/components/discover-experience";
import { Button } from "@/components/ui/button";
import {
  isDatabaseConfigured,
  requireAppUser,
} from "@/lib/auth";
import {
  generateSuggestions,
  getUserPreferences,
  preferencesAreComplete,
} from "@/lib/suggestions";
import { isStyleTag } from "@/lib/travel-styles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Discover",
  description: "Suggested trips matched to your home base and travel style.",
};

export default async function DiscoverPage() {
  const user = await requireAppUser();

  if (!isDatabaseConfigured()) {
    return (
      <div className="flex min-h-full flex-col">
        <AppHeader title="Discover" />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
          <h1 className="text-3xl font-semibold">Discover</h1>
          <p className="text-muted-foreground max-w-xl text-pretty">
            Connect Neon (`DATABASE_URL`) and run `pnpm db:seed` to populate
            POIs, then set preferences to generate suggested trips.
          </p>
          <Button asChild className="w-fit">
            <Link href="/onboarding">Go to onboarding</Link>
          </Button>
        </main>
      </div>
    );
  }

  let prefsError: string | null = null;
  let prefs = null as Awaited<ReturnType<typeof getUserPreferences>>;

  try {
    prefs = await getUserPreferences(user.id);
  } catch (error) {
    prefsError =
      error instanceof Error ? error.message : "Could not load preferences.";
  }

  if (!prefsError && !preferencesAreComplete(prefs)) {
    redirect("/onboarding");
  }

  let suggestions: Awaited<ReturnType<typeof generateSuggestions>> = [];
  let engineError: string | null = prefsError;

  if (!engineError && prefs) {
    try {
      suggestions = await generateSuggestions(prefs);
    } catch (error) {
      engineError =
        error instanceof Error
          ? error.message
          : "Could not generate suggestions.";
    }
  }

  const homeBase = prefs?.homeBase ?? null;
  const homeBaseLabel = prefs?.homeBaseLabel ?? "";

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader title="Discover" />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Where to next?
            </h1>
            <p className="text-muted-foreground max-w-2xl text-pretty">
              Live wanderlust matched to your home base and style. Tune the
              dials and watch the map light up.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/onboarding">Home base & full preferences</Link>
          </Button>
        </div>

        {engineError && (
          <p className="text-destructive text-sm" role="alert">
            {engineError}
          </p>
        )}

        {!engineError && homeBase ? (
          <DiscoverExperience
            initialSuggestions={suggestions}
            initialPrefs={{
              styleTags: (prefs?.styleTags ?? []).filter(isStyleTag),
              maxDistanceKm: prefs?.maxDistanceKm ?? 300,
              cadence: prefs?.cadence ?? "monthly",
            }}
            homeBase={homeBase}
            homeBaseLabel={homeBaseLabel}
          />
        ) : (
          !engineError && (
            <div className="rounded-lg border border-dashed px-6 py-12 text-center">
              <p className="font-medium">Set your home base first</p>
              <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm text-pretty">
                We need a home base to anchor the distance ring.
              </p>
              <Button asChild className="mt-4">
                <Link href="/onboarding">Go to onboarding</Link>
              </Button>
            </div>
          )
        )}
      </main>
    </div>
  );
}
