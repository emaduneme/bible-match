export interface MatchPair {
  id: number;
  type: string;
  a: string;
  b: string;
  relationship: string;
  verse: string;
  note: string;
  book?: string;
}

// Load all pairs from JSON (single source of truth)
import RAW from "./matchPairs.json";
export const matchPairs: MatchPair[] = RAW as unknown as MatchPair[];
