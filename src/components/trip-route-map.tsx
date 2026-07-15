"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import type { LngLat } from "@/db/geometry";

/** OpenFreeMap Liberty — free vector tiles, no API key. */
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

export type TripMapStop = {
  id: string;
  name: string;
  geo: LngLat;
  note?: string | null;
};

export type TripRouteMapProps = {
  origin: LngLat | null;
  destination: LngLat | null;
  stops: TripMapStop[];
  selectedStopId: string | null;
  onSelectStop: (id: string | null) => void;
  className?: string;
};

function makeMarkerEl(className: string, label: string): HTMLDivElement {
  const el = document.createElement("div");
  el.className = className;
  el.style.position = "relative";
  el.textContent = label;
  return el;
}

export function TripRouteMap({
  origin,
  destination,
  stops,
  selectedStopId,
  onSelectStop,
  className,
}: TripRouteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const stopMarkersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const selectedRef = useRef<string | null>(selectedStopId);
  const onSelectRef = useRef(onSelectStop);
  const [ready, setReady] = useState(false);

  // Keep the latest props available to async map callbacks/event handlers.
  useEffect(() => {
    selectedRef.current = selectedStopId;
    onSelectRef.current = onSelectStop;
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: destination ?? origin ?? { lng: 0, lat: 20 },
      zoom: 4,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    map.on("load", () => {
      const points: LngLat[] = [];

      if (origin) {
        points.push(origin);
        new maplibregl.Marker({
          element: makeMarkerEl("gt-marker gt-marker--home", "★"),
        })
          .setLngLat(origin)
          .setPopup(new maplibregl.Popup({ offset: 16 }).setText("Home base"))
          .addTo(map);
      }

      stops.forEach((stop, index) => {
        points.push(stop.geo);
        const isSelected = stop.id === selectedRef.current;
        const el = makeMarkerEl(
          `gt-marker${isSelected ? " gt-marker--selected gt-marker--pulse" : ""}`,
          String(index + 1)
        );
        el.addEventListener("click", (event) => {
          event.stopPropagation();
          const next = selectedRef.current === stop.id ? null : stop.id;
          onSelectRef.current(next);
        });
        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(stop.geo)
          .setPopup(
            new maplibregl.Popup({ offset: 16 }).setHTML(
              `<strong>${stop.name}</strong>${
                stop.note ? `<br/><span>${stop.note}</span>` : ""
              }`
            )
          )
          .addTo(map);
        stopMarkersRef.current.set(stop.id, marker);
      });

      if (destination) {
        points.push(destination);
        new maplibregl.Marker({
          element: makeMarkerEl("gt-marker gt-marker--dest", "◎"),
        })
          .setLngLat(destination)
          .setPopup(
            new maplibregl.Popup({ offset: 16 }).setText("Destination")
          )
          .addTo(map);
      }

      const lineCoords: [number, number][] = [];
      if (origin) lineCoords.push([origin.lng, origin.lat]);
      for (const stop of stops) {
        lineCoords.push([stop.geo.lng, stop.geo.lat]);
      }
      if (destination) lineCoords.push([destination.lng, destination.lat]);

      if (lineCoords.length >= 2) {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: lineCoords },
          },
        });
        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": "#52525b",
            "line-width": 3,
            "line-opacity": 0.85,
          },
        });
      }

      if (points.length > 0) {
        const bounds = new maplibregl.LngLatBounds();
        for (const point of points) {
          bounds.extend([point.lng, point.lat]);
        }
        map.fitBounds(bounds, { padding: 56, maxZoom: 8 });
      }

      setReady(true);
    });

    const stopMarkers = stopMarkersRef.current;
    return () => {
      map.remove();
      mapRef.current = null;
      stopMarkers.clear();
      setReady(false);
    };
  }, [origin, destination, stops]);

  // Sync marker highlight + fly-to with the externally-selected stop.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    for (const [id, marker] of stopMarkersRef.current.entries()) {
      const el = marker.getElement();
      const selected = id === selectedStopId;
      el.classList.toggle("gt-marker--selected", selected);
      el.classList.toggle("gt-marker--pulse", selected);
    }

    if (selectedStopId) {
      const stop = stops.find((item) => item.id === selectedStopId);
      if (stop) {
        map.flyTo({ center: stop.geo, zoom: 9, duration: 800, essential: true });
      }
    }
  }, [selectedStopId, ready, stops]);

  return (
    <div
      ref={containerRef}
      className={
        className ??
        "h-72 w-full overflow-hidden rounded-xl border sm:h-96"
      }
      aria-label="Trip route map"
    />
  );
}
