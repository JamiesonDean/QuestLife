import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible label for the dialog. Shown as panel title when provided. */
  title?: string;
  children: ReactNode;
}

/**
 * Full-screen overlay with a centred panel. Renders via a portal so it sits
 * above the rest of the app regardless of DOM nesting.
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
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

  const labelId = title ? "modal-title" : undefined;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        aria-label={title ? undefined : "Dialog"}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
        ) : null}
        {children}
      </div>
    </div>,
    document.body,
  );
}
