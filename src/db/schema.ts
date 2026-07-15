import {
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { geoPoint } from "./geometry";

/**
 * Central Drizzle schema for goTogether.
 *
 * Geospatial columns use the `geoPoint` custom type (`geometry(Point,4326)`).
 * GiST indexes on those columns power `ST_DWithin` distance-ring queries in the
 * suggestion engine. PostGIS itself is enabled by the first SQL migration.
 *
 * Conventions:
 *  - UUID primary keys (`defaultRandom`) everywhere.
 *  - `timestamptz` created/updated columns.
 *  - Explicit base `Select`/`Insert` types are exported per table so later
 *    phases import a single source of truth (see `Entity['id']` usage in the
 *    query helpers rather than bare `string`).
 */

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const cadenceEnum = pgEnum("cadence", [
  "weekly",
  "biweekly",
  "monthly",
  "quarterly",
]);

export const tripStatusEnum = pgEnum("trip_status", [
  "draft",
  "suggested",
  "planned",
  "active",
  "completed",
  "archived",
]);

export const collaboratorRoleEnum = pgEnum("collaborator_role", [
  "owner",
  "editor",
  "viewer",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    // External identity from Neon Auth (Managed Better Auth).
    authUserId: text("auth_user_id"),
    email: text("email").notNull(),
    name: text("name"),
    image: text("image"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    uniqueIndex("users_auth_user_id_idx").on(table.authUserId),
  ]
);

export const preferences = pgTable(
  "preferences",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    homeBase: geoPoint("home_base"),
    homeBaseLabel: text("home_base_label"),
    styleTags: text("style_tags").array().notNull().default([]),
    maxDistanceKm: integer("max_distance_km"),
    cadence: cadenceEnum("cadence"),
    ...timestamps,
  },
  (table) => [uniqueIndex("preferences_user_id_idx").on(table.userId)]
);

export const pois = pgTable(
  "pois",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    cityLabel: text("city_label"),
    country: text("country"),
    subtitle: text("subtitle"),
    imageUrl: text("image_url"),
    sourceLink: text("source_link"),
    geo: geoPoint("geo"),
    styleTags: text("style_tags").array().notNull().default([]),
    ...timestamps,
  },
  (table) => [
    index("pois_geo_idx").using("gist", table.geo),
    index("pois_style_tags_idx").using("gin", table.styleTags),
    index("pois_city_idx").on(table.cityLabel, table.country),
  ]
);

export const cityPrices = pgTable(
  "city_prices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    city: text("city").notNull(),
    country: text("country").notNull(),
    hostel: numeric("hostel", { precision: 10, scale: 2 }),
    hotel: numeric("hotel", { precision: 10, scale: 2 }),
    backpacker: numeric("backpacker", { precision: 10, scale: 2 }),
    priceIndex: numeric("price_index", { precision: 10, scale: 4 }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("city_prices_city_country_idx").on(table.city, table.country),
  ]
);

export const trips = pgTable(
  "trips",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    originLabel: text("origin_label"),
    originGeo: geoPoint("origin_geo"),
    destinationLabel: text("destination_label"),
    destinationGeo: geoPoint("destination_geo"),
    startDate: timestamp("start_date", { withTimezone: true }),
    endDate: timestamp("end_date", { withTimezone: true }),
    estBudget: numeric("est_budget", { precision: 12, scale: 2 }),
    status: tripStatusEnum("status").notNull().default("draft"),
    ...timestamps,
  },
  (table) => [
    index("trips_owner_id_idx").on(table.ownerId),
    index("trips_origin_geo_idx").using("gist", table.originGeo),
    index("trips_destination_geo_idx").using("gist", table.destinationGeo),
  ]
);

export const tripStops = pgTable(
  "trip_stops",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    poiId: uuid("poi_id").references(() => pois.id, { onDelete: "set null" }),
    order: integer("order").notNull().default(0),
    note: text("note"),
    ...timestamps,
  },
  (table) => [
    index("trip_stops_trip_id_idx").on(table.tripId),
    index("trip_stops_poi_id_idx").on(table.poiId),
  ]
);

export const collaborators = pgTable(
  "collaborators",
  {
    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: collaboratorRoleEnum("role").notNull().default("viewer"),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.tripId, table.userId] }),
    index("collaborators_user_id_idx").on(table.userId),
  ]
);

// --- Phase 2 scaffolding (defined, unused this iteration) ---

export const checkins = pgTable(
  "checkins",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    poiId: uuid("poi_id").references(() => pois.id, { onDelete: "set null" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    geo: geoPoint("geo"),
    note: text("note"),
    ...timestamps,
  },
  (table) => [
    index("checkins_trip_id_idx").on(table.tripId),
    index("checkins_geo_idx").using("gist", table.geo),
  ]
);

export const journalEntries = pgTable(
  "journal_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title"),
    body: text("body"),
    ...timestamps,
  },
  (table) => [index("journal_entries_trip_id_idx").on(table.tripId)]
);

export const photos = pgTable(
  "photos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tripId: uuid("trip_id").references(() => trips.id, { onDelete: "cascade" }),
    journalEntryId: uuid("journal_entry_id").references(
      () => journalEntries.id,
      { onDelete: "set null" }
    ),
    poiId: uuid("poi_id").references(() => pois.id, { onDelete: "set null" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    caption: text("caption"),
    takenAt: timestamp("taken_at", { withTimezone: true }),
    geo: geoPoint("geo"),
    ...timestamps,
  },
  (table) => [
    index("photos_trip_id_idx").on(table.tripId),
    index("photos_journal_entry_id_idx").on(table.journalEntryId),
  ]
);

// --- Explicit base types (single source of truth for later phases) ---

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Preference = typeof preferences.$inferSelect;
export type NewPreference = typeof preferences.$inferInsert;

export type Poi = typeof pois.$inferSelect;
export type NewPoi = typeof pois.$inferInsert;

export type CityPrice = typeof cityPrices.$inferSelect;
export type NewCityPrice = typeof cityPrices.$inferInsert;

export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;

export type TripStop = typeof tripStops.$inferSelect;
export type NewTripStop = typeof tripStops.$inferInsert;

export type Collaborator = typeof collaborators.$inferSelect;
export type NewCollaborator = typeof collaborators.$inferInsert;

export type Checkin = typeof checkins.$inferSelect;
export type NewCheckin = typeof checkins.$inferInsert;

export type JournalEntry = typeof journalEntries.$inferSelect;
export type NewJournalEntry = typeof journalEntries.$inferInsert;

export type Photo = typeof photos.$inferSelect;
export type NewPhoto = typeof photos.$inferInsert;
