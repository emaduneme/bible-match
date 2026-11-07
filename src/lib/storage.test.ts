import { beforeEach, describe, expect, it } from "vitest";
import { getShareText, getStats, recordCompletion } from "./storage";

beforeEach(() => localStorage.clear());

describe("recordCompletion", () => {
  it("builds a streak on consecutive days and resets after a gap", () => {
    recordCompletion("2026-11-09", 0);
    recordCompletion("2026-11-10", 2);
    expect(getStats()).toMatchObject({ streak: 2, gamesPlayed: 2, perfectGames: 1 });
    recordCompletion("2026-11-12", 0);
    expect(getStats()).toMatchObject({ streak: 1, maxStreak: 2, gamesPlayed: 3 });
  });

  it("counts a day only once, even if called again", () => {
    recordCompletion("2026-11-09", 0);
    recordCompletion("2026-11-09", 0);
    expect(getStats().gamesPlayed).toBe(1);
  });
});

describe("getShareText", () => {
  it("shows a clean result", () => {
    expect(getShareText(1, [true, true, true, true])).toBe(
      "📖 Bible Match #1\n🟩🟩🟩🟩\nClean! (0 misses)\n\nhttps://bible-match.vercel.app"
    );
  });

  it("shows one square per guess, in order", () => {
    const text = getShareText(14, [true, false, true, true, true]);
    expect(text).toContain("🟩🟥🟩🟩🟩");
    expect(text).toContain("1 miss");
  });

  it("wraps long results onto more lines", () => {
    const guesses = [...Array(9).fill(false), true, true, true, true];
    expect(getShareText(2, guesses).split("\n")[1]).toHaveLength(8 * 2); // 8 emoji squares
  });
});
