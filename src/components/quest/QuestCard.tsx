import { type Category, type Scale, type Track } from "../../domain/quest.ts";
import { CheckIcon } from "../ui/CheckIcon.tsx";
import { QuestTitle } from "./QuestTitle.tsx";
import { ScaleLabel } from "./ScaleLabel.tsx";
import { SideQuestTag } from "./SideQuestTag.tsx";
import { EpicTag } from "./EpicTag.tsx";
import { CategoryTag } from "./CategoryTag.tsx";
import { LevelDisplay } from "./LevelDisplay.tsx";
import { RewardBadge } from "./RewardBadge.tsx";
import { QuestActionButtons } from "./QuestActionButtons.tsx";
import styles from "./QuestCard.module.css";

export interface QuestCardProps {
  title: string;
  scale: Scale;
  track: Track;
  category: Category;
  unlockLevel: number;
  xp: number;
  epic?: string;
  isFuture?: boolean;
  completed?: boolean;
  completedToday?: boolean;
  unassigned?: boolean;
  onToggle?: () => void;
  onAccept?: () => void;
  onComplete?: () => void;
}

export function QuestCard({
  title,
  scale,
  track,
  category,
  unlockLevel,
  xp,
  epic,
  isFuture,
  completed,
  completedToday,
  unassigned,
  onToggle,
  onAccept,
  onComplete,
}: QuestCardProps) {
  const isSide = track === "side";
  const canUncomplete = completedToday;
  const showActions = unassigned && (onAccept || onComplete);
  const showEpic = Boolean(!isSide && epic);

  function handleCardClick() {
    if (!onToggle) return;
    if (completed && !canUncomplete) return;
    onToggle();
  }

  function renderMetaLeft() {
    if (isSide) {
      return <SideQuestTag />;
    }
    return <ScaleLabel scale={scale} />;
  }

  if (completed) {
    return (
      <article
        className={styles.card}
        data-completed-today={completedToday || undefined}
        data-completed-archived={completedToday ? undefined : true}
        data-interactive={onToggle && completedToday ? true : undefined}
        role={onToggle && completedToday ? "button" : undefined}
        tabIndex={onToggle && completedToday ? 0 : undefined}
        aria-pressed={onToggle && completedToday ? true : undefined}
        onClick={handleCardClick}
        onKeyDown={(event) => {
          if (!onToggle || !completedToday) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleCardClick();
          }
        }}
      >
        <div className={styles.completedRow}>
          <CheckIcon />
          <p className={styles.completedTitle}>{title}</p>
        </div>
        <RewardBadge xp={xp} completed={completedToday} />
      </article>
    );
  }

  return (
    <article
      className={styles.card}
      data-scale={isSide ? undefined : scale}
      data-track={track}
      data-future={isFuture || undefined}
      data-completed={completed || undefined}
      data-unassigned={unassigned || undefined}
      data-interactive={onToggle && !completed ? true : undefined}
      role={onToggle && !completed ? "button" : undefined}
      tabIndex={onToggle && !completed ? 0 : undefined}
      aria-pressed={onToggle ? Boolean(completed) : undefined}
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if (!onToggle || completed) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className={styles.body}>
        <div className={styles.leftColumn}>
          <div className={styles.cellTitle} data-dimmed={unassigned || undefined}>
            <QuestTitle>{title}</QuestTitle>
          </div>

          <div className={styles.cellMeta} data-dimmed={unassigned || undefined}>
            {renderMetaLeft()}
          </div>

          <div
            className={styles.cellEpic}
            data-dimmed={unassigned || undefined}
            data-empty={showEpic ? undefined : true}
          >
            {showEpic ? <EpicTag epic={epic!} /> : null}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.cellCategory} data-dimmed={unassigned || undefined}>
            <CategoryTag category={category} />
          </div>

          <div className={styles.cellLevel} data-dimmed={unassigned || undefined}>
            <LevelDisplay level={unlockLevel} />
          </div>

          <div className={styles.cellReward} data-dimmed={unassigned || undefined}>
            <RewardBadge xp={xp} />
          </div>
        </div>
      </div>

      {showActions ? (
        <div className={styles.cellActions}>
          <QuestActionButtons onAccept={onAccept} onComplete={onComplete} />
        </div>
      ) : null}
    </article>
  );
}
