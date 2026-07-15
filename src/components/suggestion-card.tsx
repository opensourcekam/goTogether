"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPinned, Route, Wallet } from "lucide-react";

import { acceptSuggestionAction } from "@/app/actions";
import { RoutePreview } from "@/components/route-preview";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SuggestedTrip } from "@/lib/suggestions";

function formatDateRange(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startLabel = start.toLocaleDateString(undefined, opts);
  const endLabel = end.toLocaleDateString(undefined, {
    ...opts,
    year: "numeric",
  });
  return `${startLabel} – ${endLabel}`;
}

function formatMoney(amount: number | null | undefined): string {
  if (amount == null) return "Budget TBD";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export type SuggestionCardProps = {
  suggestion: SuggestedTrip;
  index: number;
  isSelected: boolean;
  onSelect: (key: string | null) => void;
};

export function SuggestionCard({
  suggestion,
  index,
  isSelected,
  onSelect,
}: SuggestionCardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const stopPreview = suggestion.stops
    .slice(0, 4)
    .map((stop) => stop.name)
    .join(" · ");

  const thumbnails = suggestion.stops
    .filter((stop) => Boolean(stop.imageUrl))
    .slice(0, 3);

  function onOpen() {
    setError(null);
    startTransition(async () => {
      const result = await acceptSuggestionAction(suggestion);
      if (result.status === "error") {
        setError(result.error);
        return;
      }
      router.push(`/trips/${result.data.tripId}`);
    });
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={cn(
        "bg-card text-card-foreground group flex flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow",
        isSelected
          ? "ring-primary/50 border-primary/50 ring-2"
          : "hover:shadow-md"
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(isSelected ? null : suggestion.suggestionKey)}
        aria-pressed={isSelected}
        className="relative block h-32 w-full overflow-hidden text-left outline-none"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600" />
        <RoutePreview
          origin={suggestion.originGeo}
          stops={suggestion.stops.map((stop) => stop.geo)}
          destination={suggestion.destinationGeo}
          className="absolute inset-0 size-full opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
          <div className="text-white">
            <p className="text-lg leading-tight font-semibold text-balance drop-shadow">
              {suggestion.title}
            </p>
            <p className="text-xs text-white/80">
              {suggestion.originLabel} → {suggestion.destinationLabel}
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-black/35 px-2 py-1 text-xs font-medium text-white backdrop-blur">
            <Route className="size-3" aria-hidden />
            {suggestion.stops.length}
          </span>
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4 text-sm">
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4 shrink-0" aria-hidden />
            {formatDateRange(
              new Date(suggestion.startDate),
              new Date(suggestion.endDate)
            )}
          </span>
          <span className="flex items-center gap-1.5">
            <Wallet className="size-4 shrink-0" aria-hidden />
            {formatMoney(suggestion.budget?.estimateTotal)}
            {suggestion.budget ? ` · ${suggestion.budget.nights}n` : ""}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <MapPinned className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden />
          <div className="min-w-0">
            <p className="font-medium">
              {suggestion.stops.length} stops · {suggestion.poiCount} matching
              POIs
            </p>
            {stopPreview && (
              <p className="text-muted-foreground truncate text-pretty">
                {stopPreview}
              </p>
            )}
          </div>
        </div>

        {thumbnails.length > 0 && (
          <div className="flex gap-2">
            {thumbnails.map((stop) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={stop.poiId}
                src={stop.imageUrl ?? ""}
                alt={stop.name}
                loading="lazy"
                className="h-14 flex-1 rounded-md object-cover"
              />
            ))}
          </div>
        )}

        {suggestion.matchingTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {suggestion.matchingTags.map((tag) => (
              <span
                key={tag}
                className="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {error && (
          <p className="text-destructive text-xs" role="alert">
            {error}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-1">
          <Button className="flex-1" onClick={onOpen} disabled={pending}>
            {pending ? "Opening…" : "Save & open trip"}
            {!pending && <ArrowRight className="size-4" aria-hidden />}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={isSelected ? "Hide on map" : "Show on map"}
            aria-pressed={isSelected}
            onClick={() =>
              onSelect(isSelected ? null : suggestion.suggestionKey)
            }
            className={cn(isSelected && "border-primary text-primary")}
          >
            <MapPinned className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
