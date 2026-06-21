import type { Discipline } from "./discipline.ts";

export interface DisciplineListView {
  /** Collapsed or expanded full list, habits first. */
  ordered: Discipline[];
  /** Ids the player tracks as habits (visible when collapsed). */
  habitIds: string[];
}

/** Keep only ids that still exist in the catalog. */
export function resolveHabitIds(all: Discipline[], saved: string[]): string[] {
  return saved.filter((id) => all.some((d) => d.id === id));
}

export function orderDisciplines(all: Discipline[], habitIds: string[]): Discipline[] {
  const byId = new Map(all.map((d) => [d.id, d]));
  const habitSet = new Set(habitIds);
  const habits = habitIds.map((id) => byId.get(id)).filter((d): d is Discipline => d !== undefined);
  const rest = all.filter((d) => !habitSet.has(d.id));
  return [...habits, ...rest];
}

export function buildDisciplineListView(
  all: Discipline[],
  savedHabitIds: string[],
  expanded: boolean,
): DisciplineListView {
  const habitIds = resolveHabitIds(all, savedHabitIds);
  const ordered = orderDisciplines(all, habitIds);

  if (expanded) {
    return { ordered, habitIds };
  }

  const habits = habitIds
    .map((id) => all.find((d) => d.id === id))
    .filter((d): d is Discipline => d !== undefined);

  return { ordered: habits, habitIds };
}

export function addHabit(habitIds: string[], id: string, all: Discipline[]): string[] {
  if (!all.some((d) => d.id === id) || habitIds.includes(id)) return habitIds;
  return [...habitIds, id];
}

export function isHabit(habitIds: string[], id: string): boolean {
  return habitIds.includes(id);
}
