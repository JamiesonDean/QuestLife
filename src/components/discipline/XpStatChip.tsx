import xpArrowIcon from "../../assets/stat-xp-arrow.png";
import xpBase from "../../assets/stat-xp-base.svg";
import styles from "./XpStatChip.module.css";

/** Icon anchor on the chip (Figma). */
const GROUP_X = 49.56;
const GROUP_Y = -8.01;
const ICON_W = 45.115 * (22.578 / 24);
const ICON_H = 45.115;
const BASE_LEFT = 5.8;
const BASE_TOP = 9.89;
const BASE_W = 29.599;
const BASE_H = 31.085;

export interface XpStatChipProps {
  amount: number;
  completed?: boolean;
}

/**
 * +XP chip. Flat background when active; solid fill when completed.
 * Chevron base + arrow icon overflow the chip boundary on the right.
 */
export function XpStatChip({ amount, completed }: XpStatChipProps) {
  const tone = amount < 0 ? "loss" : "gain";
  const sign = amount >= 0 ? "+" : "";

  return (
    <span
      className={styles.chip}
      data-tone={tone}
      data-completed={completed || undefined}
    >
      <span className={styles.value}>
        {sign}
        {amount}
      </span>
      <span
        className={styles.iconGroup}
        style={{ left: GROUP_X, top: GROUP_Y }}
        aria-hidden
      >
        {!completed && (
          <img
            className={styles.xpBase}
            src={xpBase}
            alt=""
            style={{
              left: BASE_LEFT,
              top: BASE_TOP,
              width: BASE_W,
              height: BASE_H,
            }}
          />
        )}
        <span
          className={styles.iconLayer}
          style={{ width: ICON_W, height: ICON_H }}
        >
          <img className={styles.iconImg} src={xpArrowIcon} alt="" />
        </span>
      </span>
    </span>
  );
}
