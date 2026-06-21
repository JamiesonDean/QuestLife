import { TRACKS } from "../../domain/quest.ts";
import styles from "./SideQuestTag.module.css";

/** Side quest label — same slot as EpicTag on main quest cards. */
export function SideQuestTag() {
  return (
    <div className={styles.row}>
      <p className={styles.name}>{TRACKS.side.label} Quest</p>
    </div>
  );
}
