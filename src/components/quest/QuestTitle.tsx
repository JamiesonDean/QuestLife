import type { ReactNode } from "react";
import styles from "./QuestTitle.module.css";

export interface QuestTitleProps {
  children: ReactNode;
}

/** Quest title — Gentium Plus Bold 24px, white. */
export function QuestTitle({ children }: QuestTitleProps) {
  return <p className={styles.title}>{children}</p>;
}
