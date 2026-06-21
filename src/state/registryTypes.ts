import type { Character } from "../domain/character.ts";
import type { GameState } from "../state/game.ts";

export interface CharacterRuntime extends Character {
  gameState: GameState;
  onboardingComplete: boolean;
}

export interface StoredCharacterRegistry {
  version?: number;
  activeCharacterId: string | null;
  characters: Record<string, CharacterRuntime>;
  /** Set after the player completes the first-visit welcome modal. */
  welcomeComplete?: boolean;
}

/** Bump when save-shape or default-active rules change. */
export const REGISTRY_VERSION = 6;
