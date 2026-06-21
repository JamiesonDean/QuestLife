import { epicIconSrcFor } from "@questlife/epicIcons";
import styles from "./EpicTag.module.css";

export interface EpicTagProps {
  epic: string;
}

/** Epic row — 24px pixel icon tile + epic name. */
export function EpicTag({ epic }: EpicTagProps) {
  return (
    <div className={styles.row}>
      <span className={styles.iconTile}>
        <img className={styles.iconFill} src={epicIconSrcFor(epic)} alt="" />
      </span>
      <p className={styles.name}>{epic}</p>
    </div>
  );
}
