/**
 * Player name management using localStorage
 */

const STORAGE_KEY = "bible-match:player:v1";

interface PlayerData {
  name: string | null;
  isGuest: boolean;
}

const getWindow = () => (typeof window === "undefined" ? undefined : window);

const defaultPlayer: PlayerData = {
  name: null,
  isGuest: false,
};

export const loadPlayer = (): PlayerData => {
  const win = getWindow();
  if (!win) return defaultPlayer;
  try {
    const raw = win.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPlayer;
    return JSON.parse(raw) as PlayerData;
  } catch {
    return defaultPlayer;
  }
};

export const savePlayer = (data: PlayerData): void => {
  const win = getWindow();
  if (!win) return;
  win.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const hasCompletedIntro = (): boolean => {
  const player = loadPlayer();
  return player.name !== null || player.isGuest;
};

export const getPlayerName = (): string | null => {
  return loadPlayer().name;
};

export const setPlayerName = (name: string): void => {
  savePlayer({ name: name.trim() || null, isGuest: false });
};

export const setGuestMode = (): void => {
  savePlayer({ name: null, isGuest: true });
};

export const clearPlayer = (): void => {
  const win = getWindow();
  if (!win) return;
  win.localStorage.removeItem(STORAGE_KEY);
};

