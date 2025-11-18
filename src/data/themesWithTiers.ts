import type { MatchPair } from "./matchPairs";
import RAW from "./themesWithTiers.json";

export type ThemeTierDifficulty = "easy" | "medium" | "hard" | "expert";

export interface ThemeTier {
  id: string;
  label: string;
  difficulty: ThemeTierDifficulty;
  color: string;
  pairCount: number;
  maxLives: number;
  pairs: MatchPair[];
}

export interface ThemeWithTiers {
  id: string;
  title: string;
  description: string;
  icon?: string;
  tiers: ThemeTier[];
}

const normalizeTier = (tier: ThemeTier): ThemeTier => {
  const boundedPairCount = Math.min(tier.pairCount, tier.pairs.length);
  return {
    ...tier,
    pairCount: Math.max(1, boundedPairCount),
    maxLives: Math.max(1, tier.maxLives),
    pairs: tier.pairs,
  };
};

const THEMES: ThemeWithTiers[] = (RAW as ThemeWithTiers[]).map((theme) => ({
  ...theme,
  tiers: theme.tiers.map(normalizeTier),
}));

export type ThemeId = ThemeWithTiers["id"];
export type TierId = ThemeTier["id"];

export const getThemes = (): ThemeWithTiers[] => THEMES;

export const getThemeById = (themeId: ThemeId | undefined): ThemeWithTiers | undefined =>
  themeId ? THEMES.find((theme) => theme.id === themeId) : undefined;

export const getTier = (
  themeId: ThemeId | undefined,
  tierId: TierId | undefined
): { theme: ThemeWithTiers; tier: ThemeTier } | undefined => {
  if (!themeId || !tierId) return undefined;
  const theme = getThemeById(themeId);
  if (!theme) return undefined;
  const tier = theme.tiers.find((t) => t.id === tierId);
  if (!tier) return undefined;
  return { theme, tier };
};

export const getFirstTierId = (themeId: ThemeId | undefined): TierId | undefined => {
  const theme = getThemeById(themeId);
  return theme?.tiers[0]?.id;
};

export const getNextTier = (
  themeId: ThemeId | undefined,
  tierId: TierId | undefined
): ThemeTier | undefined => {
  if (!themeId || !tierId) return undefined;
  const theme = getThemeById(themeId);
  if (!theme) return undefined;
  const idx = theme.tiers.findIndex((tier) => tier.id === tierId);
  if (idx === -1) return undefined;
  return theme.tiers[idx + 1];
};

