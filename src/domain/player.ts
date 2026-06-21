/**
 * Player progression. XP is cumulative and never resets; HP and Mana are a
 * daily pool (reset to max each day, moved by disciplines through the day).
 *
 * Level curve: leaving level L costs `XP_STEP * L` XP, so each level is a little
 * harder than the last. Cumulative XP to reach level 20 ≈ 75 * (19·20/2) = 14,250
 * — roughly six months of daily disciplines plus quests.
 */

export const MAX_HP = 100;
export const MAX_MANA = 100;

const XP_STEP = 75;

/** XP required to advance from `level` to `level + 1`. */
export function xpForLevelUp(level: number): number {
  return XP_STEP * level;
}

export interface LevelInfo {
  level: number;
  /** XP accumulated within the current level. */
  xpIntoLevel: number;
  /** XP needed to reach the next level. */
  xpForNext: number;
  /** Progress through the current level, 0–1. */
  progress: number;
}

export function levelFromXp(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = Math.max(0, Math.floor(totalXp));

  while (remaining >= xpForLevelUp(level)) {
    remaining -= xpForLevelUp(level);
    level += 1;
  }

  const xpForNext = xpForLevelUp(level);
  return { level, xpIntoLevel: remaining, xpForNext, progress: remaining / xpForNext };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
