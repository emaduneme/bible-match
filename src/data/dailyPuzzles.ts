import { matchPairs, MatchPair } from "./matchPairs";

/**
 * The daily puzzle list.
 *
 * - Puzzle #1 plays on LAUNCH_DATE, #2 the day after, and so on.
 * - Each puzzle is exactly 4 pair IDs from matchPairs.json.
 * - Rules (checked by src/data/dailyPuzzles.test.ts):
 *   1. Every ID must exist in matchPairs.json.
 *   2. No card name may appear twice in one puzzle.
 *   3. A pair is used in only one puzzle (no repeats).
 * - Also check by hand: no card should have a second partner on the
 *   same board that is ALSO a true biblical link (e.g. "Joseph" and
 *   "Mary" together). Players would be marked wrong for a fair answer.
 *
 * To add puzzles: write new pairs in matchPairs.json, then append here.
 * Never reorder or remove past entries; that changes old puzzle numbers.
 */

export const LAUNCH_DATE = "2026-11-09";
export const PAIRS_PER_PUZZLE = 4;

export interface DailyPuzzleEntry {
  theme: string;
  pairIds: number[];
}

export const dailyPuzzles: DailyPuzzleEntry[] = [
  // Week 1: familiar ground
  { theme: "Brothers & Sisters", pairIds: [301, 359, 360, 325] },
  { theme: "Faithful Friends", pairIds: [310, 307, 304, 357] },
  { theme: "Battles & Victories", pairIds: [348, 349, 367, 374] },
  { theme: "Rescued", pairIds: [318, 6211, 6213, 5107] },
  { theme: "Miracles of Water", pairIds: [6201, 305, 323, 324] },
  { theme: "Known for a Virtue", pairIds: [313, 314, 340, 338] },
  { theme: "Mentors", pairIds: [352, 309, 333, 5307] },

  // Week 2
  { theme: "Family Ties", pairIds: [303, 354, 308, 358] },
  { theme: "Called by God", pairIds: [322, 363, 370, 344] },
  { theme: "Miracles", pairIds: [312, 6204, 6206, 6202] },
  { theme: "Women of Faith", pairIds: [331, 5305, 5308, 328] },
  { theme: "Signs from God", pairIds: [306, 5304, 311, 342] },
  { theme: "Side by Side", pairIds: [334, 317, 6009, 353] },
  { theme: "Apostles in Action", pairIds: [329, 371, 6102, 339] },

  // Week 3
  { theme: "How Their Stories Ended", pairIds: [347, 365, 369, 368] },
  { theme: "On the Map", pairIds: [362, 343, 336, 335] },
  { theme: "Life-Changing Encounters", pairIds: [326, 372, 327, 355] },
  { theme: "Under Pressure", pairIds: [332, 6106, 375, 337] },
  { theme: "Places That Mattered", pairIds: [364, 366, 6104, 341] },
  { theme: "Teachers & Learners", pairIds: [6005, 6004, 373, 316] },
  { theme: "Provision & Praise", pairIds: [315, 350, 361, 6203] },

  // Week 4: harder
  { theme: "Prophets & Places", pairIds: [319, 6107, 6105, 5301] },
  { theme: "Roots & Callings", pairIds: [356, 345, 6101, 351] },
  { theme: "Turning Points", pairIds: [330, 302, 346, 6210] },
  { theme: "Minor Prophets", pairIds: [321, 5303, 5302, 320] },
];

export interface ResolvedPuzzle {
  /** 1-based puzzle number shown to players (#1 = launch day). */
  number: number;
  theme: string;
  pairs: MatchPair[];
}

const pairsById = new Map(matchPairs.map((p) => [p.id, p]));

/** Returns puzzle #n (1-based), or null if it does not exist. */
export function getPuzzleByNumber(n: number): ResolvedPuzzle | null {
  const entry = dailyPuzzles[n - 1];
  if (!Number.isInteger(n) || !entry) return null;
  const pairs = entry.pairIds
    .map((id) => pairsById.get(id))
    .filter((p): p is MatchPair => !!p);
  return { number: n, theme: entry.theme, pairs };
}
