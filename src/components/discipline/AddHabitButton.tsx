import styles from "./AnswerButtons.module.css";

export interface AddHabitButtonProps {
  onAdd?: () => void;
}

/** Matches Aye / Naur answer button styling. */
export function AddHabitButton({ onAdd }: AddHabitButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      data-variant="yes"
      onClick={(event) => {
        event.stopPropagation();
        onAdd?.();
      }}
    >
      <span className={styles.label}>Add Habit</span>
    </button>
  );
}
