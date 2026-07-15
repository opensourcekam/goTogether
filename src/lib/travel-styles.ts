/**
 * Travel style vocabulary shared by onboarding preferences, POI enrichment,
 * and the suggestion engine's style-match query.
 *
 * Keep this list stable — seed `pois.style_tags` and `preferences.style_tags`
 * both store these string values.
 */
export const STYLE_TAGS = [
  "quirky",
  "hidden",
  "nature",
  "history",
  "art",
  "food",
  "architecture",
  "spiritual",
  "adventure",
  "science",
] as const;

export type StyleTag = (typeof STYLE_TAGS)[number];

export const STYLE_TAG_SET: ReadonlySet<string> = new Set(STYLE_TAGS);

export const STYLE_TAG_LABELS: Record<StyleTag, string> = {
  quirky: "Quirky & odd",
  hidden: "Hidden gems",
  nature: "Nature",
  history: "History",
  art: "Art",
  food: "Food & drink",
  architecture: "Architecture",
  spiritual: "Spiritual",
  adventure: "Adventure",
  science: "Science",
};

export function isStyleTag(value: string): value is StyleTag {
  return STYLE_TAG_SET.has(value);
}
