import styles from "./LevelDisplay.module.css";

export interface LevelDisplayProps {
  /** Minimum level to unlock the quest. */
  level: number;
}

/**
 * Level indicator, e.g. "Lvl 1" — "Lvl" in Gentium Plus Regular 20px and the
 * number in Gentium Plus Bold 32px, baseline-aligned and right-justified.
 */
export function LevelDisplay({ level }: LevelDisplayProps) {
  return (
    <div className={styles.wrap}>
      <span className={styles.unit}>Lvl</span>
      <span className={styles.value}>{level}</span>
    </div>
  );
}
