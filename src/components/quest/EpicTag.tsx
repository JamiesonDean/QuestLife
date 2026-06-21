import { EpicIconTile } from "../epic/EpicIconTile.tsx";
import styles from "./EpicTag.module.css";

export interface EpicTagProps {
  epic: string;
}

/** Storyline row — 24px pixel icon tile + storyline name. */
export function EpicTag({ epic }: EpicTagProps) {
  return (
    <div className={styles.row}>
      <EpicIconTile name={epic} size={24} />
      <p className={styles.name}>{epic}</p>
    </div>
  );
}
