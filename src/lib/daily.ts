import {
  LAUNCH_DATE,
  dailyPuzzles,
  getPuzzleByNumber,
  ResolvedPuzzle,
} from "@/data/dailyPuzzles";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** The player's LOCAL calendar date as "YYYY-MM-DD" (not UTC). */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Whole days since 1970-01-01 for a "YYYY-MM-DD" key. Immune to DST. */
export function dayNumber(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / MS_PER_DAY);
}

/** Days between two date keys (b - a). */
export function daysBetween(a: string, b: string): number {
  return dayNumber(b) - dayNumber(a);
}

/** 0 on launch day, 1 the day after, negative before launch. */
export function getTodayIndex(date: Date = new Date(), launchDate = LAUNCH_DATE): number {
  return daysBetween(launchDate, toDateKey(date));
}

export type DailyStatus =
  | { kind: "prelaunch"; launchDate: string }
  | { kind: "caught-up"; lastNumber: number }
  | { kind: "puzzle"; dateKey: string; puzzle: ResolvedPuzzle };

/** What the player should see today. Stops (does not wrap) past the end of the list. */
export function getDailyStatus(date: Date = new Date()): DailyStatus {
  const index = getTodayIndex(date);
  if (index < 0) return { kind: "prelaunch", launchDate: LAUNCH_DATE };
  const puzzle = getPuzzleByNumber(index + 1);
  if (!puzzle) return { kind: "caught-up", lastNumber: dailyPuzzles.length };
  return { kind: "puzzle", dateKey: toDateKey(date), puzzle };
}

// ---------- Per-day record (progress + result) ----------

export interface DailyRecord {
  puzzleNumber: number;
  /** One entry per guess, in order: true = correct, false = miss. */
  guesses: boolean[];
  matchedPairIds: number[];
  completed: boolean;
}

const recordKey = (dateKey: string) => `bible-match:daily:v1:${dateKey}`;

export function loadDailyRecord(dateKey: string, puzzleNumber: number): DailyRecord | null {
  try {
    const raw = localStorage.getItem(recordKey(dateKey));
    if (!raw) return null;
    const rec = JSON.parse(raw) as DailyRecord;
    // Ignore a record for a different puzzle (e.g. the list was edited).
    if (rec.puzzleNumber !== puzzleNumber || !Array.isArray(rec.guesses)) return null;
    return rec;
  } catch {
    return null;
  }
}

export function saveDailyRecord(dateKey: string, record: DailyRecord): void {
  try {
    localStorage.setItem(recordKey(dateKey), JSON.stringify(record));
  } catch {
    // Storage full or blocked: the game still works, it just won't resume.
  }
}

// ---------- Same card layout for everyone ----------

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic shuffle: every player sees puzzle #n in the same order. */
export function seededShuffle<T>(items: T[], seed: number): T[] {
  const rand = mulberry32(seed * 2654435761);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
