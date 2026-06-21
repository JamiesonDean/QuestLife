import thumbDownIcon from "../../assets/thumb-down.svg";
import thumbUpIcon from "../../assets/thumb-up.svg";
import styles from "./AnswerButtons.module.css";

export interface AnswerButtonsProps {
  yesLabel: string;
  noLabel: string;
  /** Currently selected answer, if any. */
  value?: "yes" | "no";
  onAnswer?: (answer: "yes" | "no") => void;
}

/**
 * The two answer buttons for a yes/no discipline (e.g. "Aye" / "Naur"). Neutral
 * grey in the base state; the selected answer is highlighted when `value` is set.
 */
export function AnswerButtons({ yesLabel, noLabel, value, onAnswer }: AnswerButtonsProps) {
  return (
    <div className={styles.row}>
      <button
        type="button"
        className={styles.button}
        data-variant="yes"
        aria-pressed={value === "yes"}
        data-selected={value === "yes" || undefined}
        onClick={() => onAnswer?.("yes")}
      >
        <img className={styles.icon} src={thumbUpIcon} alt="" />
        <span className={styles.label}>{yesLabel}</span>
      </button>
      <button
        type="button"
        className={styles.button}
        data-variant="no"
        aria-pressed={value === "no"}
        data-selected={value === "no" || undefined}
        onClick={() => onAnswer?.("no")}
      >
        <img className={styles.icon} src={thumbDownIcon} alt="" />
        <span className={styles.label}>{noLabel}</span>
      </button>
    </div>
  );
}
