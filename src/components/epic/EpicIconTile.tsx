import { epicIconSrcFor } from "@questlife/epicIcons";
import styles from "./EpicIconTile.module.css";

export interface EpicIconTileProps {
  /** Storyline name — resolved via epic icon config. */
  name: string;
  /** White tile size in px (padding scales with size). */
  size?: 96 | 24;
}

/** Pixel storyline icon in a white tile — contain-fit, 10px inset at 96px. */
export function EpicIconTile({ name, size = 96 }: EpicIconTileProps) {
  const tileClass = size === 24 ? styles.tile24 : styles.tile96;

  return (
    <div className={`${styles.tile} ${tileClass}`} aria-hidden>
      <img className={styles.img} src={epicIconSrcFor(name)} alt="" />
    </div>
  );
}
