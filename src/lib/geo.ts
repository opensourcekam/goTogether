/**
 * Rough great-circle helpers for along-route stop picking.
 * Distances are in meters; coordinates are WGS84 lng/lat.
 */

import type { LngLat } from "@/db/geometry";

const EARTH_RADIUS_M = 6_371_000;

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function haversineMeters(a: LngLat, b: LngLat): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Fraction along A→B of the closest point on the segment to P (0..1). */
export function projectFraction(a: LngLat, b: LngLat, p: LngLat): number {
  const ax = a.lng;
  const ay = a.lat;
  const bx = b.lng;
  const by = b.lat;
  const px = p.lng;
  const py = p.lat;

  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return 0;

  const t = ((px - ax) * dx + (py - ay) * dy) / len2;
  return Math.max(0, Math.min(1, t));
}

export function interpolate(a: LngLat, b: LngLat, t: number): LngLat {
  return {
    lng: a.lng + (b.lng - a.lng) * t,
    lat: a.lat + (b.lat - a.lat) * t,
  };
}

/** Perpendicular distance from P to the A→B segment, in meters. */
export function distanceToSegmentMeters(
  a: LngLat,
  b: LngLat,
  p: LngLat
): number {
  const t = projectFraction(a, b, p);
  const closest = interpolate(a, b, t);
  return haversineMeters(p, closest);
}

export function centroid(points: LngLat[]): LngLat | null {
  if (points.length === 0) return null;
  const sum = points.reduce(
    (acc, point) => ({ lng: acc.lng + point.lng, lat: acc.lat + point.lat }),
    { lng: 0, lat: 0 }
  );
  return {
    lng: sum.lng / points.length,
    lat: sum.lat / points.length,
  };
}
