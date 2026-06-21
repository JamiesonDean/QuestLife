import { useEffect, useState } from "react";
import { DISCIPLINES } from "@questlife/catalog";
import type { Discipline } from "../domain/discipline.ts";

const STORAGE_KEY = "questlife.disciplines.custom.v1";

function loadCustomDisciplines(): Discipline[] {
  if (typeof localStorage === "undefined") return [];

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Discipline[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useDisciplines() {
  const [customDisciplines, setCustomDisciplines] = useState(loadCustomDisciplines);
  const disciplines = [...DISCIPLINES, ...customDisciplines];
  const disciplineIds = new Set(disciplines.map((d) => d.id));

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customDisciplines));
  }, [customDisciplines]);

  function addDiscipline(discipline: Discipline) {
    setCustomDisciplines((prev) => [...prev, discipline]);
  }

  function replaceCustomDisciplines(next: Discipline[]) {
    setCustomDisciplines(next);
  }

  return { disciplines, disciplineIds, addDiscipline, replaceCustomDisciplines };
}
