"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Compass } from "lucide-react";

import { DiscoverControls } from "@/components/discover-controls";
import { DiscoverMap, type DiscoverMapPoint } from "@/components/discover-map";
import { SuggestionCard } from "@/components/suggestion-card";
import { SuggestionCardSkeleton } from "@/components/suggestion-card-skeleton";
import {
  useLiveSuggestions,
  type LiveSuggestionPrefs,
} from "@/lib/hooks/use-live-suggestions";
import type { LngLat } from "@/db/geometry";
import type { SuggestedTrip } from "@/lib/suggestions";

export type DiscoverExperienceProps = {
  initialSuggestions: SuggestedTrip[];
  initialPrefs: LiveSuggestionPrefs;
  homeBase: LngLat;
  homeBaseLabel: string;
};

export function DiscoverExperience({
  initialSuggestions,
  initialPrefs,
  homeBase,
  homeBaseLabel,
}: DiscoverExperienceProps) {
  const { suggestions, prefs, refreshing, error, toggleTag, setMaxDistanceKm, setCadence } =
    useLiveSuggestions({ suggestions: initialSuggestions, prefs: initialPrefs });

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Derive the active selection so a re-suggest that drops the highlighted
  // destination can't leave a dangling map focus (avoids a setState effect).
  const activeKey =
    selectedKey &&
    suggestions.some((item) => item.suggestionKey === selectedKey)
      ? selectedKey
      : null;

  const mapPoints = useMemo<DiscoverMapPoint[]>(
    () =>
      suggestions.map((item) => ({
        key: item.suggestionKey,
        label: item.destinationLabel,
        geo: item.destinationGeo,
      })),
    [suggestions]
  );

  const showSkeletons = refreshing && suggestions.length === 0;
  const showEmpty = !refreshing && suggestions.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <DiscoverControls
        styleTags={prefs.styleTags}
        maxDistanceKm={prefs.maxDistanceKm}
        cadence={prefs.cadence}
        homeBaseLabel={homeBaseLabel}
        pending={refreshing}
        onToggleTag={toggleTag}
        onMaxDistanceChange={setMaxDistanceKm}
        onCadenceChange={setCadence}
      />

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          <span className="text-foreground font-medium tabular-nums">
            {suggestions.length}
          </span>{" "}
          {suggestions.length === 1 ? "wanderlust" : "wanderlusts"} within{" "}
          {prefs.maxDistanceKm} km
        </p>
        {activeKey && (
          <button
            type="button"
            onClick={() => setSelectedKey(null)}
            className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-2"
          >
            Clear map focus
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div className="order-2 lg:order-1">
          {showSkeletons && (
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <SuggestionCardSkeleton key={index} />
              ))}
            </div>
          )}

          {showEmpty && (
            <div className="rounded-xl border border-dashed px-6 py-14 text-center">
              <Compass className="text-muted-foreground mx-auto size-8" aria-hidden />
              <p className="mt-3 font-medium">No wanderlusts in range yet</p>
              <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm text-pretty">
                Widen your distance ring or add more travel styles above — the
                engine needs geocoded POIs with matching tags inside your range.
              </p>
            </div>
          )}

          {suggestions.length > 0 && (
            <motion.div layout className="grid gap-5 sm:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {suggestions.map((suggestion, index) => (
                  <SuggestionCard
                    key={suggestion.suggestionKey}
                    suggestion={suggestion}
                    index={index}
                    isSelected={activeKey === suggestion.suggestionKey}
                    onSelect={setSelectedKey}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        <div className="order-1 h-72 sm:h-96 lg:sticky lg:top-6 lg:order-2 lg:h-[calc(100dvh-9rem)]">
          <DiscoverMap
            homeBase={homeBase}
            homeBaseLabel={homeBaseLabel}
            points={mapPoints}
            selectedKey={activeKey}
            onSelect={setSelectedKey}
          />
        </div>
      </div>
    </div>
  );
}
