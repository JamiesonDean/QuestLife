import { CATEGORIES, type Category } from "../../domain/quest.ts";
import { CategoryTag } from "./CategoryTag.tsx";
import styles from "./CategoryFilter.module.css";

export interface CategoryFilterProps {
  /** Set of currently active category filters (empty = show all). */
  selected: Set<Category>;
  /** Toggle a category in/out of the active filter set. */
  onToggle: (category: Category) => void;
  /** Quest count per category to display on each tag. */
  questCounts: Record<string, number>;
}

const ORDER = Object.keys(CATEGORIES) as Category[];

/**
 * "Categories" filter row for the All Quests view.
 *
 * Supports multi-select: clicking a tag toggles it in/out; clicking a selected
 * tag again deselects it. Unselected tags stay at full opacity — no dimming.
 */
export function CategoryFilter({ selected, onToggle, questCounts }: CategoryFilterProps) {
  return (
    <div className={styles.wrap}>
      <p className={styles.heading}>Categories</p>
      <div className={styles.row}>
        {ORDER.map((category) => (
          <CategoryTag
            key={category}
            category={category}
            pressed={selected.has(category)}
            count={questCounts[category] ?? 0}
            onClick={() => onToggle(category)}
          />
        ))}
      </div>
    </div>
  );
}
