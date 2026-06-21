import { useEffect, useRef, type ReactNode } from "react";
import type { PresencePhase } from "../../hooks/usePresenceList.ts";
import styles from "./AnimatedList.module.css";

export interface AnimatedListProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedList({ children, className }: AnimatedListProps) {
  return (
    <div className={[styles.list, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

export interface AnimatedListItemProps {
  phase: PresencePhase;
  /** Change when item content/state updates to replay the update animation. */
  updateSignal?: string | number;
  children: ReactNode;
}

const phaseClass: Record<PresencePhase, string | undefined> = {
  enter: styles.itemEnter,
  idle: undefined,
  exit: styles.itemExit,
};

export function AnimatedListItem({ phase, updateSignal, children }: AnimatedListItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prevSignal = useRef(updateSignal);

  useEffect(() => {
    if (updateSignal === undefined || updateSignal === prevSignal.current) return;
    prevSignal.current = updateSignal;

    const el = ref.current;
    if (!el) return;

    el.classList.remove(styles.itemUpdate);
    void el.offsetWidth;
    el.classList.add(styles.itemUpdate);

    const timer = window.setTimeout(() => {
      el.classList.remove(styles.itemUpdate);
    }, 280);

    return () => window.clearTimeout(timer);
  }, [updateSignal]);

  return (
    <div ref={ref} className={[styles.item, phaseClass[phase]].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
