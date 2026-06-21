import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CATEGORY_ORDER, CATEGORIES } from "../../domain/quest.ts";
import { CategoryTag } from "../quest/CategoryTag.tsx";
import { INTRO_FRAMEWORK } from "./introContent.ts";
import welcomeStyles from "./WelcomeModal.module.css";
import styles from "./HelpModal.module.css";

export interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={welcomeStyles.overlay} onClick={onClose}>
      <div
        className={`${welcomeStyles.panel} ${styles.panel}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={welcomeStyles.header}>
          <h1 id="help-title" className={`${welcomeStyles.title} ${styles.title}`}>
            QuestLife
          </h1>
          <p className={`${welcomeStyles.lede} ${styles.lede}`}>
            Welcome to the adventure of your life.
          </p>
        </header>

        <section className={welcomeStyles.framework} aria-label="How it works">
          <h2 className={`${welcomeStyles.frameworkHeading} ${styles.frameworkHeading}`}>
            How it works
          </h2>
          <dl className={`${welcomeStyles.termList} ${styles.termList}`}>
            {INTRO_FRAMEWORK.map(({ term, detail }) => (
              <div key={term} className={welcomeStyles.termRow}>
                <dt className={`${welcomeStyles.term} ${styles.term}`}>{term}</dt>
                <dd className={`${welcomeStyles.detail} ${styles.detail}`}>{detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={welcomeStyles.framework} aria-label="Quest categories">
          <dl className={styles.categoryList}>
            {CATEGORY_ORDER.map((category) => (
              <div key={category} className={styles.categoryRow}>
                <dt className={styles.categoryLabel}>
                  <CategoryTag category={category} />
                </dt>
                <dd className={styles.categoryDetail}>{CATEGORIES[category].description}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className={welcomeStyles.actions}>
          <button
            type="button"
            className={`${welcomeStyles.dismissAction} ${styles.dismissAction}`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
