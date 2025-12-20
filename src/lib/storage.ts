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

// ========================================
// CONFIGURE YOUR SHARE LINK HERE
// ========================================
const SHARE_LINK = "https://bible-match.vercel.app";
// ========================================

export function getShareText(score: number, total: number, theme: string): string {
  const perfect = score === total;
  
  // Visual score grid (like Wordle)
  const boxes = perfect
    ? "🟨".repeat(total)
    : "🟨".repeat(score) + "⬜".repeat(total - score);

  // Dynamic headline based on performance
  let headline: string;
  if (perfect) {
    headline = "I mastered today's Bible Match!";
  } else if (score >= total * 0.75) {
    headline = "I'm getting closer to mastering Bible Match!";
  } else {
    headline = "I'm learning new biblical connections!";
  }

  // Build the share message
  return [
    `📖 ${headline}`,
    ``,
    `${theme}`,
    `${boxes} ${score}/${total}`,
    ``,
    `Think you know your Bible? Test your knowledge:`,
    SHARE_LINK,
  ].join("\n");
}

