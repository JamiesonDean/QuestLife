import playerAvatar from "@questlife/playerAvatar";
import { StatBar } from "./StatBar.tsx";
import { LevelMeter } from "./LevelMeter.tsx";
import styles from "./CharacterHeader.module.css";

export interface Vital {
  value: number;
  max: number;
}

export interface CharacterHeaderProps {
  name: string;
  /** Class line, e.g. "Bard / Artificer". */
  characterClass: string;
  level: number;
  /** Progress to the next level, 0–1. */
  levelProgress: number;
  hp: Vital;
  mana: Vital;
  /** When provided, renders a "+ New Quest" button in the header's top-right corner. */
  onNewQuest?: () => void;
}

function avatarInitial(name: string): string {
  const trimmed = name.trim();
  return trimmed ? trimmed[0]!.toUpperCase() : "?";
}

/**
 * Top-of-screen character header: avatar, name, class + level and the vertical
 * level meter on the left; HP and Mana bars in the center; "+ New Quest" top right.
 */
export function CharacterHeader({
  name,
  characterClass,
  level,
  levelProgress,
  hp,
  mana,
  onNewQuest,
}: CharacterHeaderProps) {
  const portraitSrc = playerAvatar;

  return (
    <header className={styles.header}>
      <div className={styles.identity}>
        <div className={styles.identityLeft}>
          <div className={styles.avatar}>
            {portraitSrc ? (
              <span className={styles.avatarClip}>
                <img className={styles.avatarImg} src={portraitSrc} alt="" />
              </span>
            ) : (
              <span className={styles.avatarInitial} aria-hidden="true">
                {avatarInitial(name)}
              </span>
            )}
          </div>
          <div className={styles.meta}>
            <p className={styles.name}>{name}</p>
            <div className={styles.sub}>
              <span className={styles.class}>{characterClass}</span>
              <span className={styles.level}>
                <span className={styles.levelWord}>Lvl</span>
                <span className={styles.levelNum}>{level}</span>
              </span>
            </div>
          </div>
        </div>
        <LevelMeter progress={levelProgress} />
      </div>

      <div className={styles.vitals}>
        <StatBar stat="hp" value={hp.value} max={hp.max} />
        <StatBar stat="mana" value={mana.value} max={mana.max} />
      </div>

      {onNewQuest && (
        <button type="button" className={styles.newQuest} onClick={onNewQuest}>
          + New Quest
        </button>
      )}
    </header>
  );
}
