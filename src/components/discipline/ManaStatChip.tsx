import manaPotionIcon from "../../assets/stat-mana-potion.png";
import chipMask from "../../assets/stat-mana-chip-mask.svg";
import styles from "./ManaStatChip.module.css";

/** Mask group origin on the chip (Figma). */
const GROUP_X = 1.49;
const GROUP_Y = 0;
/** Layer inside the mask group (Figma). */
const LAYER_X = 23.16;
const LAYER_Y = -40.59;
const LAYER = 86.913;
const MASK_W = 44.605;
const MASK_H = 51.298;
const MASK_POS_X = 25.323;
const MASK_POS_Y = 27.763;

export interface ManaStatChipProps {
  amount: number;
  completed?: boolean;
}

/**
 * +Mana / −Mana chip. The light box is the layout boundary. The potion bottle
 * body (mask silhouette, excluding shadow) is centred on the right edge of the
 * box — positioned via Figma mask-group coordinates, not viewport centre.
 */
export function ManaStatChip({ amount, completed }: ManaStatChipProps) {
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
        <span
          className={styles.iconLayer}
          style={{
            left: LAYER_X,
            top: LAYER_Y,
            width: LAYER,
            height: LAYER,
            WebkitMaskImage: `url("${chipMask}")`,
            maskImage: `url("${chipMask}")`,
            WebkitMaskSize: `${MASK_W}px ${MASK_H}px`,
            maskSize: `${MASK_W}px ${MASK_H}px`,
            WebkitMaskPosition: `${MASK_POS_X}px ${MASK_POS_Y}px`,
            maskPosition: `${MASK_POS_X}px ${MASK_POS_Y}px`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        >
          <img className={styles.iconImg} src={manaPotionIcon} alt="" />
        </span>
      </span>
    </span>
  );
}
