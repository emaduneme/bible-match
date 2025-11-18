import type { ThemeId, TierId, ThemeWithTiers } from "@/data/themesWithTiers";

const STORAGE_KEY = "bible-match:theme-progress:v1";

export type ThemeProgressMap = Record<ThemeId, TierId[]>;

const ensureDefaults = (progress: ThemeProgressMap, themes: ThemeWithTiers[]): ThemeProgressMap => {
  const next: ThemeProgressMap = { ...progress };
  themes.forEach((theme) => {
    const unlocked = new Set(progress[theme.id] ?? []);
    const firstTierId = theme.tiers[0]?.id;
    if (firstTierId && !unlocked.has(firstTierId)) {
      unlocked.add(firstTierId);
    }
    next[theme.id] = Array.from(unlocked);
  });
  return next;
};

const createDefaultProgress = (themes: ThemeWithTiers[]): ThemeProgressMap => {
  const defaults: ThemeProgressMap = {};
  themes.forEach((theme) => {
    const firstTier = theme.tiers[0]?.id;
    defaults[theme.id] = firstTier ? [firstTier] : [];
  });
  return defaults;
};

export const loadProgress = (themes: ThemeWithTiers[]): ThemeProgressMap => {
  if (typeof window === "undefined") {
    return createDefaultProgress(themes);
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaults = createDefaultProgress(themes);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw) as ThemeProgressMap;
    const normalized = ensureDefaults(parsed, themes);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    const fallback = createDefaultProgress(themes);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
};

export const saveProgress = (progress: ThemeProgressMap) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const unlockTierProgress = (
  progress: ThemeProgressMap,
  themeId: ThemeId,
  tierId?: TierId
): ThemeProgressMap => {
  if (!tierId) return progress;
  const current = new Set(progress[themeId] ?? []);
  if (current.has(tierId)) return progress;
  const updated: ThemeProgressMap = { ...progress, [themeId]: [...current, tierId] };
  return updated;
};

export const isTierUnlocked = (progress: ThemeProgressMap, themeId: ThemeId, tierId: TierId): boolean => {
  return (progress[themeId] ?? []).includes(tierId);
};

