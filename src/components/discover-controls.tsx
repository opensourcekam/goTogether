"use client";

import { Loader2, MapPin, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { CADENCE_OPTIONS, type Cadence } from "@/lib/cadence";
import { STYLE_TAG_LABELS, STYLE_TAGS, type StyleTag } from "@/lib/travel-styles";
import { cn } from "@/lib/utils";

export type DiscoverControlsProps = {
  styleTags: StyleTag[];
  maxDistanceKm: number;
  cadence: Cadence;
  homeBaseLabel: string;
  pending: boolean;
  onToggleTag: (tag: StyleTag) => void;
  onMaxDistanceChange: (km: number) => void;
  onCadenceChange: (cadence: Cadence) => void;
};

export function DiscoverControls({
  styleTags,
  maxDistanceKm,
  cadence,
  homeBaseLabel,
  pending,
  onToggleTag,
  onMaxDistanceChange,
  onCadenceChange,
}: DiscoverControlsProps) {
  return (
    <div className="bg-card/60 supports-[backdrop-filter]:bg-card/50 rounded-xl border p-5 shadow-sm backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <SlidersHorizontal className="size-4" aria-hidden />
          Tune your wanderlust
        </div>
        <div
          className={cn(
            "text-muted-foreground flex items-center gap-1.5 text-xs transition-opacity",
            pending ? "opacity-100" : "opacity-0"
          )}
          aria-live="polite"
        >
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
          Refreshing…
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="discover-distance"
                className="text-sm font-medium"
              >
                Distance from{" "}
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden />
                  {homeBaseLabel || "home"}
                </span>
              </label>
              <span className="text-muted-foreground text-sm tabular-nums">
                {maxDistanceKm} km
              </span>
            </div>
            <Input
              id="discover-distance"
              type="range"
              min={50}
              max={2000}
              step={50}
              value={maxDistanceKm}
              onChange={(event) =>
                onMaxDistanceChange(Number.parseInt(event.target.value, 10))
              }
              className="cursor-pointer accent-[color:var(--primary)]"
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Travel style</span>
            <div className="flex flex-wrap gap-2">
              {STYLE_TAGS.map((tag) => {
                const selected = styleTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onToggleTag(tag)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-all active:scale-95",
                      selected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-background hover:bg-accent hover:border-foreground/20"
                    )}
                  >
                    {STYLE_TAG_LABELS[tag]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <fieldset className="space-y-2 lg:w-56">
          <legend className="text-sm font-medium">How often</legend>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {CADENCE_OPTIONS.map((option) => {
              const selected = cadence === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onCadenceChange(option.value)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left transition-all active:scale-[0.98]",
                    selected
                      ? "border-primary bg-primary/5 ring-primary/20 ring-1"
                      : "hover:bg-accent"
                  )}
                >
                  <div className="text-xs font-medium">{option.label}</div>
                  <div className="text-muted-foreground text-[0.7rem] leading-tight">
                    {option.description}
                  </div>
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
