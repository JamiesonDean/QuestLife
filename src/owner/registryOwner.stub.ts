import type { StoredCharacterRegistry, CharacterRuntime } from "../state/registryTypes.ts";

/** Public builds — owner registry is never invoked at runtime. */
export function normalizeOwnerRegistry(_raw: StoredCharacterRegistry): StoredCharacterRegistry {
  throw new Error("Owner registry is unavailable in public builds.");
}

export function createOwnerFreshRegistry(): StoredCharacterRegistry {
  throw new Error("Owner registry is unavailable in public builds.");
}

export function migrateLegacyOwnerSave(): {
  runtime: CharacterRuntime;
  activeId: string | null;
} {
  throw new Error("Owner registry is unavailable in public builds.");
}

export function hasOwnerLegacyData(): boolean {
  return false;
}

export function ownerDefaultActiveCharacterId(): string {
  return "";
}

export function ownerDefaultDisplayName(): string {
  return "Player";
}

export function ownerCharacterSortPrefix(_id: string): string | null {
  return null;
}
