import type { Epic } from "../../domain/epic.ts";
import type { Quest, Scale } from "../../domain/quest.ts";
import { EpicIconTile } from "./EpicIconTile.tsx";
import styles from "./StorylineConfirmation.module.css";

export interface StorylineConfirmationProps {
  storyline: Epic;
  quests: Quest[];
  onStart: () => void;
}

const SCALE_SECTIONS: { scale: Scale; label: string; barClass: string }[] = [
  { scale: "minor", label: "Minor quests", barClass: styles.barMinor },
  { scale: "major", label: "Major quests", barClass: styles.barMajor },
  { scale: "boss", label: "Boss quests", barClass: styles.barBoss },
];

function sortQuests(a: Quest, b: Quest): number {
  return a.unlockLevel - b.unlockLevel || a.xp - b.xp;
}

function QuestScaleGroup({ scale, label, barClass, quests }: {
  scale: Scale;
  label: string;
  barClass: string;
  quests: Quest[];
}) {
  const items = quests.filter((q) => q.scale === scale).sort(sortQuests);
  if (items.length === 0) return null;

  return (
    <section className={styles.questGroup}>
      <h3 className={styles.groupLabel}>{label}</h3>
      <div className={styles.groupRow}>
        <div className={barClass} aria-hidden />
        <ul className={styles.questList}>
          {items.map((quest) => (
            <li key={quest.id}>{quest.title}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Preview a newly created Storyline and its quests before the player commits. */
export function StorylineConfirmation({ storyline, quests, onStart }: StorylineConfirmationProps) {
  return (
    <article className={styles.card}>
      <EpicIconTile name={storyline.name} />

      <h2 className={styles.name}>{storyline.name}</h2>
      {storyline.description ? (
        <p className={styles.description}>{storyline.description}</p>
      ) : null}

      <div className={styles.questGroups}>
        {SCALE_SECTIONS.map(({ scale, label, barClass }) => (
          <QuestScaleGroup
            key={scale}
            scale={scale}
            label={label}
            barClass={barClass}
            quests={quests}
          />
        ))}
      </div>

      <button type="button" className={styles.start} onClick={onStart}>
        Start Storyline
      </button>
    </article>
  );
}
