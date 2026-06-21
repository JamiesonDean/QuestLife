import { useState } from "react";
import type { Epic } from "../../domain/epic.ts";
import type { Quest } from "../../domain/quest.ts";
import { getSessionQuote } from "../../data/quotes.ts";
import { EpicCard } from "./EpicCard.tsx";
import { NewStorylineModal } from "./NewStorylineModal.tsx";
import styles from "./EpicsPanel.module.css";

const QUOTE = getSessionQuote();

interface EpicsPanelProps {
  epics: Epic[];
  quests: Quest[];
  completedIds: Set<string>;
  assignedIds: Set<string>;
  /** Name of the currently selected Storyline filter, or null for no filter. */
  epicFilter: string | null;
  /** Toggle the named Storyline as the active filter (deselects if already active). */
  onEpicToggle: (name: string) => void;
  /** Persist a newly created Storyline and its starter quests. */
  onCreateStoryline: (storyline: Epic, quests: Quest[]) => void;
  /** Lowercase Storyline names used to prevent duplicates in the create form. */
  existingStorylineNames: Set<string>;
  existingQuestIds: Set<string>;
}

/**
 * Right-column panel shown when the "All Quests" tab is active. Displays a
 * motivational quote followed by a 2-column grid of Storyline cards.
 */
export function EpicsPanel({
  epics,
  quests,
  completedIds,
  assignedIds,
  epicFilter,
  onEpicToggle,
  onCreateStoryline,
  existingStorylineNames,
  existingQuestIds,
}: EpicsPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={styles.panel}>
      <div className={styles.quoteCard}>
        <p className={styles.quoteText}>{QUOTE.text}</p>
        <p className={styles.attribution}>{QUOTE.attribution}</p>
      </div>

      <div className={styles.epicsSection}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Storylines</h2>
          <button
            type="button"
            className={styles.newEpic}
            onClick={() => setModalOpen(true)}
          >
            + New Storyline
          </button>
        </div>
        <div className={styles.grid}>
          {epics.map((epic) => {
            const epicQuests = quests.filter((q) => q.epic === epic.name);
            return (
              <EpicCard
                key={epic.name}
                epic={epic}
                quests={epicQuests}
                completedIds={completedIds}
                assignedIds={assignedIds}
                pressed={epicFilter === epic.name}
                onClick={() => onEpicToggle(epic.name)}
              />
            );
          })}
        </div>
      </div>

      <NewStorylineModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onCreateStoryline}
        existingStorylineNames={existingStorylineNames}
        existingQuestIds={existingQuestIds}
      />
    </div>
  );
}
