import { useState, type FormEvent } from "react";
import { createEpic, type Epic } from "../../domain/epic.ts";
import { Modal } from "../ui/Modal.tsx";
import styles from "./NewEpicModal.module.css";

export interface NewEpicModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (epic: Epic) => void;
  existingNames: Set<string>;
}

/**
 * Modal form for creating a new Epic. Name is required; description is
 * optional flavour text shown on the Epic Card.
 */
export function NewEpicModal({ open, onClose, onSubmit, existingNames }: NewEpicModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName("");
    setDescription("");
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const epic = createEpic(name, description, existingNames);
      onSubmit(epic);
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create epic.");
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="New Epic">
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            placeholder="e.g. Get Promoted"
            autoFocus
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Description</span>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="One-line flavour text for the epic card"
            rows={3}
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className={styles.submit}>
            Create Epic
          </button>
        </div>
      </form>
    </Modal>
  );
}
