"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { savePreferencesAction } from "@/app/actions";
import { HomeBaseSuggest } from "@/components/home-base-suggest";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CADENCE_OPTIONS, type Cadence } from "@/lib/cadence";
import { STYLE_TAG_LABELS, STYLE_TAGS, type StyleTag } from "@/lib/travel-styles";
import { cn } from "@/lib/utils";
import type { LngLat } from "@/db/geometry";
import type { Preference } from "@/db/schema";

type OnboardingFormProps = {
  initial?: Pick<
    Preference,
    "homeBase" | "homeBaseLabel" | "styleTags" | "maxDistanceKm" | "cadence"
  > | null;
};

export function OnboardingForm({ initial }: OnboardingFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [homeBase, setHomeBase] = useState<{
    label: string;
    center: LngLat | null;
  }>({
    label: initial?.homeBaseLabel ?? "",
    center: initial?.homeBase ?? null,
  });

  const [styleTags, setStyleTags] = useState<StyleTag[]>(
    (initial?.styleTags?.filter((tag): tag is StyleTag =>
      (STYLE_TAGS as readonly string[]).includes(tag)
    ) as StyleTag[]) ?? ["quirky", "hidden"]
  );

  const [maxDistanceKm, setMaxDistanceKm] = useState(
    initial?.maxDistanceKm ?? 300
  );
  const [cadence, setCadence] = useState<Cadence>(
    initial?.cadence ?? "monthly"
  );

  function toggleTag(tag: StyleTag) {
    setStyleTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag]
    );
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!homeBase.center) {
      setError("Select a home base from the place suggestions.");
      return;
    }

    startTransition(async () => {
      const result = await savePreferencesAction({
        homeBaseLabel: homeBase.label,
        homeBase: homeBase.center!,
        styleTags,
        maxDistanceKm,
        cadence,
      });

      if (result.status === "error") {
        setError(result.error);
        return;
      }

      router.push("/discover");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Where are you starting from?</CardTitle>
          <CardDescription>
            Your home base anchors the distance ring for suggested trips.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HomeBaseSuggest value={homeBase} onChange={setHomeBase} disabled={pending} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What&apos;s your travel style?</CardTitle>
          <CardDescription>
            Tags match the Atlas Obscura enrichment seed — pick what pulls you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {STYLE_TAGS.map((tag) => {
              const selected = styleTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  disabled={pending}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm transition-colors",
                    selected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-accent"
                  )}
                >
                  {STYLE_TAG_LABELS[tag]}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How far & how often?</CardTitle>
          <CardDescription>
            Max distance feeds the PostGIS ring; cadence sets suggested dates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="max-distance" className="text-sm font-medium">
                Max distance
              </label>
              <span className="text-muted-foreground text-sm tabular-nums">
                {maxDistanceKm} km
              </span>
            </div>
            <Input
              id="max-distance"
              type="range"
              min={50}
              max={2000}
              step={50}
              value={maxDistanceKm}
              disabled={pending}
              onChange={(event) =>
                setMaxDistanceKm(Number.parseInt(event.target.value, 10))
              }
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Cadence</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {CADENCE_OPTIONS.map((option) => {
                const selected = cadence === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={pending}
                    onClick={() => setCadence(option.value)}
                    className={cn(
                      "rounded-md border px-3 py-3 text-left transition-colors",
                      selected
                        ? "border-primary bg-primary/5"
                        : "hover:bg-accent"
                    )}
                  >
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-muted-foreground text-xs">
                      {option.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </CardContent>
      </Card>

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving…" : "Save & see suggestions"}
      </Button>
    </form>
  );
}
