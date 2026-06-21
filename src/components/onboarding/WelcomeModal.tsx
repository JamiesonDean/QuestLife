import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./WelcomeModal.module.css";

export interface WelcomeModalProps {
  open: boolean;
  onTryExample: () => void;
  onCreateCharacter: () => void;
}

const FRAMEWORK = [
  {
    term: "Quests",
    detail: "You have goals — stretch yourself and be rewarded.",
  },
  {
    term: "Disciplines",
    detail:
      "It's the daily choices that underpin your ability to do everything else. Get a heads-up view of how your daily choices are building your capacity — or holding you back.",
  },
  {
    term: "Epics",
    detail:
      "Big goals can't be contained in a single task — set yourself ambitious goals and track your progress towards them.",
  },
] as const;

/**
 * First-visit explainer — choose the demo character or start mentor intake.
 * Cannot be dismissed until the player picks a path.
 */
export function WelcomeModal({ open, onTryExample, onCreateCharacter }: WelcomeModalProps) {
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
      >
        <header className={styles.header}>
          <h1 id="welcome-title" className={styles.title}>
            QuestLife
          </h1>
          <p className={styles.lede}>Life is a series of quests. So manage it that way.</p>
        </header>

        <section className={styles.framework} aria-label="How it works">
          <h2 className={styles.frameworkHeading}>How it works</h2>
          <dl className={styles.termList}>
            {FRAMEWORK.map(({ term, detail }) => (
              <div key={term} className={styles.termRow}>
                <dt className={styles.term}>{term}</dt>
                <dd className={styles.detail}>{detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryAction} onClick={onTryExample}>
            Meet Morgan — example character
          </button>
          <button type="button" className={styles.secondaryAction} onClick={onCreateCharacter}>
            Start my quest
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
