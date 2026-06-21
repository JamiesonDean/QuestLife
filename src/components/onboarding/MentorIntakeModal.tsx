import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { IntakeProfile } from "../../domain/intake.ts";
import { MentorConversation } from "./MentorConversation.tsx";
import styles from "./MentorIntakeModal.module.css";

export interface MentorIntakeModalProps {
  open: boolean;
  /** When omitted, the modal cannot be dismissed until intake completes. */
  onClose?: () => void;
  onComplete: (intake: IntakeProfile) => void;
}

export function MentorIntakeModal({ open, onClose, onComplete }: MentorIntakeModalProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && onClose) onClose();
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

  function handleOverlayClick() {
    if (onClose) onClose();
  }

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Character intake"
        onClick={(e) => e.stopPropagation()}
      >
        <MentorConversation onComplete={onComplete} />
      </div>
    </div>,
    document.body,
  );
}
