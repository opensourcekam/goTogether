"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { updateDiscoverPreferencesAction } from "@/app/actions";
import type { Cadence } from "@/lib/cadence";
import type { SuggestedTrip } from "@/lib/suggestions";
import type { StyleTag } from "@/lib/travel-styles";

export type LiveSuggestionPrefs = {
  styleTags: StyleTag[];
  maxDistanceKm: number;
  cadence: Cadence;
};

export type UseLiveSuggestionsResult = {
  suggestions: SuggestedTrip[];
  prefs: LiveSuggestionPrefs;
  refreshing: boolean;
  error: string | null;
  toggleTag: (tag: StyleTag) => void;
  setMaxDistanceKm: (km: number) => void;
  setCadence: (cadence: Cadence) => void;
};

const DISTANCE_DEBOUNCE_MS = 450;
const TAG_DEBOUNCE_MS = 350;
const CADENCE_DEBOUNCE_MS = 200;

/**
 * Keeps the discover feed in sync with the inline preference dials: applies
 * optimistic pref changes, debounces the persisted `generateSuggestions`
 * re-run, and guards against out-of-order responses via a request id so the
 * feed never flickers back to a stale result.
 */
export function useLiveSuggestions(initial: {
  suggestions: SuggestedTrip[];
  prefs: LiveSuggestionPrefs;
}): UseLiveSuggestionsResult {
  const [prefs, setPrefs] = useState<LiveSuggestionPrefs>(initial.prefs);
  const [suggestions, setSuggestions] = useState<SuggestedTrip[]>(
    initial.suggestions
  );
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prefsRef = useRef<LiveSuggestionPrefs>(initial.prefs);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const run = useCallback(async (next: LiveSuggestionPrefs) => {
    const requestId = ++requestIdRef.current;
    const result = await updateDiscoverPreferencesAction(next);
    if (requestId !== requestIdRef.current) return;

    setRefreshing(false);
    if (result.status === "error") {
      setError(result.error);
      return;
    }
    setError(null);
    setSuggestions(result.data.suggestions);
  }, []);

  const apply = useCallback(
    (next: LiveSuggestionPrefs, delay: number) => {
      prefsRef.current = next;
      setPrefs(next);
      setError(null);
      setRefreshing(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        void run(next);
      }, delay);
    },
    [run]
  );

  const toggleTag = useCallback(
    (tag: StyleTag) => {
      const current = prefsRef.current.styleTags;
      const nextTags = current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag];

      if (nextTags.length === 0) {
        setError("Keep at least one travel style selected.");
        return;
      }
      apply({ ...prefsRef.current, styleTags: nextTags }, TAG_DEBOUNCE_MS);
    },
    [apply]
  );

  const setMaxDistanceKm = useCallback(
    (km: number) => {
      apply({ ...prefsRef.current, maxDistanceKm: km }, DISTANCE_DEBOUNCE_MS);
    },
    [apply]
  );

  const setCadence = useCallback(
    (cadence: Cadence) => {
      apply({ ...prefsRef.current, cadence }, CADENCE_DEBOUNCE_MS);
    },
    [apply]
  );

  return {
    suggestions,
    prefs,
    refreshing,
    error,
    toggleTag,
    setMaxDistanceKm,
    setCadence,
  };
}
