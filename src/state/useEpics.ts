import { useEffect, useState } from "react";
import { DEFAULT_EPICS } from "@questlife/catalog";
import type { Epic } from "../domain/epic.ts";

const STORAGE_KEY = "questlife.epics.custom.v1";

function loadCustomEpics(): Epic[] {
  if (typeof localStorage === "undefined") return [];

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Epic[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useEpics() {
  const [customEpics, setCustomEpics] = useState(loadCustomEpics);
  const epics = [...DEFAULT_EPICS, ...customEpics];
  const epicNames = new Set(epics.map((e) => e.name.toLowerCase()));

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customEpics));
  }, [customEpics]);

  function addEpic(epic: Epic) {
    setCustomEpics((prev) => [...prev, epic]);
  }

  function replaceCustomEpics(next: Epic[]) {
    setCustomEpics(next);
  }

  return { epics, epicNames, addEpic, replaceCustomEpics };
}
