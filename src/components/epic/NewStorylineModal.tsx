import { useEffect, useState, type FormEvent } from "react";
import { createEpic, type Epic } from "../../domain/epic.ts";
import { createQuestsForStoryline } from "../../domain/storylineQuests.ts";
import type { Quest } from "../../domain/quest.ts";
import { Modal } from "../ui/Modal.tsx";
import { StorylineConfirmation } from "./StorylineConfirmation.tsx";
import styles from "./NewStorylineModal.module.css";

export interface NewStorylineModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (storyline: Epic, quests: Quest[]) => void;
  existingStorylineNames: Set<string>;
  existingQuestIds: Set<string>;
}

type Step = "form" | "confirm";

interface PendingStoryline {
  storyline: Epic;
  quests: Quest[];
}

/**
 * Create a Storyline with quests — form entry, then confirmation before saving.
 */
export function NewStorylineModal({
  open,
  onClose,
  onSubmit,
  existingStorylineNames,
  existingQuestIds,
}: NewStorylineModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [pending, setPending] = useState<PendingStoryline | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  function reset() {
    setStep("form");
    setPending(null);
    setName("");
    setDescription("");
    setTasks("");
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const storyline = createEpic(name, description, existingStorylineNames);
      const quests = createQuestsForStoryline(tasks, storyline.name, existingQuestIds, {
        storylineDescription: description,
      });
      if (quests.length === 0) {
        throw new Error("List at least one task or activity for this Storyline.");
      }
      setPending({ storyline, quests });
      setStep("confirm");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create Storyline.");
    }
  }

  function handleStart() {
    if (!pending) return;
    onSubmit(pending.storyline, pending.quests);
    reset();
    onClose();
  }

  if (!open) return null;

  if (step === "confirm" && pending) {
    return (
      <Modal open onClose={handleClose}>
        <div className={styles.confirmWrap}>
          <StorylineConfirmation
            storyline={pending.storyline}
            quests={pending.quests}
            onStart={handleStart}
          />
        </div>
      </Modal>
    );
  }

  return (
    <Modal open onClose={handleClose} title="New Storyline">
      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>What is your goal?</h3>
          <p className={styles.hint}>The title for your Storyline</p>
          <input
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            autoFocus
          />
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>What does this mean to you?</h3>
          <p className={styles.hint}>Short description</p>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>How do you get there?</h3>
          <p className={styles.hint}>
            Tasks and activities to reach your goal — just list them out
          </p>
          <textarea
            className={styles.textareaLarge}
            value={tasks}
            onChange={(e) => {
              setTasks(e.target.value);
              setError(null);
            }}
            rows={5}
          />
        </section>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.submit}>
          Create Storyline
        </button>
      </form>
    </Modal>
  );
}
