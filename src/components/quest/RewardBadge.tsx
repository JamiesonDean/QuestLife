import styles from "./RewardBadge.module.css";

export interface RewardBadgeProps {
  xp: number;
  /** Completed-today styling — gold gradient pill with "!". */
  completed?: boolean;
}

export function RewardBadge({ xp, completed }: RewardBadgeProps) {
  return (
    <div className={styles.shell} data-completed={completed || undefined}>
      <div className={styles.badge}>
        <span className={styles.text}>
          +{xp} XP{completed ? "!" : ""}
        </span>
      </div>
    </div>
  );
}
