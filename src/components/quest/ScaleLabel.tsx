import { SCALES, type Scale } from "../../domain/quest.ts";
import styles from "./ScaleLabel.module.css";

export interface ScaleLabelProps {
  scale: Scale;
}

/** Scale line, e.g. "Minor Quest" — size / reward weight. */
export function ScaleLabel({ scale }: ScaleLabelProps) {
  return <p className={styles.label}>{SCALES[scale].label} Quest</p>;
}
