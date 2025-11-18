import type { ThemeId, TierId } from "@/data/themesWithTiers";

export type TierHistoryMap = Record<string, number[]>;

const STORAGE_KEY = "bible-match:tier-history:v1";

const makeKey = (themeId: ThemeId, tierId: TierId) => `${themeId}:${tierId}`;

const getWindow = () => (typeof window === "undefined" ? undefined : window);

export const loadTierHistory = (): TierHistoryMap => {
  const win = getWindow();
  if (!win) return {};
  try {
    const raw = win.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      win.localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
      return {};
    }
    const parsed = JSON.parse(raw) as TierHistoryMap;
    return parsed;
  } catch {
    return {};
  }
};

export const saveTierHistory = (history: TierHistoryMap) => {
  const win = getWindow();
  if (!win) return;
  win.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getRecentTierIds = (
  history: TierHistoryMap,
  themeId: ThemeId,
  tierId: TierId
): number[] => {
  if (!themeId || !tierId) return [];
  return history[makeKey(themeId, tierId)] ?? [];
};

export const recordTierHistory = (
  history: TierHistoryMap,
  themeId: ThemeId,
  tierId: TierId,
  selectedIds: number[],
  poolSize: number
): TierHistoryMap => {
  if (!themeId || !tierId || selectedIds.length === 0) {
    return history;
  }
  const key = makeKey(themeId, tierId);
  const existing = history[key] ?? [];
  const filteredExisting = existing.filter((id) => selectedIds.indexOf(id) === -1);
  const merged = [...selectedIds, ...filteredExisting];
  const limited = merged.slice(0, Math.max(poolSize, merged.length));
  return {
    ...history,
    [key]: limited,
  };
};

