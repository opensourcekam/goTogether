/**
 * Skyscanner affiliate-style deep links.
 * The old Skyscanner Travel API is dead; we deep-link into their search UI.
 */

export type FlightDeepLinkInput = {
  originLabel?: string | null;
  destinationLabel?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
};

function formatSkyDate(date: Date): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
}

function slugCity(label: string): string {
  return label
    .split(",")[0]
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "anywhere";
}

export function buildSkyscannerFlightUrl(input: FlightDeepLinkInput): string {
  const origin = input.originLabel ? slugCity(input.originLabel) : "anywhere";
  const destination = input.destinationLabel
    ? slugCity(input.destinationLabel)
    : "anywhere";

  const params = new URLSearchParams({
    adult: "1",
    cabinclass: "economy",
    rtn: input.endDate ? "1" : "0",
    preferdirects: "false",
    outboundaltsenabled: "false",
    inboundaltsenabled: "false",
    ref: "gotogether",
  });

  if (input.startDate) {
    const outbound = formatSkyDate(input.startDate);
    if (input.endDate) {
      const inbound = formatSkyDate(input.endDate);
      return `https://www.skyscanner.com/transport/flights/${origin}/${destination}/${outbound}/${inbound}/?${params.toString()}`;
    }
    return `https://www.skyscanner.com/transport/flights/${origin}/${destination}/${outbound}/?${params.toString()}`;
  }

  return `https://www.skyscanner.com/transport/flights/${origin}/${destination}/?${params.toString()}`;
}

export function buildSkyscannerHotelsUrl(destinationLabel?: string | null): string {
  const city = destinationLabel ? slugCity(destinationLabel) : "";
  if (!city) {
    return "https://www.skyscanner.com/hotels?ref=gotogether";
  }
  return `https://www.skyscanner.com/hotels/${city}?ref=gotogether`;
}
