import type { Preference } from "@/db/schema";

export type Cadence = NonNullable<Preference["cadence"]>;

export const CADENCE_OPTIONS: {
  value: Cadence;
  label: string;
  description: string;
  daysBetween: number;
  tripLengthDays: number;
}[] = [
  {
    value: "weekly",
    label: "Weekly",
    description: "A short escape every week",
    daysBetween: 7,
    tripLengthDays: 2,
  },
  {
    value: "biweekly",
    label: "Every 2 weeks",
    description: "A long weekend cadence",
    daysBetween: 14,
    tripLengthDays: 3,
  },
  {
    value: "monthly",
    label: "Monthly",
    description: "One trip a month",
    daysBetween: 30,
    tripLengthDays: 4,
  },
  {
    value: "quarterly",
    label: "Quarterly",
    description: "A deeper trip each season",
    daysBetween: 90,
    tripLengthDays: 7,
  },
];

export function getCadenceMeta(cadence: Cadence) {
  const meta = CADENCE_OPTIONS.find((option) => option.value === cadence);
  if (!meta) {
    throw new Error(`Unknown cadence: ${cadence}`);
  }
  return meta;
}

/**
 * Suggest the next trip window starting from the upcoming Friday (or today if
 * already Friday+), then extend by the cadence's typical trip length.
 */
export function suggestTripDates(
  cadence: Cadence,
  from: Date = new Date()
): { startDate: Date; endDate: Date } {
  const meta = getCadenceMeta(cadence);
  const start = new Date(from);
  start.setHours(12, 0, 0, 0);

  // Nudge toward the next Friday so suggestions feel like real getaways.
  const day = start.getDay(); // 0 Sun … 5 Fri
  const daysUntilFriday = (5 - day + 7) % 7;
  if (daysUntilFriday > 0) {
    start.setDate(start.getDate() + daysUntilFriday);
  }

  const end = new Date(start);
  end.setDate(end.getDate() + meta.tripLengthDays);

  return { startDate: start, endDate: end };
}
