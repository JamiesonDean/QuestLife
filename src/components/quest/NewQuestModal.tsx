import { useState, type FormEvent } from "react";
import type { Epic } from "../../domain/epic.ts";
import {
  CATEGORIES,
  SCALES,
  TRACKS,
  createQuest,
  type Category,
  type Quest,
  type Scale,
  type Track,
} from "../../domain/quest.ts";
import { Modal } from "../ui/Modal.tsx";
import styles from "./NewQuestModal.module.css";

const SCALE_ORDER = Object.keys(SCALES) as Scale[];
const TRACK_ORDER = Object.keys(TRACKS) as Track[];
const CATEGORY_ORDER = Object.keys(CATEGORIES) as Category[];

const DEFAULT_XP: Record<Scale, number> = {
  minor: 10,
  major: 40,
  boss: 90,
};

export interface NewQuestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (quest: Quest) => void;
  existingIds: Set<string>;
  epics: Epic[];
  playerLevel: number;
}

export function NewQuestModal({
  open,
  onClose,
  onSubmit,
  existingIds,
  epics,
  playerLevel,
}: NewQuestModalProps) {
  const [title, setTitle] = useState("");
  const [scale, setScale] = useState<Scale>("minor");
  const [track, setTrack] = useState<Track>("main");
  const [category, setCategory] = useState<Category>("keep-management");
  const [unlockLevel, setUnlockLevel] = useState(String(playerLevel));
  const [xp, setXp] = useState(String(DEFAULT_XP.minor));
  const [epic, setEpic] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isSide = track === "side";

  function reset() {
    setTitle("");
    setScale("minor");
    setTrack("main");
    setCategory("keep-management");
    setUnlockLevel(String(playerLevel));
    setXp(String(DEFAULT_XP.minor));
    setEpic("");
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleScaleChange(nextScale: Scale) {
    setScale(nextScale);
    setXp(String(DEFAULT_XP[nextScale]));
  }

  function handleTrackChange(nextTrack: Track) {
    setTrack(nextTrack);
    if (nextTrack === "side") {
      setEpic("");
      setScale("minor");
      setXp(String(DEFAULT_XP.minor));
    }
  }

  function handleEpicChange(value: string) {
    setEpic(value);
    if (value) setTrack("main");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const quest = createQuest(
        {
          title,
          scale: isSide ? "minor" : scale,
          track,
          category,
          unlockLevel: Number(unlockLevel),
          xp: Number(xp),
          epic: isSide ? undefined : epic || undefined,
        },
        existingIds,
      );
      onSubmit(quest);
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create quest.");
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="New Quest">
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>Title</span>
          <input
            className={styles.input}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError(null);
            }}
            placeholder="What needs doing?"
            autoFocus
          />
        </label>

        <div className={styles.row}>
          {!isSide && (
            <label className={styles.field}>
              <span className={styles.label}>Scale</span>
              <select
                className={styles.select}
                value={scale}
                onChange={(e) => handleScaleChange(e.target.value as Scale)}
              >
                {SCALE_ORDER.map((key) => (
                  <option key={key} value={key}>
                    {SCALES[key].label} Quest
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className={styles.field}>
            <span className={styles.label}>Track</span>
            <select
              className={styles.select}
              value={track}
              onChange={(e) => handleTrackChange(e.target.value as Track)}
            >
              {TRACK_ORDER.map((key) => (
                <option key={key} value={key}>
                  {TRACKS[key].label} Quest
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>Category</span>
            <select
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {CATEGORY_ORDER.map((key) => (
                <option key={key} value={key}>
                  {CATEGORIES[key].label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Unlock level</span>
            <input
              className={styles.input}
              type="number"
              min={1}
              value={unlockLevel}
              onChange={(e) => setUnlockLevel(e.target.value)}
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>XP reward</span>
            <input
              className={styles.input}
              type="number"
              min={1}
              value={xp}
              onChange={(e) => setXp(e.target.value)}
            />
          </label>
        </div>

        {!isSide && (
          <label className={styles.field}>
            <span className={styles.label}>Storyline (optional)</span>
            <select
              className={styles.select}
              value={epic}
              onChange={(e) => handleEpicChange(e.target.value)}
            >
              <option value="">None</option>
              {epics.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className={styles.submit}>
            Create Quest
          </button>
        </div>
      </form>
    </Modal>
  );
}
