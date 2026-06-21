import type { Epic } from "../../domain/epic.ts";
import type { Quest, Scale } from "../../domain/quest.ts";
import { epicIconConfigFor } from "@questlife/epicIcons";
import styles from "./EpicCard.module.css";

interface EpicCardProps {
  epic: Epic;
  quests: Quest[];
  completedIds: Set<string>;
  assignedIds: Set<string>;
  /** Whether this card is the active Epic filter. */
  pressed?: boolean;
  /** Called when the card is clicked to toggle the Epic filter. */
  onClick?: () => void;
}

const SCALE_ORDER: Record<Scale, number> = { minor: 0, major: 1, boss: 2 };

function EpicIconTile({ name }: { name: string }) {
  const cfg = epicIconConfigFor(name);
  return (
    <div className={styles.iconTile}>
      <img className={styles.iconFill} src={cfg.src} alt="" />
    </div>
  );
}

const SEG_CLASS: Record<Scale, string> = {
  minor: styles.segMinor,
  major: styles.segMajor,
  boss: styles.segBoss,
};

function sortForBar(a: Quest, b: Quest): number {
  return (
    SCALE_ORDER[a.scale] - SCALE_ORDER[b.scale] ||
    a.unlockLevel - b.unlockLevel ||
    a.xp - b.xp
  );
}

/**
 * Epic card — icon tile, name, description, completion progress, and a
 * per-quest tier bar (Minor / Major / Boss). Unassigned quests render at
 * half opacity; assigned quests at full opacity. A green overlay grows
 * left-to-right as quests are completed.
 */
export function EpicCard({
  epic,
  quests,
  completedIds,
  assignedIds,
  pressed,
  onClick,
}: EpicCardProps) {
  const total = quests.length;
  const completedCount = quests.filter((q) => completedIds.has(q.id)).length;
  const completedPct = total > 0 ? (completedCount / total) * 100 : 0;
  const barQuests = [...quests].sort(sortForBar);

  return (
    <div
      className={styles.card}
      data-pressed={pressed || undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
    >
      <EpicIconTile name={epic.name} />

      <p className={styles.name}>{epic.name}</p>
      <p className={styles.description}>{epic.description}</p>

      <div className={styles.footer}>
        <div className={styles.progressRow}>
          <span
            className={styles.completedCount}
            data-active={completedCount > 0 || undefined}
          >
            {completedCount}
          </span>
          <span className={styles.slash}>/</span>
          <span className={styles.totalLabel}>{total} complete</span>
        </div>

        {/* Tier bar + green completed overlay */}
        <div className={styles.barWrap}>
          <div className={styles.bar}>
            {barQuests.map((quest) => (
              <div
                key={quest.id}
                className={SEG_CLASS[quest.scale]}
                data-assigned={assignedIds.has(quest.id) || undefined}
              />
            ))}
          </div>
          {completedPct > 0 && (
            <div
              className={styles.completedBar}
              style={{ width: `${completedPct}%` }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
