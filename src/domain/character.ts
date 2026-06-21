import type { Discipline } from "./discipline.ts";
import type { Epic } from "./epic.ts";
import type { IntakeProfile } from "./intake.ts";
import { emptyIntake } from "./intake.ts";
import type { Quest } from "./quest.ts";
import {
  TUTORIAL_CHARACTER_CLASS,
  TUTORIAL_CHARACTER_ID,
  TUTORIAL_DISCIPLINES,
  TUTORIAL_DISPLAY_NAME,
  TUTORIAL_EPICS,
  TUTORIAL_NORTH_STAR,
  TUTORIAL_QUESTS,
  TUTORIAL_STARTER_HABIT_IDS,
  TUTORIAL_STARTER_VERSION,
} from "../data/tutorialCharacter.ts";

export const DEFAULT_CHARACTER_CLASS = "Bard / Artificer";

/** All persisted state for one player character. */
export interface Character {
  id: string;
  displayName: string;
  createdAt: string;
  characterClass: string;
  intake: IntakeProfile;
  customQuests: Quest[];
  customEpics: Epic[];
  customDisciplines: Discipline[];
  /** Discipline ids tracked as habits — shown when the list is collapsed. */
  habitDisciplineIds: string[];
  /** When the shared default board changes, bump to realign assigned quests + habits. */
  sharedCatalogVersion?: number;
  /** When false, only this character's custom quests/epics/disciplines are used. */
  usesSharedCatalog?: boolean;
  /** When the public demo template changes, bump to refresh the demo character. */
  tutorialStarterVersion?: number;
}

export interface CharacterRegistry {
  /** Null until the player completes Soren's intro (or legacy migration). */
  activeCharacterId: string | null;
  characters: Record<string, Character>;
}

export function characterIdFromName(name: string, existing: Record<string, Character>): string {
  const base =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "character";

  if (!existing[base]) return base;

  let suffix = 2;
  let id = `${base}-${suffix}`;
  while (existing[id]) {
    suffix += 1;
    id = `${base}-${suffix}`;
  }
  return id;
}

export function createTutorialCharacter(): Character {
  return {
    id: TUTORIAL_CHARACTER_ID,
    displayName: TUTORIAL_DISPLAY_NAME,
    createdAt: new Date(1).toISOString(),
    characterClass: TUTORIAL_CHARACTER_CLASS,
    intake: {
      ...emptyIntake(),
      playerName: TUTORIAL_DISPLAY_NAME,
      northStar: TUTORIAL_NORTH_STAR,
    },
    customQuests: [...TUTORIAL_QUESTS],
    customEpics: [...TUTORIAL_EPICS],
    customDisciplines: [...TUTORIAL_DISCIPLINES],
    habitDisciplineIds: [...TUTORIAL_STARTER_HABIT_IDS],
    tutorialStarterVersion: TUTORIAL_STARTER_VERSION,
    usesSharedCatalog: false,
  };
}
