import type { CSSProperties } from "react";
import hpHeartIcon from "../../assets/stat-hp-heart.png";
import manaPotionIcon from "../../assets/stat-mana-potion.png";
import manaMask from "../../assets/stat-mana-mask.svg";
import xpArrowIcon from "../../assets/stat-xp-arrow.png";
import type { Stat } from "../../domain/discipline.ts";
import styles from "./StatIcon.module.css";

/**
 * Icon geometry per stat, expressed against a 24px-tall base box (the values
 * lifted from Figma). `StatIcon` scales every dimension by `size / 24`, so the
 * same icon renders crisply in a 24px chip, a 30px total, or a 67px stat bar.
 *  - "crop": source image positioned inside an overflow-clipped box.
 *  - "mask": source image revealed through an SVG silhouette.
 */
type IconSpec =
  | {
      type: "crop";
      src: string;
      boxWidth: number;
      imgWidth: string;
      imgHeight: string;
      imgLeft: string;
      imgTop: string;
    }
  | {
      type: "mask";
      src: string;
      mask: string;
      boxWidth: number;
      layer: number;
      maskWidth: number;
      maskHeight: number;
      maskX: number;
      maskY: number;
      layerX: number;
      layerY: number;
    };

const BASE = 24;

const ICONS: Record<Stat, IconSpec> = {
  hp: {
    type: "crop",
    src: hpHeartIcon,
    boxWidth: 24,
    imgWidth: "159.6%",
    imgHeight: "159.6%",
    imgLeft: "-29.61%",
    imgTop: "-29.99%",
  },
  xp: {
    type: "crop",
    src: xpArrowIcon,
    boxWidth: 22.578,
    imgWidth: "134.09%",
    imgHeight: "108.91%",
    imgLeft: "-16.79%",
    imgTop: "-3.47%",
  },
  mana: {
    type: "mask",
    src: manaPotionIcon,
    mask: manaMask,
    boxWidth: 20.869,
    layer: 40.662,
    maskWidth: 20.869,
    maskHeight: 24,
    maskX: 11.848,
    maskY: 12.989,
    layerX: -11.85,
    layerY: -12.99,
  },
};

export interface StatIconProps {
  stat: Stat;
  /** Icon height in px (width follows the icon's aspect). Defaults to 24. */
  size?: number;
  /** Optional CSS box-shadow applied to the icon (e.g. a coloured glow). */
  glow?: string;
}

export function StatIcon({ stat, size = BASE, glow }: StatIconProps) {
  const spec = ICONS[stat];
  const f = size / BASE;
  const box: CSSProperties = {
    width: spec.boxWidth * f,
    height: size,
    boxShadow: glow,
  };

  if (spec.type === "crop") {
    return (
      <span className={styles.box} style={box}>
        <img
          className={styles.cropImg}
          src={spec.src}
          alt=""
          style={{
            width: spec.imgWidth,
            height: spec.imgHeight,
            left: spec.imgLeft,
            top: spec.imgTop,
          }}
        />
      </span>
    );
  }

  return (
    <span className={styles.box} style={box}>
      <span
        className={styles.maskLayer}
        style={{
          width: spec.layer * f,
          height: spec.layer * f,
          left: spec.layerX * f,
          top: spec.layerY * f,
          WebkitMaskImage: `url("${spec.mask}")`,
          maskImage: `url("${spec.mask}")`,
          WebkitMaskSize: `${spec.maskWidth * f}px ${spec.maskHeight * f}px`,
          maskSize: `${spec.maskWidth * f}px ${spec.maskHeight * f}px`,
          WebkitMaskPosition: `${spec.maskX * f}px ${spec.maskY * f}px`,
          maskPosition: `${spec.maskX * f}px ${spec.maskY * f}px`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      >
        <img className={styles.maskImg} src={spec.src} alt="" />
      </span>
    </span>
  );
}
