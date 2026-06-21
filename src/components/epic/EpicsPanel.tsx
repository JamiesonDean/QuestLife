import { useState } from "react";
import type { Epic } from "../../domain/epic.ts";
import type { Quest } from "../../domain/quest.ts";
import { getSessionQuote } from "../../data/quotes.ts";
import { EpicCard } from "./EpicCard.tsx";
import { NewEpicModal } from "./NewEpicModal.tsx";
import styles from "./EpicsPanel.module.css";

const QUOTE = getSessionQuote();

interface EpicsPanelProps {
  epics: Epic[];
  quests: Quest[];
  completedIds: Set<string>;
  assignedIds: Set<string>;
  /** Name of the currently selected epic filter, or null for no filter. */
  epicFilter: string | null;
  /** Toggle the named epic as the active filter (deselects if already active). */
  onEpicToggle: (name: string) => void;
  /** Persist a newly created epic. */
  onCreateEpic: (epic: Epic) => void;
  /** Lowercase epic names used to prevent duplicates in the create form. */
  existingEpicNames: Set<string>;
}

/**
 * Right-column panel shown when the "All Quests" tab is active. Displays a
 * motivational quote followed by a 2-column grid of Epic Cards.
 *
 * Each Epic Card is a filter button: clicking selects/deselects that epic,
 * which narrows the quest list in the left column.
 */
export function EpicsPanel({
  epics,
  quests,
  completedIds,
  assignedIds,
  epicFilter,
  onEpicToggle,
  onCreateEpic,
  existingEpicNames,
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
          <h2 className={styles.heading}>Epics</h2>
          <button
            type="button"
            className={styles.newEpic}
            onClick={() => setModalOpen(true)}
          >
            + New Epic
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

      <NewEpicModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onCreateEpic}
        existingNames={existingEpicNames}
      />
    </div>
  );
}
