import {
  STYLE_TAGS,
  type StyleTag,
} from "../../src/lib/travel-styles";

/**
 * Keyword → style tag rules for Atlas Obscura subtitle / name / place title.
 * Matching is case-insensitive substring search over the combined haystack.
 */
const RULES: ReadonlyArray<{ tag: StyleTag; keywords: readonly string[] }> = [
  {
    tag: "hidden",
    keywords: [
      "hidden",
      "secret",
      "obscure",
      "forgotten",
      "overlooked",
      "little-known",
      "seldom-visited",
      "off the beaten",
      "underground",
      "concealed",
      "lost",
      "abandoned",
    ],
  },
  {
    tag: "quirky",
    keywords: [
      "quirky",
      "weird",
      "bizarre",
      "odd",
      "strange",
      "eccentric",
      "unusual",
      "curious",
      "peculiar",
      "whimsical",
      "silly",
      "novelty",
      "kitsch",
      "unique",
      "narrowest",
      "smallest",
      "largest",
      "giant",
      "miniature",
    ],
  },
  {
    tag: "nature",
    keywords: [
      "nature",
      "forest",
      "cave",
      "canyon",
      "waterfall",
      "mountain",
      "island",
      "lake",
      "river",
      "beach",
      "park",
      "garden",
      "wildlife",
      "animal",
      "bird",
      "tree",
      "volcano",
      "glacier",
      "desert",
      "reef",
      "spring",
      "geyser",
      "natural",
      "wilderness",
      "botanical",
    ],
  },
  {
    tag: "history",
    keywords: [
      "history",
      "historic",
      "ancient",
      "ruin",
      "ruins",
      "medieval",
      "century",
      "war",
      "battle",
      "tomb",
      "grave",
      "cemetery",
      "monument",
      "castle",
      "fort",
      "empire",
      "king",
      "queen",
      "roman",
      "viking",
      "prehistoric",
      "archaeolog",
      "heritage",
      "memorial",
      "revolution",
    ],
  },
  {
    tag: "art",
    keywords: [
      "art",
      "artist",
      "gallery",
      "museum",
      "sculpture",
      "statue",
      "mural",
      "graffiti",
      "painting",
      "mosaic",
      "installation",
      "street art",
      "cinema",
      "theater",
      "theatre",
      "music",
      "film",
    ],
  },
  {
    tag: "food",
    keywords: [
      "food",
      "restaurant",
      "cafe",
      "café",
      "bakery",
      "market",
      "culinary",
      "kitchen",
      "brewery",
      "winery",
      "distillery",
      "chocolate",
      "cheese",
      "coffee",
      "tea",
      "banana",
      "fruit",
      "dining",
      "eatery",
    ],
  },
  {
    tag: "architecture",
    keywords: [
      "architecture",
      "architectural",
      "building",
      "cathedral",
      "church",
      "temple",
      "mosque",
      "synagogue",
      "palace",
      "tower",
      "bridge",
      "house",
      "mansion",
      "skyscraper",
      "dome",
      "gothic",
      "baroque",
      "brutalist",
      "villa",
      "lighthouse",
    ],
  },
  {
    tag: "spiritual",
    keywords: [
      "spiritual",
      "sacred",
      "holy",
      "pilgrimage",
      "shrine",
      "monastery",
      "convent",
      "buddhist",
      "hindu",
      "christian",
      "islamic",
      "jewish",
      "religious",
      "ritual",
      "blessing",
      "prayer",
      "faith",
    ],
  },
  {
    tag: "adventure",
    keywords: [
      "adventure",
      "climb",
      "hiking",
      "hike",
      "trek",
      "dive",
      "diving",
      "surf",
      "kayak",
      "raft",
      "explorer",
      "expedition",
      "thrill",
      "daredevil",
      "extreme",
      "zip",
      "swinging",
      "rope",
    ],
  },
  {
    tag: "science",
    keywords: [
      "science",
      "scientific",
      "math",
      "physics",
      "chemistry",
      "astronomy",
      "observatory",
      "laboratory",
      "lab",
      "inventor",
      "invention",
      "technology",
      "tech",
      "space",
      "planetarium",
      "fossil",
      "dinosaur",
      "geology",
      "medical",
      "anatomy",
    ],
  },
];

/** Atlas Obscura places are quirky by nature when nothing else matches. */
const DEFAULT_TAGS: readonly StyleTag[] = ["quirky"];

/**
 * Infer style tags from free-text fields on an Atlas Obscura place.
 * Returns a de-duplicated list in STYLE_TAGS order; never empty.
 */
export function inferStyleTags(parts: {
  name?: string | null;
  subName?: string | null;
  subTitle?: string | null;
}): StyleTag[] {
  const haystack = [parts.name, parts.subName, parts.subTitle]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const matched = new Set<StyleTag>();
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => haystack.includes(kw))) {
      matched.add(rule.tag);
    }
  }

  const ordered = STYLE_TAGS.filter((tag) => matched.has(tag));
  return ordered.length > 0 ? ordered : [...DEFAULT_TAGS];
}
