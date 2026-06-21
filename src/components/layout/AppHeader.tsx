import styles from "./AppHeader.module.css";

export interface CharacterOption {
  id: string;
  displayName: string;
  isDemo?: boolean;
}

export interface AppHeaderProps {
  characters: CharacterOption[];
  activeCharacterId: string | null;
  onSelectCharacter: (id: string) => void;
  onNewCharacter?: () => void;
}

/**
 * Global app chrome — light bar with QuestLife wordmark and character actions.
 */
export function AppHeader({
  characters,
  activeCharacterId,
  onSelectCharacter,
  onNewCharacter,
}: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <p className={styles.wordmark}>QuestLife</p>
      <div className={styles.actions}>
        {characters.length > 1 ? (
          <div className={styles.characterSwitch} role="tablist" aria-label="Characters">
            {characters.map((character) => {
              const active = character.id === activeCharacterId;
              const label = character.isDemo ? `${character.displayName} · Demo` : character.displayName;
              return (
                <button
                  key={character.id}
                  type="button"
                  role="tab"
                  className={styles.characterTab}
                  aria-selected={active}
                  data-active={active ? true : undefined}
                  onClick={() => onSelectCharacter(character.id)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ) : null}
        {onNewCharacter ? (
          <button
            type="button"
            className={styles.newCharacter}
            onClick={onNewCharacter}
          >
            + New character
          </button>
        ) : null}
      </div>
    </header>
  );
}
