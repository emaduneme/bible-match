import type { MatchPair } from "./matchPairs";

export type ThemeId =
  | "people"
  | "people_places"
  | "people_events"
  | "virtues"
  | "events_symbols";

export interface Theme {
  id: ThemeId;
  title: string;
  description: string;
  relationships: string[];
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
  {
    id: "virtues",
    title: "Virtues",
    description: "Characters associated with key virtues.",
    relationships: ["virtue"],
  },
  {
    id: "events_symbols",
    title: "Events, Symbols & Locations",
    description: "Events with places, signs and strategies.",
    relationships: ["location", "object", "symbol", "strategy"],
  },
];

export function getPairsForTheme(themeId: ThemeId, all: MatchPair[]): MatchPair[] {
  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme) return all;
  return all.filter((p) => theme.relationships.includes(p.relationship));
}


