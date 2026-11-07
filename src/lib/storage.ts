// Lean localStorage utilities for streaks, stats, and the share text.
import { daysBetween } from "./daily";

export interface GameStats {
  streak: number;
  maxStreak: number;
  lastPlayed: string; // local date key, "YYYY-MM-DD"
  gamesPlayed: number;
  perfectGames: number;
}

const STATS_KEY = "bible-match-stats";

const emptyStats = (): GameStats => ({
  streak: 0,
  maxStreak: 0,
  lastPlayed: "",
  gamesPlayed: 0,
  perfectGames: 0,
});

export function getStats(): GameStats {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (!stored) return emptyStats();
    return { ...emptyStats(), ...JSON.parse(stored) };
  } catch {
    return emptyStats();
  }
}

/**
 * Record that today's puzzle was finished. Safe to call more than once on
 * the same day: only the first call counts.
 */
export function recordCompletion(dateKey: string, mistakes: number): GameStats {
  const stats = getStats();
  if (stats.lastPlayed === dateKey) return stats;

  const gap = stats.lastPlayed ? daysBetween(stats.lastPlayed, dateKey) : Infinity;
  stats.streak = gap === 1 ? stats.streak + 1 : 1;
  stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
  stats.gamesPlayed++;
  if (mistakes === 0) stats.perfectGames++;
  stats.lastPlayed = dateKey;

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
  return stats;
}

// ========================================
// CONFIGURE YOUR SHARE LINK HERE
// ========================================
export const SHARE_LINK = "https://bible-match.vercel.app";
// ========================================

const SQUARES_PER_ROW = 8;

export function countMistakes(guesses: boolean[]): number {
  return guesses.filter((g) => !g).length;
}

export function getResultLine(mistakes: number): string {
  if (mistakes === 0) return "Clean! (0 misses)";
  return `${mistakes} ${mistakes === 1 ? "miss" : "misses"}`;
}

/** One square per guess, in order: 🟩 correct, 🟥 miss. */
export function getGuessSquares(guesses: boolean[]): string {
  const squares = guesses.map((g) => (g ? "🟩" : "🟥"));
  const rows: string[] = [];
  for (let i = 0; i < squares.length; i += SQUARES_PER_ROW) {
    rows.push(squares.slice(i, i + SQUARES_PER_ROW).join(""));
  }
  return rows.join("\n");
}

export function getShareText(puzzleNumber: number, guesses: boolean[]): string {
  return [
    `📖 Bible Match #${puzzleNumber}`,
    getGuessSquares(guesses),
    getResultLine(countMistakes(guesses)),
    ``,
    SHARE_LINK,
  ].join("\n");
}
