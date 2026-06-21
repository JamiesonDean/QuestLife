import { StatIcon } from "../stats/StatIcon.tsx";
import styles from "./StatBar.module.css";

type BarStat = "hp" | "mana";

const FILL: Record<BarStat, string> = {
  hp: "var(--ql-hp-fill)",
  mana: "var(--ql-mana-fill)",
};

const ICON_SIZE: Record<BarStat, number> = {
  hp: 68,
  mana: 61,
};

export interface StatBarProps {
  stat: BarStat;
  value: number;
  max: number;
}

/**
 * Horizontal vitals bar for the character header — a grey track with a coloured
 * fill and the stat's pixel icon overlapping the left end. HP carries a soft
 * white glow on the heart, per the Figma frame.
 */
export function StatBar({ stat, value, max }: StatBarProps) {
  const pct = Math.max(0, Math.min(1, max === 0 ? 0 : value / max)) * 100;
  const size = ICON_SIZE[stat];
  const glow = stat === "hp" ? "0 0 16px 0 #ffffff" : undefined;

  return (
    <div className={styles.bar} style={{ height: size }}>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%`, background: FILL[stat] }} />
      </div>
      <span className={styles.icon}>
        <StatIcon stat={stat} size={size} glow={glow} />
      </span>
    </div>
  );
}
