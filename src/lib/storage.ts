// Lean localStorage utilities for streaks & stats

interface GameStats {
  streak: number;
  lastPlayed: string; // ISO date
  gamesPlayed: number;
  gamesWon: number;
}

const STATS_KEY = "bible-match-stats";

export function getStats(): GameStats {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (!stored) return { streak: 0, lastPlayed: "", gamesPlayed: 0, gamesWon: 0 };
    return JSON.parse(stored);
  } catch {
    return { streak: 0, lastPlayed: "", gamesPlayed: 0, gamesWon: 0 };
  }
}

export function saveGameResult(won: boolean) {
  const stats = getStats();
  const today = new Date().toISOString().split("T")[0];
  
  stats.gamesPlayed++;
  if (won) stats.gamesWon++;

  // Streak logic
  if (stats.lastPlayed) {
    const lastDate = new Date(stats.lastPlayed);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day, no change
    } else if (diffDays === 1 && won) {
      stats.streak++;
    } else {
      stats.streak = won ? 1 : 0;
    }
  } else {
    stats.streak = won ? 1 : 0;
  }

  stats.lastPlayed = today;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function getShareText(score: number, total: number, theme: string): string {
  const result = score === total ? "✓".repeat(total) : "✓".repeat(score) + "✗".repeat(total - score);
  const url = typeof window !== "undefined" ? window.location.origin : "https://example.com";
  return `Bible Match ${theme}\n${score}/${total}\n${result}\n\nPlay at: ${url}`;
}

