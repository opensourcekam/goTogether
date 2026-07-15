import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { BookOpen, Camera, MapPin, Plane } from "lucide-react";

import { AppHeader } from "@/components/app-header";
import { TripExperience, type TripStopDetail } from "@/components/trip-experience";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db, schema, type LngLat } from "@/db";
import {
  buildSkyscannerFlightUrl,
  buildSkyscannerHotelsUrl,
} from "@/lib/booking-links";
import {
  isDatabaseConfigured,
  requireAppUser,
} from "@/lib/auth";

type TripDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: TripDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Trip ${id.slice(0, 8)}` };
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { id } = await params;
  const user = await requireAppUser();

  if (!isDatabaseConfigured()) {
    return (
      <div className="flex min-h-full flex-col">
        <AppHeader title="Trip" />
        <main className="mx-auto max-w-5xl flex-1 px-6 py-10">
          <p className="text-muted-foreground">
            Database not configured — trip details need Neon.
          </p>
        </main>
      </div>
    );
  }

  let trip:
    | {
        id: string;
        ownerId: string;
        title: string;
        originLabel: string | null;
        originGeo: LngLat | null;
        destinationLabel: string | null;
        destinationGeo: LngLat | null;
        startDate: Date | null;
        endDate: Date | null;
        estBudget: string | null;
        status: string;
      }
    | null = null;
  let loadError: string | null = null;

  try {
    trip = await db.query.trips.findFirst({
      where: eq(schema.trips.id, id),
    }) ?? null;
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Could not load this trip.";
  }

  if (loadError) {
    return (
      <div className="flex min-h-full flex-col">
        <AppHeader title="Trip" />
        <main className="mx-auto max-w-5xl flex-1 px-6 py-10">
          <p className="text-destructive" role="alert">
            {loadError}
          </p>
        </main>
      </div>
    );
  }

  if (!trip || trip.ownerId !== user.id) {
    notFound();
  }

  const stopRows = await db
    .select({
      id: schema.tripStops.id,
      order: schema.tripStops.order,
      note: schema.tripStops.note,
      poiId: schema.tripStops.poiId,
      name: schema.pois.name,
      subtitle: schema.pois.subtitle,
      cityLabel: schema.pois.cityLabel,
      country: schema.pois.country,
      imageUrl: schema.pois.imageUrl,
      sourceLink: schema.pois.sourceLink,
      geo: schema.pois.geo,
    })
    .from(schema.tripStops)
    .leftJoin(schema.pois, eq(schema.tripStops.poiId, schema.pois.id))
    .where(eq(schema.tripStops.tripId, trip.id))
    .orderBy(asc(schema.tripStops.order));

  const stopDetails: TripStopDetail[] = stopRows.map((row) => ({
    id: row.id,
    name: row.name ?? "",
    subtitle: row.subtitle,
    note: row.note,
    sourceLink: row.sourceLink,
    geo: row.geo,
  }));

  const flightUrl = buildSkyscannerFlightUrl({
    originLabel: trip.originLabel,
    destinationLabel: trip.destinationLabel,
    startDate: trip.startDate,
    endDate: trip.endDate,
  });
  const hotelsUrl = buildSkyscannerHotelsUrl(trip.destinationLabel);

  const budget = trip.estBudget != null ? Number.parseFloat(trip.estBudget) : null;

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader title={trip.title} />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm uppercase tracking-wide">
            {trip.status}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-balance">
            {trip.title}
          </h1>
          <p className="text-muted-foreground">
            {trip.originLabel} → {trip.destinationLabel}
            {trip.startDate && trip.endDate
              ? ` · ${trip.startDate.toLocaleDateString()} – ${trip.endDate.toLocaleDateString()}`
              : null}
          </p>
        </div>

        <TripExperience
          origin={trip.originGeo}
          destination={trip.destinationGeo}
          stops={stopDetails}
        />

        <section className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Rough budget</CardTitle>
              <CardDescription>
                From city price averages (hostel / backpacker nightly × nights).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-2xl font-semibold tabular-nums">
                {budget != null && Number.isFinite(budget)
                  ? new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(budget)
                  : "—"}
              </p>
              <p className="text-muted-foreground">
                Live flight/hotel quotes are out of scope for this iteration.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="size-5" aria-hidden />
                Book it
              </CardTitle>
              <CardDescription>
                Skyscanner deep links (affiliate-style; old API is retired).
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild>
                <a href={flightUrl} target="_blank" rel="noreferrer">
                  Search flights
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={hotelsUrl} target="_blank" rel="noreferrer">
                  Search hotels
                </a>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Phase-2 scaffolding */}
        <section className="grid gap-6 sm:grid-cols-2">
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="size-4" aria-hidden />
                On this trip
              </CardTitle>
              <CardDescription>
                TODO (phase 2): geolocation POI nudges + check-ins using the
                `checkins` table when you&apos;re near a stop.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Background location prompts and nearby Atlas Obscura alerts will
                live here.
              </p>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="size-4" aria-hidden />
                Journal & photo book
              </CardTitle>
              <CardDescription>
                TODO (phase 2): reflection loop via `journal_entries` +
                `photos` — auto-assemble a book after the trip.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
              <Camera className="size-4" aria-hidden />
              Camera capture and journal drafts are stubbed only.
            </CardContent>
          </Card>
        </section>

        <Button asChild variant="outline" className="w-fit">
          <Link href="/discover">Back to discover</Link>
        </Button>
      </main>
    </div>
  );
}
