import { CATEGORIES, type Category } from "../../domain/quest.ts";
import styles from "./CategoryTag.module.css";

export interface CategoryTagProps {
  category: Category;
  /**
   * When provided the tag renders as an interactive filter button (larger,
   * Gentium Plus 20px, shows quest count, has a selected-invert state).
   * Without onClick it renders as a read-only card label (16px).
   */
  onClick?: () => void;
  /** Filter selected state — inverts bg/text colours. */
  pressed?: boolean;
  /** Quest count shown next to the label in filter mode. */
  count?: number;
}

/**
 * Category label pill used in two contexts:
 *
 * - **Card** (no onClick): Gentium Plus Bold 16px, compact padding.
 * - **Filter** (with onClick): Gentium Plus Bold 20px, larger padding, quest
 *   count displayed, selected state inverts background and text to white.
 */
export function CategoryTag({ category, onClick, pressed, count }: CategoryTagProps) {
  const label = CATEGORIES[category].label;

  if (onClick) {
    return (
      <button
        type="button"
        className={`${styles.tag} ${styles.button}`}
        data-category={category}
        aria-pressed={Boolean(pressed)}
        data-empty={count === 0 || undefined}
        onClick={onClick}
      >
        <span className={styles.text}>{label}</span>
        {count !== undefined && (
          <span className={styles.count}>{count}</span>
        )}
      </button>
    );
  }

  return (
    <div className={styles.tag} data-category={category}>
      <span className={styles.text}>{label}</span>
    </div>
  );
}
