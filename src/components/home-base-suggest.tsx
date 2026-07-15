"use client";

import { useEffect, useId, useRef, useState, useEffectEvent } from "react";
import { MapPin, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { LngLat } from "@/db/geometry";
import type { GeocodeSuggestion } from "@/lib/geocoding";

export type GeocodeResult = GeocodeSuggestion;

export function HomeBaseSuggest({
  value,
  onChange,
  disabled,
}: {
  value: { label: string; center: LngLat | null };
  onChange: (next: { label: string; center: LngLat | null }) => void;
  disabled?: boolean;
}) {
  const listId = useId();
  const [query, setQuery] = useState(value.label);
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useEffectEvent(async (text: string) => {
    if (text.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url = new URL("/api/geocode", window.location.origin);
      url.searchParams.set("q", text.trim());

      const response = await fetch(url.toString());
      const data = (await response.json()) as {
        results?: GeocodeResult[];
        error?: string;
      };

      if (!response.ok) {
        setResults([]);
        setError(
          data.error ??
            (response.status === 429
              ? "Place search is rate-limited. Wait a moment and try again."
              : "Place search failed. Try again shortly.")
        );
        return;
      }

      const mapped = data.results ?? [];
      setResults(mapped);
      setOpen(mapped.length > 0);
      if (mapped.length === 0 && !data.error) {
        setError(null);
      }
    } catch {
      setError("Place search is unavailable right now. Try again shortly.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    // Debounce to stay polite with Nominatim (~1 req/s on the public API).
    const handle = setTimeout(() => {
      void fetchSuggestions(query);
    }, 500);
    return () => clearTimeout(handle);
  }, [query]);

  function selectResult(result: GeocodeResult) {
    setQuery(result.label);
    onChange({ label: result.label, center: result.center });
    setOpen(false);
    setResults([]);
  }

  return (
    <div className="relative space-y-2">
      <label htmlFor={listId} className="text-sm font-medium">
        Home base
      </label>
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          id={listId}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={disabled}
          placeholder="Start typing a city…"
          className="pl-9"
          value={query}
          onChange={(event) => {
            const next = event.target.value;
            setQuery(next);
            onChange({ label: next, center: null });
          }}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 150);
          }}
        />
      </div>

      {loading && (
        <p className="text-muted-foreground text-xs">Searching places…</p>
      )}
      {error && <p className="text-muted-foreground text-xs">{error}</p>}

      {open && results.length > 0 && (
        <ul
          className="bg-popover absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border shadow-md"
          onMouseDown={(event) => {
            // Keep input from blurring before click registers.
            event.preventDefault();
            if (blurTimer.current) clearTimeout(blurTimer.current);
          }}
        >
          {results.map((result) => (
            <li key={result.id}>
              <button
                type="button"
                className={cn(
                  "hover:bg-accent flex w-full items-start gap-2 px-3 py-2 text-left text-sm"
                )}
                onClick={() => selectResult(result)}
              >
                <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <span>{result.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {value.center && (
        <p className="text-muted-foreground text-xs">
          Selected: {value.label} ({value.center.lat.toFixed(3)},{" "}
          {value.center.lng.toFixed(3)})
        </p>
      )}
    </div>
  );
}
