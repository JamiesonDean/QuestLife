import {
  TUTORIAL_CHARACTER_ID,
  TUTORIAL_DISCIPLINES,
  TUTORIAL_EPICS,
  TUTORIAL_QUESTS,
} from "../data/tutorialCharacter.ts";
import type { Character } from "../domain/character.ts";
import type { CharacterRuntime, StoredCharacterRegistry } from "./registryTypes.ts";

const TUTORIAL_QUEST_IDS = new Set(TUTORIAL_QUESTS.map((q) => q.id));
const TUTORIAL_DISCIPLINE_IDS = new Set(TUTORIAL_DISCIPLINES.map((d) => d.id));
const TUTORIAL_EPIC_NAMES = new Set(TUTORIAL_EPICS.map((e) => e.name.toLowerCase()));

/** Owner saves are tagged with these fields — never valid in a public demo registry. */
export function isOwnerTaggedCharacter(character: Character): boolean {
  return character.usesSharedCatalog === true;
}

function tutorialCatalogIsPure(character: CharacterRuntime): boolean {
  if (character.customQuests.some((q) => !TUTORIAL_QUEST_IDS.has(q.id))) return false;
  if (character.customDisciplines.some((d) => !TUTORIAL_DISCIPLINE_IDS.has(d.id))) return false;
  if (character.customEpics.some((e) => !TUTORIAL_EPIC_NAMES.has(e.name.toLowerCase()))) return false;
  return true;
}

/**
 * Drop owner-tagged characters and reset Jules if the demo catalog was contaminated
 * (e.g. stale localStorage from an owner build on the same origin).
 */
export function guardPublicRegistry(registry: StoredCharacterRegistry): StoredCharacterRegistry {
  let characters = { ...registry.characters };
  let activeCharacterId = registry.activeCharacterId;
  let changed = false;

  for (const [id, character] of Object.entries(characters)) {
    if (!isOwnerTaggedCharacter(character)) continue;
    delete characters[id];
    changed = true;
    if (activeCharacterId === id) activeCharacterId = null;
  }

  const tutorial = characters[TUTORIAL_CHARACTER_ID];
  if (tutorial && !tutorialCatalogIsPure(tutorial)) {
    delete characters[TUTORIAL_CHARACTER_ID];
    changed = true;
    if (activeCharacterId === TUTORIAL_CHARACTER_ID) activeCharacterId = null;
  }

  if (!changed) return registry;

  return {
    ...registry,
    activeCharacterId,
    characters,
  };
}
