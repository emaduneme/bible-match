import type { MatchPair } from "./matchPairs";
import { findBookInfoFromReference } from "./books";

export type ThemeId =
  // Relationship-based themes
  | "people"
  | "people_places"
  | "people_events"
  // Canon/category-based themes
  | "ot"
  | "nt";

export interface Theme {
  id: ThemeId;
  title: string;
  description: string;
  // one of the following filter strategies
  relationships?: string[]; // filter by relationship field
  testament?: "OT" | "NT"; // filter by testament
  collections?: string[]; // filter by book collection(s)
}

export const THEMES: Theme[] = [
  {
    id: "people",
    title: "People & Relationships",
    description: "Mentors, siblings, companions and close ties.",
    relationships: [
      "mentor",
      "brothers",
      "friendship",
      "missionary_partners",
      "family_loyalty",
      "uncle_nephew",
      "companions",
      "sisters",
    ],
  },
  {
    id: "people_places",
    title: "People & Places",
    description: "Where they lived, traveled, or encountered God.",
    relationships: [
      "origin",
      "exile",
      "revelation",
      "hometown",
      "mission",
      "conversion",
      "kingship",
      "resting_place",
      "miracle",
    ],
  },
  {
    id: "people_events",
    title: "People & Events",
    description: "Battles, miracles, preachings and calls.",
    relationships: [
      "leader_of_event",
      "healing",
      "victory",
      "battle",
      "preaching",
      "miracle",
      "departure",
      "divine_call",
    ],
  },
  // Canon/category-based themes
  { id: "ot", title: "Old Testament", description: "Pairs from the Old Testament.", testament: "OT" },
  { id: "nt", title: "New Testament", description: "Pairs from the New Testament.", testament: "NT" },
];

export function getPairsForTheme(themeId: ThemeId, all: MatchPair[]): MatchPair[] {
  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme) return all;

  // Relationship-based filter
  if (theme.relationships && theme.relationships.length > 0) {
    return all.filter((p) => theme.relationships!.includes(p.relationship));
  }

  // Canon/category-based filter (by verse reference's book)
  return all.filter((p) => {
    const info = findBookInfoFromReference(p.verse);
    if (!info) return false;
    if (theme.testament && info.testament !== theme.testament) return false;
    if (theme.collections && theme.collections.length > 0 && !theme.collections.includes(info.collection)) {
      return false;
    }
    return true;
  });
}

export function getThemesWithPairs(all: MatchPair[]): Theme[] {
  return THEMES.filter((theme) => {
    const pairs = getPairsForTheme(theme.id, all);
    return pairs.length > 0;
  });
}


