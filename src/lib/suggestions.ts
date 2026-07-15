import "server-only";

import { and, arrayOverlaps, eq, sql } from "drizzle-orm";

import {
  db,
  schema,
  withinMeters,
  type CityPrice,
  type LngLat,
  type Poi,
  type Preference,
  type User,
} from "@/db";
import { suggestTripDates, type Cadence } from "@/lib/cadence";
import {
  centroid,
  distanceToSegmentMeters,
  haversineMeters,
  projectFraction,
} from "@/lib/geo";
import { isDatabaseConfigured } from "@/lib/auth";

export type BasePreference = Pick<
  Preference,
  | "id"
  | "userId"
  | "homeBase"
  | "homeBaseLabel"
  | "styleTags"
  | "maxDistanceKm"
  | "cadence"
>;

export type SuggestedStop = {
  poiId: Poi["id"];
  name: Poi["name"];
  subtitle: Poi["subtitle"];
  cityLabel: Poi["cityLabel"];
  country: Poi["country"];
  imageUrl: Poi["imageUrl"];
  sourceLink: Poi["sourceLink"];
  geo: LngLat;
  styleTags: Poi["styleTags"];
  order: number;
  note: string | null;
};

export type SuggestedBudget = {
  city: CityPrice["city"];
  country: CityPrice["country"];
  hostel: number | null;
  hotel: number | null;
  backpacker: number | null;
  priceIndex: number | null;
  /** Rough trip total: nights × backpacker (or hotel fallback). */
  estimateTotal: number | null;
  nights: number;
};

export type SuggestedTrip = {
  /** Stable key for React lists before the trip is persisted. */
  suggestionKey: string;
  title: string;
  originLabel: string;
  originGeo: LngLat;
  destinationLabel: string;
  destinationGeo: LngLat;
  destinationCity: string;
  destinationCountry: string | null;
  startDate: Date;
  endDate: Date;
  stops: SuggestedStop[];
  budget: SuggestedBudget | null;
  matchingTags: string[];
  poiCount: number;
};

const MAX_DESTINATIONS = 8;
const MAX_STOPS_ON_WAY = 4;
const CORRIDOR_METERS = 80_000;
const MIN_CLUSTER_SIZE = 2;

function parseMoney(value: string | null): number | null {
  if (value == null) return null;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

function nightsBetween(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function cityKey(city: string, country: string | null): string {
  return `${city.trim().toLowerCase()}|${(country ?? "").trim().toLowerCase()}`;
}

function isCompletePreference(
  prefs: Preference | undefined | null
): prefs is Preference & {
  homeBase: LngLat;
  homeBaseLabel: string;
  maxDistanceKm: number;
  cadence: Cadence;
} {
  return Boolean(
    prefs?.homeBase &&
      prefs.homeBaseLabel &&
      prefs.maxDistanceKm &&
      prefs.cadence &&
      prefs.styleTags.length > 0
  );
}

export async function getUserPreferences(
  userId: User["id"]
): Promise<Preference | null> {
  if (!isDatabaseConfigured()) return null;

  const prefs = await db.query.preferences.findFirst({
    where: eq(schema.preferences.userId, userId),
  });
  return prefs ?? null;
}

export function preferencesAreComplete(
  prefs: Preference | null | undefined
): boolean {
  return isCompletePreference(prefs);
}

type PoiCluster = {
  cityLabel: string;
  country: string | null;
  pois: Array<Poi & { geo: LngLat }>;
};

function clusterByCity(pois: Array<Poi & { geo: LngLat }>): PoiCluster[] {
  const map = new Map<string, PoiCluster>();

  for (const poi of pois) {
    const city = poi.cityLabel?.trim();
    if (!city) continue;
    const key = cityKey(city, poi.country);
    const existing = map.get(key);
    if (existing) {
      existing.pois.push(poi);
    } else {
      map.set(key, {
        cityLabel: city,
        country: poi.country,
        pois: [poi],
      });
    }
  }

  return [...map.values()]
    .filter((cluster) => cluster.pois.length >= MIN_CLUSTER_SIZE)
    .sort((a, b) => b.pois.length - a.pois.length);
}

function pickAlongRouteStops(input: {
  homeBase: LngLat;
  destination: LngLat;
  destinationPois: Array<Poi & { geo: LngLat }>;
  corridorCandidates: Array<Poi & { geo: LngLat }>;
}): SuggestedStop[] {
  const { homeBase, destination, destinationPois, corridorCandidates } = input;

  const onTheWay = corridorCandidates
    .filter((poi) => {
      const t = projectFraction(homeBase, destination, poi.geo);
      if (t < 0.08 || t > 0.92) return false;
      return distanceToSegmentMeters(homeBase, destination, poi.geo) <= CORRIDOR_METERS;
    })
    .map((poi) => ({
      poi,
      t: projectFraction(homeBase, destination, poi.geo),
      fromHome: haversineMeters(homeBase, poi.geo),
    }))
    .sort((a, b) => a.t - b.t)
    .slice(0, MAX_STOPS_ON_WAY);

  // Destination highlights: farthest-from-home POIs in the city (usually the "main" sights).
  const destHighlights = [...destinationPois]
    .sort(
      (a, b) =>
        haversineMeters(homeBase, b.geo) - haversineMeters(homeBase, a.geo)
    )
    .slice(0, 3);

  const stops: SuggestedStop[] = [];
  let order = 0;

  for (const { poi } of onTheWay) {
    stops.push({
      poiId: poi.id,
      name: poi.name,
      subtitle: poi.subtitle,
      cityLabel: poi.cityLabel,
      country: poi.country,
      imageUrl: poi.imageUrl,
      sourceLink: poi.sourceLink,
      geo: poi.geo,
      styleTags: poi.styleTags,
      order: order++,
      note: "Stop on the way",
    });
  }

  for (const poi of destHighlights) {
    if (stops.some((stop) => stop.poiId === poi.id)) continue;
    stops.push({
      poiId: poi.id,
      name: poi.name,
      subtitle: poi.subtitle,
      cityLabel: poi.cityLabel,
      country: poi.country,
      imageUrl: poi.imageUrl,
      sourceLink: poi.sourceLink,
      geo: poi.geo,
      styleTags: poi.styleTags,
      order: order++,
      note: "At the destination",
    });
  }

  return stops;
}

async function findBudget(
  city: string,
  country: string | null,
  nights: number
): Promise<SuggestedBudget | null> {
  const rows = await db
    .select()
    .from(schema.cityPrices)
    .where(
      country
        ? and(
            sql`lower(${schema.cityPrices.city}) = lower(${city})`,
            sql`lower(${schema.cityPrices.country}) = lower(${country})`
          )
        : sql`lower(${schema.cityPrices.city}) = lower(${city})`
    )
    .limit(1);

  let row = rows[0];

  // Fallback: match by city name only across countries.
  if (!row) {
    const fallback = await db
      .select()
      .from(schema.cityPrices)
      .where(sql`lower(${schema.cityPrices.city}) = lower(${city})`)
      .limit(1);
    row = fallback[0];
  }

  // Last resort: country average (first row for that country).
  if (!row && country) {
    const byCountry = await db
      .select()
      .from(schema.cityPrices)
      .where(sql`lower(${schema.cityPrices.country}) = lower(${country})`)
      .limit(1);
    row = byCountry[0];
  }

  if (!row) return null;

  const hostel = parseMoney(row.hostel);
  const hotel = parseMoney(row.hotel);
  const backpacker = parseMoney(row.backpacker);
  const priceIndex = parseMoney(row.priceIndex);
  const nightly = backpacker ?? hostel ?? hotel;
  const estimateTotal =
    nightly != null ? Math.round(nightly * nights * 100) / 100 : null;

  return {
    city: row.city,
    country: row.country,
    hostel,
    hotel,
    backpacker,
    priceIndex,
    estimateTotal,
    nights,
  };
}

/**
 * Core suggestion engine:
 * 1. POIs within maxDistanceKm of homeBase matching styleTags
 * 2. Cluster by destination city
 * 3. Pick stops along homeBase → destination
 * 4. Attach rough budget from city_prices
 * 5. Generate suggested dates from cadence
 */
export async function generateSuggestions(
  prefs: Preference
): Promise<SuggestedTrip[]> {
  if (!isCompletePreference(prefs)) {
    return [];
  }

  if (!isDatabaseConfigured()) {
    return [];
  }

  const homeBase = prefs.homeBase;
  const meters = prefs.maxDistanceKm * 1000;
  const tags = prefs.styleTags;

  const rows = await db
    .select()
    .from(schema.pois)
    .where(
      and(
        withinMeters(schema.pois.geo, homeBase, meters),
        arrayOverlaps(schema.pois.styleTags, tags),
        sql`${schema.pois.geo} is not null`,
        sql`${schema.pois.cityLabel} is not null`
      )
    )
    .limit(500);

  const withGeo = rows.filter(
    (poi): poi is Poi & { geo: LngLat } => poi.geo != null
  );

  if (withGeo.length === 0) {
    return [];
  }

  const clusters = clusterByCity(withGeo).slice(0, MAX_DESTINATIONS);
  const { startDate, endDate } = suggestTripDates(prefs.cadence);
  const nights = nightsBetween(startDate, endDate);
  const originLabel = prefs.homeBaseLabel;

  const suggestions: SuggestedTrip[] = [];

  for (const cluster of clusters) {
    const destinationGeo = centroid(cluster.pois.map((poi) => poi.geo));
    if (!destinationGeo) continue;

    // Skip destinations that are basically "home".
    if (haversineMeters(homeBase, destinationGeo) < 40_000) continue;

    const destinationLabel = cluster.country
      ? `${cluster.cityLabel}, ${cluster.country}`
      : cluster.cityLabel;

    const stops = pickAlongRouteStops({
      homeBase,
      destination: destinationGeo,
      destinationPois: cluster.pois,
      corridorCandidates: withGeo.filter(
        (poi) =>
          cityKey(poi.cityLabel ?? "", poi.country) !==
          cityKey(cluster.cityLabel, cluster.country)
      ),
    });

    if (stops.length === 0) continue;

    const matchingTags = [
      ...new Set(
        cluster.pois.flatMap((poi) =>
          poi.styleTags.filter((tag) => tags.includes(tag))
        )
      ),
    ];

    const budget = await findBudget(
      cluster.cityLabel,
      cluster.country,
      nights
    );

    suggestions.push({
      suggestionKey: cityKey(cluster.cityLabel, cluster.country),
      title: `Wander to ${cluster.cityLabel}`,
      originLabel,
      originGeo: homeBase,
      destinationLabel,
      destinationGeo,
      destinationCity: cluster.cityLabel,
      destinationCountry: cluster.country,
      startDate,
      endDate,
      stops,
      budget,
      matchingTags,
      poiCount: cluster.pois.length,
    });
  }

  return suggestions;
}

export type PersistSuggestionInput = {
  ownerId: User["id"];
  suggestion: SuggestedTrip;
};

/**
 * Persist a suggested trip + its stops. Idempotent-ish: if the user already
 * has a `suggested` trip to the same destination label, reuse it.
 */
export async function persistSuggestion(
  input: PersistSuggestionInput
): Promise<{ tripId: string }> {
  const { ownerId, suggestion } = input;

  if (!isDatabaseConfigured()) {
    throw new Error(
      "DATABASE_URL is not configured. Add your Neon connection string to persist trips."
    );
  }

  const existing = await db.query.trips.findFirst({
    where: and(
      eq(schema.trips.ownerId, ownerId),
      eq(schema.trips.destinationLabel, suggestion.destinationLabel),
      eq(schema.trips.status, "suggested")
    ),
  });

  if (existing) {
    return { tripId: existing.id };
  }

  const startDate = new Date(suggestion.startDate);
  const endDate = new Date(suggestion.endDate);

  const [trip] = await db
    .insert(schema.trips)
    .values({
      ownerId,
      title: suggestion.title,
      originLabel: suggestion.originLabel,
      originGeo: suggestion.originGeo,
      destinationLabel: suggestion.destinationLabel,
      destinationGeo: suggestion.destinationGeo,
      startDate,
      endDate,
      estBudget:
        suggestion.budget?.estimateTotal != null
          ? String(suggestion.budget.estimateTotal)
          : null,
      status: "suggested",
    })
    .returning();

  if (!trip) {
    throw new Error("Failed to create suggested trip.");
  }

  if (suggestion.stops.length > 0) {
    await db.insert(schema.tripStops).values(
      suggestion.stops.map((stop) => ({
        tripId: trip.id,
        poiId: stop.poiId,
        order: stop.order,
        note: stop.note,
      }))
    );
  }

  await db.insert(schema.collaborators).values({
    tripId: trip.id,
    userId: ownerId,
    role: "owner",
  });

  return { tripId: trip.id };
}
