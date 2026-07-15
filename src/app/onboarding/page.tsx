import type { Metadata } from "next";

import { AppHeader } from "@/components/app-header";
import { OnboardingForm } from "@/components/onboarding-form";
import { requireAppUser, isDatabaseConfigured } from "@/lib/auth";
import { getUserPreferences } from "@/lib/suggestions";
import type { Preference } from "@/db/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Set your home base, travel style, distance, and cadence.",
};

export default async function OnboardingPage() {
  const user = await requireAppUser();

  let prefsError: string | null = null;
  let prefs: Preference | null = null;

  if (isDatabaseConfigured()) {
    try {
      prefs = await getUserPreferences(user.id);
    } catch (error) {
      prefsError =
        error instanceof Error
          ? error.message
          : "Could not load your saved preferences.";
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader title="Onboarding" />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">
            Set your wanderlust dials
          </h1>
          <p className="text-muted-foreground max-w-2xl text-pretty">
            Home base, style, range, and how often you want to get lost — then
            we&apos;ll suggest trips with stops on the way.
          </p>
        </div>

        {prefsError && (
          <p className="text-destructive text-sm" role="alert">
            {prefsError} You can still set preferences below; saving may fail
            until the database is reachable.
          </p>
        )}

        <OnboardingForm
          initial={
            prefs
              ? {
                  homeBase: prefs.homeBase,
                  homeBaseLabel: prefs.homeBaseLabel,
                  styleTags: prefs.styleTags,
                  maxDistanceKm: prefs.maxDistanceKm,
                  cadence: prefs.cadence,
                }
              : null
          }
        />
      </main>
    </div>
  );
}
