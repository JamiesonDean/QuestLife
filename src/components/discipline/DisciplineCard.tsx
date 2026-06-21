import type { KeyboardEvent } from "react";
import type { Discipline, StatDelta } from "../../domain/discipline.ts";
import { CheckIcon } from "../ui/CheckIcon.tsx";
import { StatChip } from "./StatChip.tsx";
import { AnswerButtons } from "./AnswerButtons.tsx";
import { AddHabitButton } from "./AddHabitButton.tsx";
import styles from "./DisciplineCard.module.css";

export interface DisciplineCardProps {
  discipline: Discipline;
  done?: boolean;
  answer?: "yes" | "no";
  progress?: number;
  isHabit?: boolean;
  /** When true (expanded list), non-habits show Add Habit. */
  showHabitControl?: boolean;
  onAddHabit?: () => void;
  onToggleCheck?: () => void;
  onAnswer?: (answer: "yes" | "no") => void;
  onLogStreak?: () => void;
}

function CompletedRow({
  title,
  rewards,
}: {
  title: string;
  rewards: StatDelta[];
}) {
  const isGain = rewards.every((r) => r.amount >= 0);

  return (
    <>
      <div className={styles.completedRow}>
        <CheckIcon />
        <p className={styles.completedTitle}>{title}</p>
      </div>
      <div
        className={styles.completedRewards}
        data-tone={isGain ? "gain" : "loss"}
      >
        {rewards.map((reward) => (
          <StatChip
            key={reward.stat}
            stat={reward.stat}
            amount={reward.amount}
            completed
          />
        ))}
      </div>
    </>
  );
}

export function DisciplineCard({
  discipline,
  done,
  answer,
  progress,
  isHabit,
  showHabitControl,
  onAddHabit,
  onToggleCheck,
  onAnswer,
  onLogStreak,
}: DisciplineCardProps) {
  const addHabitControl =
    showHabitControl && !isHabit && onAddHabit ? (
      <AddHabitButton onAdd={onAddHabit} />
    ) : null;

  if (discipline.kind === "check") {
    if (done) {
      return (
        <article
          className={styles.card}
          data-kind="check"
          data-done
          data-interactive={onToggleCheck ? true : undefined}
          role={onToggleCheck ? "button" : undefined}
          tabIndex={onToggleCheck ? 0 : undefined}
          aria-pressed
          onClick={onToggleCheck}
          onKeyDown={(event) => handleKey(event, onToggleCheck)}
        >
          <CompletedRow title={discipline.title} rewards={discipline.rewards} />
        </article>
      );
    }

    return (
      <article
        className={styles.card}
        data-kind="check"
        data-interactive={onToggleCheck ? true : undefined}
        role={onToggleCheck ? "button" : undefined}
        tabIndex={onToggleCheck ? 0 : undefined}
        aria-pressed={onToggleCheck ? false : undefined}
        onClick={onToggleCheck}
        onKeyDown={(event) => handleKey(event, onToggleCheck)}
      >
        <div className={styles.main}>
          <p className={styles.title}>{discipline.title}</p>
          {addHabitControl}
        </div>
        <div className={styles.rewards}>
          {discipline.rewards.map((reward) => (
            <StatChip key={reward.stat} stat={reward.stat} amount={reward.amount} />
          ))}
        </div>
      </article>
    );
  }

  if (discipline.kind === "yes-no") {
    if (answer) {
      const earned = answer === "yes" ? discipline.yes : discipline.no;
      return (
        <article
          className={styles.card}
          data-kind="yes-no"
          data-done
          data-interactive={onAnswer ? true : undefined}
          role={onAnswer ? "button" : undefined}
          tabIndex={onAnswer ? 0 : undefined}
          aria-pressed
          onClick={() => onAnswer?.(answer)}
          onKeyDown={(event) => handleKey(event, () => onAnswer?.(answer))}
        >
          <CompletedRow
            title={discipline.title}
            rewards={[earned]}
          />
        </article>
      );
    }

    return (
      <article className={styles.card} data-kind="yes-no">
        <div className={styles.prompt}>
          <p className={styles.title}>{discipline.title}</p>
          {addHabitControl}
          <AnswerButtons
            yesLabel={discipline.yesLabel}
            noLabel={discipline.noLabel}
            value={answer}
            onAnswer={onAnswer}
          />
        </div>
        <div className={styles.outcomes}>
          <StatChip stat={discipline.yes.stat} amount={discipline.yes.amount} />
          <span className={styles.slash}>/</span>
          <StatChip stat={discipline.no.stat} amount={discipline.no.amount} />
        </div>
      </article>
    );
  }

  const current = progress ?? discipline.progress;
  return (
    <article
      className={styles.card}
      data-kind="streak"
      data-interactive={onLogStreak ? true : undefined}
      role={onLogStreak ? "button" : undefined}
      tabIndex={onLogStreak ? 0 : undefined}
      onClick={onLogStreak}
      onKeyDown={(event) => handleKey(event, onLogStreak)}
    >
      <div className={styles.streakMain}>
        <p className={styles.title}>{discipline.title}</p>
        {addHabitControl}
        <p className={styles.subtitle}>
          {current} / {discipline.threshold} {discipline.unit}
        </p>
      </div>
      <div className={styles.streakRewards}>
        {discipline.rewards.map((reward) => (
          <StatChip key={reward.stat} stat={reward.stat} amount={reward.amount} />
        ))}
      </div>
    </article>
  );
}

function handleKey(event: KeyboardEvent, handler?: () => void) {
  if (!handler) return;
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handler();
  }
}
