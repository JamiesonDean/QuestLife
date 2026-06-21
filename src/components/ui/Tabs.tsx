import styles from "./Tabs.module.css";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
}

export interface TabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
}

/**
 * Underlined tab bar. The active tab gets a subtle fill and a white underline
 * over the divider rule. Generic over the tab id type so callers keep a
 * narrow union (e.g. "current" | "all").
 */
export function Tabs<T extends string = string>({ tabs, active, onChange }: TabsProps<T>) {
  return (
    <div className={styles.bar} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={[styles.tab, isActive ? styles.active : ""].filter(Boolean).join(" ")}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
