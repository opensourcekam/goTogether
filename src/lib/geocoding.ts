/** Shared Nominatim (OpenStreetMap) geocoding helpers — no API key required. */

export const NOMINATIM_SEARCH_URL =
  "https://nominatim.openstreetmap.org/search";

/** Required by Nominatim usage policy — identify the app, not a generic browser. */
export const NOMINATIM_USER_AGENT =
  "goTogether/0.1 (travel planning; https://github.com/opensourcekam/goTogether)";

/** Nominatim asks for ≤1 request/second on the public instance. */
export const NOMINATIM_MIN_INTERVAL_MS = 1100;

export type NominatimResult = {
  place_id: number;
  display_name: string;
  name?: string;
  lat: string;
  lon: string;
  type?: string;
  class?: string;
};

export type GeocodeSuggestion = {
  id: string;
  label: string;
  placeName: string;
  center: { lng: number; lat: number };
};

export function mapNominatimResults(
  results: NominatimResult[]
): GeocodeSuggestion[] {
  return results
    .map((item) => {
      const lng = Number(item.lon);
      const lat = Number(item.lat);
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
      const placeName =
        item.name?.trim() ||
        item.display_name.split(",")[0]?.trim() ||
        item.display_name;
      return {
        id: String(item.place_id),
        label: item.display_name,
        placeName,
        center: { lng, lat },
      };
    })
    .filter((item): item is GeocodeSuggestion => item != null);
}
