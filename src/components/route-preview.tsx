import type { LngLat } from "@/db/geometry";

const VIEW_W = 320;
const VIEW_H = 120;
const PAD = 18;

type Projected = { x: number; y: number };

function project(points: LngLat[]): Projected[] {
  if (points.length === 0) return [];

  const lngs = points.map((p) => p.lng);
  const lats = points.map((p) => p.lat);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const spanLng = maxLng - minLng || 1;
  const spanLat = maxLat - minLat || 1;
  const innerW = VIEW_W - PAD * 2;
  const innerH = VIEW_H - PAD * 2;

  return points.map((p) => ({
    x: PAD + ((p.lng - minLng) / spanLng) * innerW,
    // Flip lat so north renders up.
    y: PAD + (1 - (p.lat - minLat) / spanLat) * innerH,
  }));
}

export type RoutePreviewProps = {
  origin: LngLat;
  stops: LngLat[];
  destination: LngLat;
  className?: string;
};

/**
 * Cheap, dependency-free SVG "route sparkline" for suggestion cards — avoids
 * mounting a full MapLibre instance per card while still hinting the journey
 * shape from home base through stops to the destination.
 */
export function RoutePreview({
  origin,
  stops,
  destination,
  className,
}: RoutePreviewProps) {
  const points = project([origin, ...stops, destination]);
  if (points.length < 2) return null;

  const path = points.map((p) => `${p.x},${p.y}`).join(" ");
  const [first] = points;
  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <polyline
        points={path}
        fill="none"
        stroke="white"
        strokeOpacity={0.55}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="360"
        strokeDashoffset="360"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="360"
          to="0"
          dur="0.9s"
          fill="freeze"
        />
      </polyline>
      {points.slice(1, -1).map((p, index) => (
        <circle key={index} cx={p.x} cy={p.y} r={3} fill="white" fillOpacity={0.7} />
      ))}
      <circle cx={first.x} cy={first.y} r={5} fill="white" />
      <circle cx={last.x} cy={last.y} r={6} fill="#fde68a" stroke="white" strokeWidth={2}>
        <animate
          attributeName="r"
          values="6;8;6"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
