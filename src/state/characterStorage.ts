import {
  DEFAULT_EPICS,
  DEFAULT_QUESTS,
  DISCIPLINES,
} from "@questlife/catalog";
import {
  createOwnerFreshRegistry,
  hasOwnerLegacyData,
  migrateLegacyOwnerSave,
  normalizeOwnerRegistry,
  ownerDefaultActiveCharacterId,
} from "@questlife/ownerRegistry";
import { TUTORIAL_CHARACTER_ID, TUTORIAL_DISPLAY_NAME, TUTORIAL_STARTER_VERSION } from "../data/tutorialCharacter.ts";
import {
  characterIdFromName,
  createTutorialCharacter,
  DEFAULT_CHARACTER_CLASS,
  type Character,
} from "../domain/character.ts";
import type { Discipline } from "../domain/discipline.ts";
import type { Epic } from "../domain/epic.ts";
import type { IntakeProfile, StarterPack } from "../domain/intake.ts";
import type { Quest } from "../domain/quest.ts";
import { freshState, todayStr, tutorialFreshGameState, type GameState } from "./game.ts";
import { IS_OWNER_MODE, SESSION_ONLY_STORAGE } from "../config/appMode.ts";
import { guardPublicRegistry } from "./publicRegistryGuard.ts";
import {
  REGISTRY_VERSION,
  type CharacterRuntime,
  type StoredCharacterRegistry,
} from "./registryTypes.ts";

const REGISTRY_KEY = "questlife.characters.v1";

const LEGACY_KEYS = {
  onboarding: "questlife.onboarding.v1",
  game: "questlife.state.v2",
  gameLegacy: "questlife.state.v1",
  quests: "questlife.quests.custom.v1",
  epics: "questlife.epics.custom.v1",
  disciplines: "questlife.disciplines.custom.v1",
} as const;

const LEGACY_DEMO_CHARACTER_IDS = ["alex", "elliot"] as const;

export type { CharacterRuntime, StoredCharacterRegistry };

function tutorialFreshRuntime(): CharacterRuntime {
  const base = createTutorialCharacter();
  return {
    ...base,
    onboardingComplete: true,
    gameState: tutorialFreshGameState(),
  };
}

function removeLegacyDemoCharacter(
  characters: Record<string, CharacterRuntime>,
): Record<string, CharacterRuntime> {
  let next = characters;
  for (const id of LEGACY_DEMO_CHARACTER_IDS) {
    if (!next[id]) continue;
    if (next === characters) next = { ...characters };
    delete next[id];
  }
  return next;
}

function migrateLegacyTutorialId(
  characters: Record<string, CharacterRuntime>,
): Record<string, CharacterRuntime> {
  const legacy = characters.morgan;
  if (!legacy || characters[TUTORIAL_CHARACTER_ID]) return characters;

  const { morgan: _removed, ...rest } = characters;
  return {
    ...rest,
    [TUTORIAL_CHARACTER_ID]: {
      ...legacy,
      id: TUTORIAL_CHARACTER_ID,
      displayName: TUTORIAL_DISPLAY_NAME,
    },
  };
}

function ensureTutorialCharacter(
  characters: Record<string, CharacterRuntime>,
): Record<string, CharacterRuntime> {
  const migrated = migrateLegacyTutorialId(characters);
  const cleaned = removeLegacyDemoCharacter(migrated);
  const existing = cleaned[TUTORIAL_CHARACTER_ID];
  if (!existing || (existing.tutorialStarterVersion ?? 0) < TUTORIAL_STARTER_VERSION) {
    return {
      ...cleaned,
      [TUTORIAL_CHARACTER_ID]: tutorialFreshRuntime(),
    };
  }
  return cleaned;
}

function normalizeHabitDisciplineIds(characters: Record<string, CharacterRuntime>): void {
  for (const id of Object.keys(characters)) {
    const entry = characters[id]! as CharacterRuntime & {
      disciplineBoardIds?: string[];
      habitDisciplineIds?: string[];
    };
    if (!Array.isArray(entry.habitDisciplineIds)) {
      characters[id] = {
        ...entry,
        habitDisciplineIds: Array.isArray(entry.disciplineBoardIds) ? entry.disciplineBoardIds : [],
      };
    }
  }
}

/** Strip owner-style shared-catalog characters without naming them in public builds. */
function stripSharedCatalogCharacters(
  characters: Record<string, CharacterRuntime>,
): Record<string, CharacterRuntime> {
  let next = characters;
  for (const [id, character] of Object.entries(characters)) {
    if (character.usesSharedCatalog !== true) continue;
    if (next === characters) next = { ...characters };
    delete next[id];
  }
  return next;
}

/** Public demo: Jules is always available alongside custom characters. */
export function activateTutorialDemo(registry: StoredCharacterRegistry): StoredCharacterRegistry {
  const withTutorial = ensureTutorialCharacter(registry.characters);
  return finalizePublicRegistry({
    ...registry,
    characters: withTutorial,
    welcomeComplete: true,
    activeCharacterId: TUTORIAL_CHARACTER_ID,
  });
}

function normalizePublicRegistry(raw: StoredCharacterRegistry): StoredCharacterRegistry {
  const characters = stripSharedCatalogCharacters({ ...raw.characters });
  normalizeHabitDisciplineIds(characters);

  let activeCharacterId = raw.activeCharacterId;
  const welcomeComplete =
    raw.welcomeComplete ??
    (raw.version !== undefined && raw.version < REGISTRY_VERSION);

  if (activeCharacterId === "alex" || activeCharacterId === "elliot" || activeCharacterId === "morgan") {
    activeCharacterId = TUTORIAL_CHARACTER_ID;
  }

  const withTutorial = ensureTutorialCharacter(characters);

  if (welcomeComplete) {
    if (!activeCharacterId || !withTutorial[activeCharacterId]) {
      activeCharacterId = TUTORIAL_CHARACTER_ID;
    }
  } else if (activeCharacterId && !withTutorial[activeCharacterId]) {
    activeCharacterId = null;
  }

  return {
    version: REGISTRY_VERSION,
    activeCharacterId,
    characters: withTutorial,
    welcomeComplete,
  };
}

function finalizePublicRegistry(registry: StoredCharacterRegistry): StoredCharacterRegistry {
  return guardPublicRegistry(normalizePublicRegistry(registry));
}

function normalizeRegistry(raw: StoredCharacterRegistry): StoredCharacterRegistry {
  if (IS_OWNER_MODE) {
    return normalizeOwnerRegistry(raw);
  }
  return finalizePublicRegistry(raw);
}

function clearPersistedQuestLifeData(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(REGISTRY_KEY);
  for (const key of Object.values(LEGACY_KEYS)) {
    localStorage.removeItem(key);
  }
}

/** In-memory starting point when no save exists yet. */
export function createFreshRegistry(): StoredCharacterRegistry {
  if (IS_OWNER_MODE) {
    return createOwnerFreshRegistry();
  }

  return finalizePublicRegistry({
    version: REGISTRY_VERSION,
    activeCharacterId: null,
    characters: {},
    welcomeComplete: false,
  });
}

export function loadCharacterRegistry(): StoredCharacterRegistry {
  if (SESSION_ONLY_STORAGE) {
    clearPersistedQuestLifeData();
    return guardPublicRegistry(createFreshRegistry());
  }

  if (typeof localStorage === "undefined") {
    return createFreshRegistry();
  }

  const raw = localStorage.getItem(REGISTRY_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as StoredCharacterRegistry;
      const normalized = normalizeRegistry({
        activeCharacterId:
          parsed.activeCharacterId ??
          (IS_OWNER_MODE ? ownerDefaultActiveCharacterId() : TUTORIAL_CHARACTER_ID),
        characters: parsed.characters ?? {},
        version: parsed.version,
        welcomeComplete: parsed.welcomeComplete,
      });
      const next = JSON.stringify(normalized);
      if (next !== raw) {
        localStorage.setItem(REGISTRY_KEY, next);
      }
      return normalized;
    } catch {
      // fall through to migration
    }
  }

  if (IS_OWNER_MODE && hasOwnerLegacyData()) {
    const { runtime, activeId } = migrateLegacyOwnerSave();
    return normalizeOwnerRegistry({
      activeCharacterId: activeId,
      characters: { [runtime.id]: runtime },
    });
  }

  return createFreshRegistry();
}

export function saveCharacterRegistry(registry: StoredCharacterRegistry): void {
  if (SESSION_ONLY_STORAGE) return;
  if (typeof localStorage === "undefined") return;
  const toSave = IS_OWNER_MODE ? registry : finalizePublicRegistry(registry);
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(toSave));
}

export function markWelcomeComplete(registry: StoredCharacterRegistry): StoredCharacterRegistry {
  return { ...registry, welcomeComplete: true };
}

export function createCharacterFromIntake(
  registry: StoredCharacterRegistry,
  intake: IntakeProfile,
  pack: StarterPack,
): StoredCharacterRegistry {
  const displayName = intake.playerName.trim();
  if (!displayName) {
    throw new Error("Character name is required.");
  }

  const id = characterIdFromName(displayName, registry.characters);
  const today = todayStr();
  const gameState: GameState = {
    ...freshState(today),
    assignedQuests: [...pack.assignedQuestIds],
  };

  const character: CharacterRuntime = {
    id,
    displayName,
    createdAt: new Date().toISOString(),
    characterClass: DEFAULT_CHARACTER_CLASS,
    intake,
    customQuests: pack.quests,
    customEpics: pack.epics,
    customDisciplines: pack.disciplines,
    habitDisciplineIds: pack.disciplines.map((d) => d.id),
    usesSharedCatalog: false,
    gameState,
    onboardingComplete: true,
  };

  return {
    version: REGISTRY_VERSION,
    activeCharacterId: id,
    characters: {
      ...registry.characters,
      [id]: character,
    },
  };
}

export function questsForCharacter(character: Character | undefined): Quest[] {
  if (character?.usesSharedCatalog === false) {
    return character.customQuests;
  }
  return [...DEFAULT_QUESTS, ...(character?.customQuests ?? [])];
}

export function epicsForCharacter(character: Character | undefined): Epic[] {
  if (character?.usesSharedCatalog === false) {
    return character.customEpics;
  }
  return [...DEFAULT_EPICS, ...(character?.customEpics ?? [])];
}

export function disciplinesForCharacter(character: Character | undefined): Discipline[] {
  if (character?.usesSharedCatalog === false) {
    return character.customDisciplines;
  }
  return [...DISCIPLINES, ...(character?.customDisciplines ?? [])];
}

export function switchActiveCharacter(
  registry: StoredCharacterRegistry,
  characterId: string,
): StoredCharacterRegistry {
  if (!registry.characters[characterId]) return registry;
  return { ...registry, activeCharacterId: characterId };
}

export function patchActiveCharacter(
  registry: StoredCharacterRegistry,
  patch: Partial<CharacterRuntime>,
): StoredCharacterRegistry {
  const activeId = registry.activeCharacterId;
  if (!activeId) return registry;

  const current = registry.characters[activeId];
  if (!current) return registry;

  return {
    ...registry,
    characters: {
      ...registry.characters,
      [activeId]: { ...current, ...patch },
    },
  };
}
