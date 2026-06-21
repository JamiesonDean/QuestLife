import { useEffect, useRef, useState } from "react";

export type PresencePhase = "enter" | "idle" | "exit";

export interface PresenceEntry<T> {
  key: string;
  item: T;
  phase: PresencePhase;
}

/**
 * Tracks list items for enter/exit animations. Items leaving the source list
 * stay mounted briefly with phase "exit" until the animation completes.
 */
export function usePresenceList<T>(
  items: T[],
  getKey: (item: T) => string,
  durationMs = 280,
): PresenceEntry<T>[] {
  const getKeyRef = useRef(getKey);
  getKeyRef.current = getKey;

  const itemsKey = items.map((item) => getKeyRef.current(item)).join("\0");
  const [entries, setEntries] = useState<PresenceEntry<T>[]>([]);
  const prevItemsKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const listChanged =
      prevItemsKeyRef.current !== null && prevItemsKeyRef.current !== itemsKey;
    prevItemsKeyRef.current = itemsKey;

    setEntries((prev) => {
      const getKey = getKeyRef.current;
      const nextMap = new Map(items.map((item) => [getKey(item), item]));
      const result: PresenceEntry<T>[] = [];

      for (const item of items) {
        const key = getKey(item);
        const existing = prev.find((entry) => entry.key === key);
        result.push({
          key,
          item,
          phase: !existing
            ? "enter"
            : existing.phase === "exit"
              ? "enter"
              : listChanged
                ? "enter"
                : "idle",
        });
      }

      for (const entry of prev) {
        if (!nextMap.has(entry.key)) {
          result.push({ ...entry, phase: "exit" });
        }
      }

      return result;
    });

    const enterTimer = window.setTimeout(() => {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.phase === "enter" ? { ...entry, phase: "idle" as const } : entry,
        ),
      );
    }, durationMs);

    const exitTimer = window.setTimeout(() => {
      setEntries((prev) => prev.filter((entry) => entry.phase !== "exit"));
    }, durationMs);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(exitTimer);
    };
  }, [itemsKey, durationMs]);

  return entries;
}
