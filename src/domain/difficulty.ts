import type { Scale } from "./quest.ts";
import type { StatDelta } from "./discipline.ts";

/** Player judgment of how demanding something feels — drives XP, scale, and rewards. */
export type Difficulty = "light" | "moderate" | "heavy" | "legendary";

export interface DifficultyMeta {
  key: Difficulty;
  label: string;
  hint: string;
}

export const DIFFICULTIES: DifficultyMeta[] = [
  { key: "light", label: "Light", hint: "Quick win — low friction" },
  { key: "moderate", label: "Moderate", hint: "Solid effort — meaningful" },
  { key: "heavy", label: "Heavy", hint: "Heavy lift — costs you" },
  { key: "legendary", label: "Legendary", hint: "Defining — months of work" },
];

export const DIFFICULTY_BY_KEY: Record<Difficulty, DifficultyMeta> = Object.fromEntries(
  DIFFICULTIES.map((d) => [d.key, d]),
) as Record<Difficulty, DifficultyMeta>;

export interface QuestDifficultyProfile {
  scale: Scale;
  xp: number;
  unlockLevel: number;
}

const QUEST_BY_DIFFICULTY: Record<Difficulty, QuestDifficultyProfile> = {
  light: { scale: "minor", xp: 10, unlockLevel: 1 },
  moderate: { scale: "minor", xp: 25, unlockLevel: 2 },
  heavy: { scale: "major", xp: 50, unlockLevel: 5 },
  legendary: { scale: "boss", xp: 100, unlockLevel: 10 },
};

export function questProfileForDifficulty(difficulty: Difficulty): QuestDifficultyProfile {
  return QUEST_BY_DIFFICULTY[difficulty];
}

const DISCIPLINE_BY_DIFFICULTY: Record<Difficulty, StatDelta[]> = {
  light: [{ stat: "mana", amount: 5 }],
  moderate: [{ stat: "mana", amount: 10 }],
  heavy: [
    { stat: "hp", amount: 8 },
    { stat: "mana", amount: 8 },
  ],
  legendary: [
    { stat: "hp", amount: 12 },
    { stat: "mana", amount: 12 },
  ],
};

export function disciplineRewardsForDifficulty(difficulty: Difficulty): StatDelta[] {
  return DISCIPLINE_BY_DIFFICULTY[difficulty];
}

/** Encoded in epic flavour text until epics carry explicit intensity metadata. */
export function epicIntensityNote(difficulty: Difficulty): string {
  return `Intensity: ${DIFFICULTY_BY_KEY[difficulty].label}`;
}
