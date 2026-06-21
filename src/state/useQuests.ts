import { useEffect, useState } from "react";
import { DEFAULT_QUESTS } from "@questlife/catalog";
import { migrateQuest, type Quest } from "../domain/quest.ts";

const STORAGE_KEY = "questlife.quests.custom.v1";

function loadCustomQuests(): Quest[] {
  if (typeof localStorage === "undefined") return [];

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(migrateQuest).filter((q): q is Quest => q !== null);
  } catch {
    return [];
  }
}

export function useQuests() {
  const [customQuests, setCustomQuests] = useState(loadCustomQuests);
  const quests = [...DEFAULT_QUESTS, ...customQuests];
  const questIds = new Set(quests.map((q) => q.id));

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customQuests));
  }, [customQuests]);

  function addQuest(quest: Quest) {
    setCustomQuests((prev) => [...prev, quest]);
  }

  function replaceCustomQuests(next: Quest[]) {
    setCustomQuests(next);
  }

  return { quests, questIds, addQuest, replaceCustomQuests };
}
