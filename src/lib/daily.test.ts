import { describe, expect, it } from "vitest";
import { dayNumber, getDailyStatus, getTodayIndex, seededShuffle, toDateKey } from "./daily";
import { dailyPuzzles } from "@/data/dailyPuzzles";

const local = (y: number, m: number, d: number, h = 12, min = 0) => new Date(y, m - 1, d, h, min);

describe("toDateKey", () => {
  it("uses the local date, not UTC", () => {
    // 9pm in Chicago is already the next day in UTC.
    const ninePm = local(2026, 11, 9, 21);
    expect(ninePm.toISOString().slice(0, 10)).toBe("2026-11-10"); // proves TZ is set
    expect(toDateKey(ninePm)).toBe("2026-11-09");
  });
});

describe("getTodayIndex", () => {
  it("is 0 on launch day, all day long", () => {
    expect(getTodayIndex(local(2026, 11, 9, 0, 0))).toBe(0);
    expect(getTodayIndex(local(2026, 11, 9, 23, 59))).toBe(0);
  });

  it("is negative before launch and counts up after", () => {
    expect(getTodayIndex(local(2026, 11, 8, 23, 59))).toBe(-1);
    expect(getTodayIndex(local(2026, 11, 10, 0, 1))).toBe(1);
    expect(getTodayIndex(local(2026, 12, 9))).toBe(30);
  });

  it("does not skip or repeat a day across daylight saving changes", () => {
    // US DST starts 2027-03-14.
    const before = getTodayIndex(local(2027, 3, 13));
    expect(getTodayIndex(local(2027, 3, 14))).toBe(before + 1);
    expect(getTodayIndex(local(2027, 3, 15))).toBe(before + 2);
    expect(dayNumber("2027-03-15") - dayNumber("2027-03-14")).toBe(1);
  });
});

describe("getDailyStatus", () => {
  it("shows the prelaunch screen before launch", () => {
    expect(getDailyStatus(local(2026, 11, 8)).kind).toBe("prelaunch");
  });

  it("serves puzzle #1 on launch day", () => {
    const s = getDailyStatus(local(2026, 11, 9));
    expect(s.kind === "puzzle" && s.puzzle.number).toBe(1);
  });

  it("stops (does not wrap) after the last puzzle", () => {
    const last = local(2026, 11, 9 + dailyPuzzles.length - 1);
    const s = getDailyStatus(last);
    expect(s.kind === "puzzle" && s.puzzle.number).toBe(dailyPuzzles.length);
    expect(getDailyStatus(local(2026, 11, 9 + dailyPuzzles.length)).kind).toBe("caught-up");
  });
});

describe("seededShuffle", () => {
  it("gives everyone the same order for the same puzzle", () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(seededShuffle(items, 5)).toEqual(seededShuffle(items, 5));
    expect(seededShuffle(items, 5)).not.toEqual(seededShuffle(items, 6));
    expect([...seededShuffle(items, 5)].sort()).toEqual(items);
  });
});
