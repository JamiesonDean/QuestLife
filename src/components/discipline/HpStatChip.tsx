import hpHeartIcon from "../../assets/stat-hp-heart.png";
import chipGain from "../../assets/stat-chip-gain.svg";
import chipLoss from "../../assets/stat-chip-loss.svg";
import styles from "./HpStatChip.module.css";

/** Icon anchor on the chip (Figma). */
const GROUP_X = 48.43;
const GROUP_Y = -5.4;
const ICON = 44.795;

export interface HpStatChipProps {
  amount: number;
  completed?: boolean;
}

/**
 * +HP / −HP chip. Slanted background when active; solid fill when completed.
 * The heart icon overflows the chip boundary on the right.
 */
export function HpStatChip({ amount, completed }: HpStatChipProps) {
  const tone = amount < 0 ? "loss" : "gain";
  const sign = amount >= 0 ? "+" : "";

  return (
    <span
      className={styles.chip}
      data-tone={tone}
      data-completed={completed || undefined}
    >
      {!completed && (
        <img
          className={styles.slantedBg}
          src={tone === "loss" ? chipLoss : chipGain}
          alt=""
        />
      )}
      <span className={styles.value}>
        {sign}
        {amount}
      </span>
      <span
        className={styles.iconGroup}
        style={{ left: GROUP_X, top: GROUP_Y }}
        aria-hidden
      >
        <span
          className={styles.iconLayer}
          style={{ width: ICON, height: ICON }}
        >
          <img className={styles.iconImg} src={hpHeartIcon} alt="" />
        </span>
      </span>
    </span>
  );
}
