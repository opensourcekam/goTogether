import { NextResponse } from "next/server";

import {
  NOMINATIM_SEARCH_URL,
  NOMINATIM_USER_AGENT,
  mapNominatimResults,
  type NominatimResult,
} from "@/lib/geocoding";

export const runtime = "nodejs";

/**
 * Proxies Nominatim search so the browser never needs a paid key and we can
 * send a polite User-Agent (browsers overwrite fetch User-Agent).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const url = new URL(NOMINATIM_SEARCH_URL);
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "0");
  url.searchParams.set("limit", "5");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": NOMINATIM_USER_AGENT,
      },
      // Avoid Next caching geocode results across users/queries incorrectly.
      cache: "no-store",
    });

    if (response.status === 429) {
      return NextResponse.json(
        {
          results: [],
          error: "Place search is rate-limited. Wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          results: [],
          error: `Place search failed (${response.status}). Try again shortly.`,
        },
        { status: 502 }
      );
    }

    const data = (await response.json()) as NominatimResult[];
    return NextResponse.json({ results: mapNominatimResults(data) });
  } catch {
    return NextResponse.json(
      {
        results: [],
        error: "Place search is unavailable right now. Try again shortly.",
      },
      { status: 502 }
    );
  }
}
