/**
 * Discipline domain — a separate concept from Quests. A Discipline is a
 * recurring "check off per day" habit whose completion applies deltas to the
 * player's stats (HP / Mana / XP).
 */

export type Stat = "hp" | "mana" | "xp";

export interface StatDelta {
  stat: Stat;
  /** Signed amount applied on completion (e.g. +10, -5). */
  amount: number;
}

/** Which kind of daily prompt the discipline presents. */
export type DisciplineKind = "check" | "yes-no" | "streak";

interface DisciplineBase {
  id: string;
  title: string;
}

/** "Check off per day" — a single yes-I-did-this action with stat rewards. */
export interface CheckDiscipline extends DisciplineBase {
  kind: "check";
  /** Stat changes granted when checked off for the day. */
  rewards: StatDelta[];
}

/**
 * A yes/no question (e.g. "Alcohol on a weeknight?") with a different stat
 * outcome for each answer.
 */
export interface YesNoDiscipline extends DisciplineBase {
  kind: "yes-no";
  /** Affirmative answer: label + its stat outcome. */
  yesLabel: string;
  yes: StatDelta;
  /** Negative answer: label + its stat outcome. */
  noLabel: string;
  no: StatDelta;
}

/**
 * Triggers only after a number of sequential activations (e.g. overworking 2
 * days in a row). Shows progress toward the threshold and applies its stat
 * outcomes once the streak completes.
 */
export interface StreakDiscipline extends DisciplineBase {
  kind: "streak";
  /** Sequential activations required to trigger. */
  threshold: number;
  /** Current consecutive count. */
  progress: number;
  /** Counter unit shown in the subtitle, e.g. "days". */
  unit: string;
  /** Stat outcomes applied when the streak triggers. */
  rewards: StatDelta[];
}

export type Discipline = CheckDiscipline | YesNoDiscipline | StreakDiscipline;

export interface StatMeta {
  key: Stat;
  label: string;
}

export const STATS: Record<Stat, StatMeta> = {
  hp: { key: "hp", label: "HP" },
  mana: { key: "mana", label: "Mana" },
  xp: { key: "xp", label: "XP" },
};

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqueDisciplineId(title: string, existingIds: Set<string>): string {
  const base = slugifyTitle(title) || "discipline";
  let id = base;
  let suffix = 2;
  while (existingIds.has(id)) {
    id = `${base}-${suffix++}`;
  }
  return id;
}

/** Validate and return a new check discipline with a generated id. */
export function createCheckDiscipline(
  title: string,
  rewards: StatDelta[],
  existingIds: Set<string>,
): CheckDiscipline {
  const trimmed = title.trim();
  if (!trimmed) {
    throw new Error("Discipline title is required.");
  }
  if (!rewards.length) {
    throw new Error("Discipline must have at least one reward.");
  }
  return {
    id: uniqueDisciplineId(trimmed, existingIds),
    kind: "check",
    title: trimmed,
    rewards,
  };
}
