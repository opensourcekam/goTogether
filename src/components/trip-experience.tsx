"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

import { TripRouteMap, type TripMapStop } from "@/components/trip-route-map";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LngLat } from "@/db/geometry";

export type TripStopDetail = {
  id: string;
  name: string;
  subtitle: string | null;
  note: string | null;
  sourceLink: string | null;
  geo: LngLat | null;
};

export type TripExperienceProps = {
  origin: LngLat | null;
  destination: LngLat | null;
  stops: TripStopDetail[];
};

export function TripExperience({
  origin,
  destination,
  stops,
}: TripExperienceProps) {
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  const mapStops: TripMapStop[] = stops
    .filter((stop): stop is TripStopDetail & { geo: LngLat } => stop.geo != null)
    .map((stop) => ({
      id: stop.id,
      name: stop.name,
      geo: stop.geo,
      note: stop.note,
    }));

  // When a marker click changes the selection, bring the matching list row
  // into view so the map and list stay in lock-step.
  useEffect(() => {
    if (!selectedStopId) return;
    const node = itemRefs.current.get(selectedStopId);
    node?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedStopId]);

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="lg:sticky lg:top-6 lg:self-start">
        <TripRouteMap
          origin={origin}
          destination={destination}
          stops={mapStops}
          selectedStopId={selectedStopId}
          onSelectStop={setSelectedStopId}
          className="h-72 w-full overflow-hidden rounded-xl border sm:h-96 lg:h-[30rem]"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-5" aria-hidden />
            Stops on the way
          </CardTitle>
          <CardDescription>
            Tap a stop to spotlight it on the map — reorder later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stops.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No stops saved for this trip.
            </p>
          ) : (
            <ol className="space-y-2">
              {stops.map((stop, index) => {
                const selected = stop.id === selectedStopId;
                const selectable = stop.geo != null;
                return (
                  <motion.li
                    key={stop.id}
                    ref={(node) => {
                      if (node) itemRefs.current.set(stop.id, node);
                      else itemRefs.current.delete(stop.id);
                    }}
                    layout
                    whileHover={selectable ? { x: 2 } : undefined}
                  >
                    <button
                      type="button"
                      disabled={!selectable}
                      aria-pressed={selected}
                      onClick={() =>
                        setSelectedStopId(selected ? null : stop.id)
                      }
                      className={cn(
                        "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                        selected
                          ? "border-primary bg-primary/5 ring-primary/20 ring-1"
                          : "border-transparent hover:bg-accent",
                        !selectable && "cursor-default"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors",
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        )}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium">
                          {stop.name || "Unknown place"}
                        </p>
                        {stop.subtitle && (
                          <p className="text-muted-foreground text-sm text-pretty">
                            {stop.subtitle}
                          </p>
                        )}
                        {stop.note && (
                          <p className="text-muted-foreground mt-1 text-xs">
                            {stop.note}
                          </p>
                        )}
                        {stop.sourceLink && (
                          <a
                            href={stop.sourceLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            className="text-xs underline"
                          >
                            Source
                          </a>
                        )}
                      </div>
                    </button>
                  </motion.li>
                );
              })}
            </ol>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
