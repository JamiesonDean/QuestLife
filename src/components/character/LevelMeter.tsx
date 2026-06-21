import xpArrow from "../../assets/stat-xp-arrow.png";
import styles from "./LevelMeter.module.css";

export interface LevelMeterProps {
  /** Progress to the next level, 0–1. */
  progress: number;
}

/**
 * Vertical level meter from the character header — a grey track with a gold fill
 * rising from the bottom and the gold "level up" arrow overlaid.
 */
export function LevelMeter({ progress }: LevelMeterProps) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;

  return (
    <div className={styles.meter}>
      <div className={styles.fill} style={{ height: `${pct}%` }} />
      <img className={styles.arrow} src={xpArrow} alt="" />
    </div>
  );
}
