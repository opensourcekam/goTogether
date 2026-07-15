"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import type { LngLat } from "@/db/geometry";

/** OpenFreeMap Liberty — free vector tiles, no API key. */
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const SPOKES_SOURCE = "discover-spokes";
const SPOKES_LAYER = "discover-spokes-line";

export type DiscoverMapPoint = {
  key: string;
  label: string;
  geo: LngLat;
};

type SpokeFeatureCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: { key: string; selected: boolean };
    geometry: { type: "LineString"; coordinates: [number, number][] };
  }>;
};

export type DiscoverMapProps = {
  homeBase: LngLat;
  homeBaseLabel: string;
  points: DiscoverMapPoint[];
  selectedKey: string | null;
  onSelect: (key: string | null) => void;
};

function makeMarkerEl(className: string, label: string): HTMLDivElement {
  const el = document.createElement("div");
  el.className = className;
  el.style.position = "relative";
  el.textContent = label;
  return el;
}

function spokeCollection(
  homeBase: LngLat,
  points: DiscoverMapPoint[],
  selectedKey: string | null
): SpokeFeatureCollection {
  return {
    type: "FeatureCollection",
    features: points.map((point) => ({
      type: "Feature",
      properties: { key: point.key, selected: point.key === selectedKey },
      geometry: {
        type: "LineString",
        coordinates: [
          [homeBase.lng, homeBase.lat],
          [point.geo.lng, point.geo.lat],
        ],
      },
    })),
  };
}

export function DiscoverMap({
  homeBase,
  homeBaseLabel,
  points,
  selectedKey,
  onSelect,
}: DiscoverMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const destMarkersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const pointsRef = useRef<DiscoverMapPoint[]>(points);
  const selectedRef = useRef<string | null>(selectedKey);
  const onSelectRef = useRef(onSelect);
  const [ready, setReady] = useState(false);

  // Keep the latest props available to async map callbacks/event handlers
  // without re-running the map setup effect.
  useEffect(() => {
    pointsRef.current = points;
    selectedRef.current = selectedKey;
    onSelectRef.current = onSelect;
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: homeBase,
      zoom: 5,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    new maplibregl.Marker({ element: makeMarkerEl("gt-marker gt-marker--home", "★") })
      .setLngLat(homeBase)
      .setPopup(new maplibregl.Popup({ offset: 16 }).setText(homeBaseLabel))
      .addTo(map);

    map.on("load", () => {
      map.addSource(SPOKES_SOURCE, {
        type: "geojson",
        data: spokeCollection(homeBase, pointsRef.current, selectedRef.current),
      });
      map.addLayer({
        id: SPOKES_LAYER,
        type: "line",
        source: SPOKES_SOURCE,
        layout: { "line-cap": "round" },
        paint: {
          "line-color": [
            "case",
            ["get", "selected"],
            "#ea580c",
            "#a1a1aa",
          ],
          "line-width": ["case", ["get", "selected"], 3, 1.25],
          "line-opacity": ["case", ["get", "selected"], 0.9, 0.4],
          "line-dasharray": [2, 1.5],
        },
      });
      setReady(true);
    });

    const destMarkers = destMarkersRef.current;
    return () => {
      map.remove();
      mapRef.current = null;
      destMarkers.clear();
      setReady(false);
    };
    // Home base identity drives a full remount (rare); markers/points update
    // via the effects below.
  }, [homeBase, homeBaseLabel]);

  // Rebuild destination markers + fit bounds when the suggestion set changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    for (const marker of destMarkersRef.current.values()) {
      marker.remove();
    }
    destMarkersRef.current.clear();

    points.forEach((point, index) => {
      const isSelected = point.key === selectedRef.current;
      const el = makeMarkerEl(
        `gt-marker gt-marker--dest${isSelected ? " gt-marker--selected gt-marker--pulse" : ""}`,
        String(index + 1)
      );
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        const next = selectedRef.current === point.key ? null : point.key;
        onSelectRef.current(next);
      });
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(point.geo)
        .setPopup(
          new maplibregl.Popup({ offset: 16 }).setText(point.label)
        )
        .addTo(map);
      destMarkersRef.current.set(point.key, marker);
    });

    const source = map.getSource(SPOKES_SOURCE);
    if (source && "setData" in source) {
      (source as maplibregl.GeoJSONSource).setData(
        spokeCollection(homeBase, points, selectedRef.current)
      );
    }

    const bounds = new maplibregl.LngLatBounds();
    bounds.extend([homeBase.lng, homeBase.lat]);
    for (const point of points) {
      bounds.extend([point.geo.lng, point.geo.lat]);
    }
    if (points.length > 0) {
      map.fitBounds(bounds, { padding: 64, maxZoom: 9, duration: 700 });
    }
  }, [points, ready, homeBase]);

  // Respond to selection: highlight marker, redraw spokes, fly to destination.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    for (const [key, marker] of destMarkersRef.current.entries()) {
      const el = marker.getElement();
      const selected = key === selectedKey;
      el.classList.toggle("gt-marker--selected", selected);
      el.classList.toggle("gt-marker--pulse", selected);
    }

    const source = map.getSource(SPOKES_SOURCE);
    if (source && "setData" in source) {
      (source as maplibregl.GeoJSONSource).setData(
        spokeCollection(homeBase, pointsRef.current, selectedKey)
      );
    }

    if (selectedKey) {
      const point = pointsRef.current.find((item) => item.key === selectedKey);
      if (point) {
        map.flyTo({ center: point.geo, zoom: 7, duration: 900, essential: true });
      }
    }
  }, [selectedKey, ready, homeBase]);

  return (
    <div
      ref={containerRef}
      className="h-72 w-full overflow-hidden rounded-xl border sm:h-full sm:min-h-[28rem]"
      aria-label="Map of your home base and suggested destinations"
    />
  );
}
