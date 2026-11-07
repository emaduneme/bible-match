import { describe, expect, it } from "vitest";
import { dailyPuzzles, PAIRS_PER_PUZZLE, LAUNCH_DATE } from "./dailyPuzzles";
import { matchPairs } from "./matchPairs";

// These rules protect players from broken or unfair puzzles.
// If one fails after you add puzzles, the message names the puzzle.
describe("daily puzzle list", () => {
  const ids = new Set(matchPairs.map((p) => p.id));
  const byId = new Map(matchPairs.map((p) => [p.id, p]));

  it("has a valid launch date", () => {
    expect(LAUNCH_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("has no duplicate pair IDs in matchPairs.json", () => {
    expect(ids.size).toBe(matchPairs.length);
  });

  dailyPuzzles.forEach((puzzle, i) => {
    const label = `#${i + 1} "${puzzle.theme}"`;

    it(`${label} has exactly ${PAIRS_PER_PUZZLE} pairs that exist`, () => {
      expect(puzzle.pairIds).toHaveLength(PAIRS_PER_PUZZLE);
      for (const id of puzzle.pairIds) expect(ids.has(id), `missing pair ${id}`).toBe(true);
    });

    it(`${label} has no repeated card names`, () => {
      const names = puzzle.pairIds.flatMap((id) => {
        const p = byId.get(id);
        return p ? [p.a, p.b] : [];
      });
      const normalized = names.map((n) => n.trim().toLowerCase().replace(/[’']/g, "'"));
      expect(new Set(normalized).size, names.join(", ")).toBe(normalized.length);
    });
  });

  it("never reuses a pair across puzzles", () => {
    const used = dailyPuzzles.flatMap((p) => p.pairIds);
    const dupes = used.filter((id, i) => used.indexOf(id) !== i);
    expect(dupes).toEqual([]);
  });
});
