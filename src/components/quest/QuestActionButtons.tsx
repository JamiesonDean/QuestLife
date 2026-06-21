import checkIcon from "../../assets/icon-check.svg";
import plusIcon from "../../assets/icon-plus.svg";
import styles from "./QuestActionButtons.module.css";

export interface QuestActionButtonsProps {
  onAccept?: () => void;
  onComplete?: () => void;
}

/** Accept / Complete actions for unassigned quests on the All Quests tab. */
export function QuestActionButtons({ onAccept, onComplete }: QuestActionButtonsProps) {
  return (
    <div className={styles.row}>
      <button type="button" className={styles.button} data-variant="accept" onClick={onAccept}>
        <img className={styles.icon} src={plusIcon} alt="" />
        <span className={styles.label}>Accept</span>
      </button>
      <button type="button" className={styles.button} data-variant="complete" onClick={onComplete}>
        <img className={styles.icon} src={checkIcon} alt="" />
        <span className={styles.label}>Complete</span>
      </button>
    </div>
  );
}
