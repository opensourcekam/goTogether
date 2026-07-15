# goTogether

> Get lost on purpose. Set your home base, travel style, and range — then get
> suggested trips with prefilled "stops on the way." Solo at its core, built for
> "you and me" / group energy from day one.

This is a ground-up rebuild of the original 2016/2017 goTogether. The old
Express/Jade/Webpack app now lives in [`legacy/`](./legacy) — it's kept as a
reference and as the source of two seed datasets (see below), not deleted.

## Stack

- **Next.js (App Router) + TypeScript** — installable **PWA** (web manifest +
  hand-rolled service worker for an offline app shell).
- **Neon Postgres + PostGIS** via **Drizzle ORM** (Neon serverless driver).
  PostGIS powers distance-ring (`ST_DWithin`) and along-the-route queries.
- **Tailwind CSS v4 + shadcn/ui** for the UI.
- **MapLibre GL JS** + **OpenFreeMap** tiles for maps (no API key).
  Geocoding via **Nominatim** (OpenStreetMap) for onboarding + `pnpm db:seed`.
- **Auth**: Neon Auth (Managed Better Auth) — email OTP + social (Google /
  Facebook) via `@neondatabase/auth` / `@neondatabase/auth-ui`.

## Requirements

- Node.js 20+ (developed on 22)
- [pnpm](https://pnpm.io) 10+ (the pinned package manager)

## Getting started

```bash
pnpm install
cp .env.example .env   # then fill in the values
pnpm dev               # http://localhost:3000
```

### Environment variables

See [`.env.example`](./.env.example) for the full list. What each phase needs:

| Variable                   | Used by                              |
| -------------------------- | ------------------------------------ |
| `DATABASE_URL`             | Drizzle runtime + migrations (Neon)  |
| `NEON_AUTH_BASE_URL`       | Neon Auth server URL (from Console)  |
| `NEON_AUTH_COOKIE_SECRET`  | Signs session cookies (32+ chars)    |

Maps and geocoding need no env vars: MapLibre + OpenFreeMap tiles render
without a key; Nominatim is called from `/api/geocode` and the seed script.

## Database (Neon + PostGIS + Drizzle)

Schema lives in [`src/db/schema.ts`](./src/db/schema.ts); the Drizzle client and
all types are exported from [`src/db/index.ts`](./src/db/index.ts):

```ts
import { db, schema } from "@/db";
import type { Poi, Preference } from "@/db";
```

### Geospatial columns

Drizzle doesn't emit an SRID with its built-in `geometry` type, so we use a
custom type in [`src/db/geometry.ts`](./src/db/geometry.ts) that:

- emits the exact DDL `geometry(Point,4326)`,
- serialises `{ lng, lat }` → EWKT (`SRID=4326;POINT(lng lat)`) on write,
- parses PostGIS's HEXEWKB output back to `{ lng, lat }` on read.

It also exports `makePoint()` and `withinMeters()` SQL helpers for the
suggestion engine's `ST_DWithin` queries. Geo columns have **GiST** indexes;
`pois.style_tags` has a **GIN** index for tag matching.

PostGIS is enabled by the first migration
(`CREATE EXTENSION IF NOT EXISTS postgis;`), which runs before any geometry
columns/indexes are created.

### Scripts

```bash
pnpm db:generate   # generate SQL migrations from the Drizzle schema
pnpm db:migrate    # apply migrations to DATABASE_URL
pnpm db:push       # push schema directly (dev/prototyping)
pnpm db:studio     # open Drizzle Studio
pnpm db:seed       # enrich Atlas Obscura + seed pois / city_prices
```

> You need a live Neon database (with `DATABASE_URL` set) to run
> `db:migrate` / `db:push` / `db:studio` / a real `db:seed`. `db:generate`
> works offline — the initial migration is already committed in
> [`drizzle/`](./drizzle).

## PWA

- [`public/manifest.webmanifest`](./public/manifest.webmanifest) + icons in
  `public/icons/`.
- Metadata/manifest/theme-color wired in
  [`src/app/layout.tsx`](./src/app/layout.tsx).
- A hand-rolled service worker ([`public/sw.js`](./public/sw.js)) provides an
  offline app shell (`/offline`), registered client-side (production only) by
  [`src/components/service-worker-register.tsx`](./src/components/service-worker-register.tsx).
  Hand-rolled was chosen over `next-pwa` to avoid Next 16 / Turbopack plugin
  compatibility risk; runtime caching rules can be extended in `sw.js`.

## Enrichment + seed (`pnpm db:seed`)

One-time pipeline in [`scripts/seed/`](./scripts/seed): geocode Atlas Obscura
place names via Nominatim (disk-cached, rate-limited ~1 req/s, resumable), infer
`styleTags`, then seed `pois` + `city_prices`.

```bash
# Safe local demo — no network geocoding / DB required
pnpm db:seed -- --fixture --dry-run

# Live geocode into the cache (Nominatim, free; no API key); no DB writes
pnpm db:seed -- --dry-run

# Resume / use cache only, then write to Neon (needs DATABASE_URL)
pnpm db:seed -- --cache-only

# Full run
pnpm db:seed
```

| Detail | Location / value |
| ------ | ---------------- |
| Script | `scripts/seed/index.ts` |
| Geocode cache | `scripts/seed/.cache/geocode-cache.json` (gitignored) |
| Sample fixture | `scripts/seed/fixtures/geocode-sample.json` |
| Style tags | `quirky`, `hidden`, `nature`, `history`, `art`, `food`, `architecture`, `spiritual`, `adventure`, `science` ([`src/lib/travel-styles.ts`](./src/lib/travel-styles.ts)) |
| Atlas source | `legacy/placesData/atlasObscure/atlasObscurePlaces.json` |
| Prices source | `legacy/public/places/averageTravelPrices/*.json` |

`city_prices` rows are parsed from each `*_travel_prices.json` file: country
comes from the filename (`Spain_travel_prices.json` → `Spain`); each entry
under the `country` array supplies `city`, `hostels` → `hostel`, `hotels` →
`hotel`, `backpacker`, and `price_index` → `priceIndex`.

## Auth (Neon Auth)

Uses [`@neondatabase/auth`](https://neon.com/docs/auth/quick-start/nextjs-api-only)
(Managed Better Auth) with optional UI from `@neondatabase/auth-ui`.

### Enable in Neon Console

1. Open your project → **Branch** → **Auth** → **Configuration**.
2. Click **Enable Auth** if it is not already on.
3. Copy the **Auth URL** into `NEON_AUTH_BASE_URL`.
4. Generate `NEON_AUTH_COOKIE_SECRET` with `openssl rand -base64 32`.
5. Under Auth methods, enable **Google** / **Facebook** (and/or email OTP) as
   needed for your app.

| Path | Role |
| ---- | ---- |
| `/api/auth/*` | Neon Auth API proxy |
| `/auth/*` | Sign-in / sign-up / OTP / OAuth callback UI |
| `/account/*` | Account settings UI |
| `/onboarding`, `/discover`, `/trips/*` | Protected (`src/proxy.ts` + `requireAppUser`) |

On first authenticated request the Neon Auth user is upserted into Neon
`users` (`auth_user_id`, email, name, image). Without Auth env vars, protected
routes redirect to `/auth/sign-in`, which shows setup instructions.

## Suggestion engine + pages

- Engine: [`src/lib/suggestions.ts`](./src/lib/suggestions.ts) — distance ring
  (`ST_DWithin`) + style overlap → city clusters → along-route stops →
  `city_prices` budget → cadence dates.
- Invoked from [`/discover`](./src/app/discover/page.tsx). Cards stay ephemeral
  until **Save & open trip** persists `trips` (`suggested`) + `trip_stops`.
- Onboarding: [`/onboarding`](./src/app/onboarding/page.tsx) (Nominatim geosuggest).
- Trip detail: [`/trips/[id]`](./src/app/trips/[id]/page.tsx) — MapLibre route map,
  budget, Skyscanner deep links, phase-2 stubs.

### Verify

```bash
pnpm build          # should pass without live keys
pnpm db:migrate && pnpm db:seed
pnpm dev
```

1. `/onboarding` — home base (e.g. Madrid), styles, 300km, weekly → save.
2. `/discover` — suggestion cards with stops + budget.
3. Save & open → `/trips/[id]` map + booking links.
4. With Neon Auth env: `/auth/sign-in` → row in `users` (`auth_user_id`).

## Project layout

```
.
├── src/
│   ├── app/                 # onboarding, discover, trips, auth, account, offline
│   ├── components/          # ui + forms + trip map
│   ├── db/                  # Drizzle client + schema + geometry
│   ├── lib/                 # auth, suggestions, travel-styles, booking links
│   │   └── auth/            # Neon Auth client + server helpers
│   └── proxy.ts             # Protect /onboarding, /discover, /trips/*
├── scripts/seed/            # enrichment + db:seed pipeline
├── drizzle/                 # SQL migrations
├── public/                  # PWA manifest, icons, sw.js
└── legacy/                  # 2016 app + seed source data
```

## Roadmap

Phase 2B (auth, onboarding, suggestion engine, discover, trip detail) is in.
Phase 2 reflection loop (`checkins`, `journal_entries`, `photos`) remains stubbed.