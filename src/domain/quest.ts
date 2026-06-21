/**
 * Core QuestLife domain types and presentation metadata.
 *
 * A Quest is defined by:
 * - scale        — size / reward weight: minor / major / boss
 * - track        — importance: main (critical path) or side (optional)
 * - category     — one of the six life domains
 * - unlockLevel  — player level at which the quest unlocks (soft gate)
 * - epic         — optional campaign the quest belongs to
 * - xp           — reward granted on completion
 *
 * Lifecycle (future / unassigned / assigned / completed) is derived from
 * game state — never stored on the quest definition.
 */

export type Scale = "minor" | "major" | "boss";
export type Track = "main" | "side";

export type Category =
  | "keep-management"
  | "vitality"
  | "crafting"
  | "design-guild"
  | "alliances"
  | "lore";

/** Derived lifecycle — not persisted on Quest. */
export type QuestLifecycle = "future" | "unassigned" | "assigned" | "completed";

export interface Quest {
  id: string;
  title: string;
  scale: Scale;
  track: Track;
  category: Category;
  /** Player level at which the quest unlocks (soft gate — can still assign/complete). */
  unlockLevel: number;
  xp: number;
  epic?: string;
}

export interface QuestCompletion {
  questId: string;
  completedAt: string;
  /** YYYY-MM-DD — the day bucket for success cards vs archive. */
  completedOnDay: string;
  xpAwarded: number;
}

export interface QuestView {
  lifecycle: QuestLifecycle;
  isCompleted: boolean;
  isCompletedToday: boolean;
  isAssigned: boolean;
  isFuture: boolean;
  completion?: QuestCompletion;
}

export interface ScaleMeta {
  key: Scale;
  label: string;
}

export const SCALES: Record<Scale, ScaleMeta> = {
  minor: { key: "minor", label: "Minor" },
  major: { key: "major", label: "Major" },
  boss: { key: "boss", label: "Boss" },
};

export interface TrackMeta {
  key: Track;
  label: string;
}

export const TRACKS: Record<Track, TrackMeta> = {
  main: { key: "main", label: "Main" },
  side: { key: "side", label: "Side" },
};

export interface CategoryMeta {
  key: Category;
  label: string;
}

export const CATEGORIES: Record<Category, CategoryMeta> = {
  "keep-management": { key: "keep-management", label: "Keep Management" },
  vitality: { key: "vitality", label: "Vitality" },
  crafting: { key: "crafting", label: "Crafting" },
  "design-guild": { key: "design-guild", label: "Design Guild" },
  alliances: { key: "alliances", label: "Alliances" },
  lore: { key: "lore", label: "Lore" },
};

export interface NewQuestInput {
  title: string;
  scale: Scale;
  track: Track;
  category: Category;
  unlockLevel: number;
  xp: number;
  epic?: string;
}

/** Derive lifecycle and display flags for a quest given player + game state. */
export function deriveQuestView(
  quest: Quest,
  playerLevel: number,
  assignedQuests: string[],
  completions: Record<string, QuestCompletion>,
  today: string,
): QuestView {
  const completion = completions[quest.id];
  const isCompleted = Boolean(completion);
  const isCompletedToday = isCompleted && completion!.completedOnDay === today;
  const isAssigned = assignedQuests.includes(quest.id);
  const isFuture = !isCompleted && quest.unlockLevel > playerLevel;

  let lifecycle: QuestLifecycle;
  if (isCompleted) lifecycle = "completed";
  else if (isAssigned) lifecycle = "assigned";
  else if (isFuture) lifecycle = "future";
  else lifecycle = "unassigned";

  return { lifecycle, isCompleted, isCompletedToday, isAssigned, isFuture, completion };
}

/** Quest is in the All Quests pool — not yet accepted or completed. */
export function isUnassignedPool(view: QuestView): boolean {
  return !view.isAssigned && !view.isCompleted;
}

/** Whether a quest belongs on the Current Quests tab. */
export function showInCurrentTab(view: QuestView): boolean {
  if (view.isCompletedToday) return true;
  if (view.isAssigned && !view.isCompleted) return true;
  return false;
}

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqueQuestId(title: string, existingIds: Set<string>): string {
  const base = slugifyTitle(title) || "quest";
  let id = base;
  let suffix = 2;
  while (existingIds.has(id)) {
    id = `${base}-${suffix++}`;
  }
  return id;
}

/** Validate input and return a new Quest with a generated id. */
export function createQuest(input: NewQuestInput, existingIds: Set<string>): Quest {
  const title = input.title.trim();
  if (!title) {
    throw new Error("Quest title is required.");
  }

  const unlockLevel = Number(input.unlockLevel);
  if (!Number.isFinite(unlockLevel) || unlockLevel < 1) {
    throw new Error("Unlock level must be at least 1.");
  }

  const xp = Number(input.xp);
  if (!Number.isFinite(xp) || xp < 1) {
    throw new Error("XP reward must be at least 1.");
  }

  const epic = input.epic?.trim();
  if (input.track === "side" && epic) {
    throw new Error("Side quests cannot belong to an epic.");
  }

  return {
    id: uniqueQuestId(title, existingIds),
    title,
    scale: input.scale,
    track: input.track,
    category: input.category,
    unlockLevel: Math.round(unlockLevel),
    xp: Math.round(xp),
    epic: input.track === "side" ? undefined : epic || undefined,
  };
}

/** Migrate a quest saved under the old tier/status schema. */
export function migrateQuest(raw: unknown): Quest | null {
  if (!raw || typeof raw !== "object") return null;
  const q = raw as Record<string, unknown>;
  if (typeof q.id !== "string" || typeof q.title !== "string") return null;

  const scale = (q.scale ?? q.tier) as Scale;
  const track = (q.track as Track | undefined) ?? "main";
  const category = q.category as Category;
  const unlockLevel = Number(q.unlockLevel);
  const xp = Number(q.xp);

  if (!SCALES[scale] || !TRACKS[track] || !CATEGORIES[category]) return null;
  if (!Number.isFinite(unlockLevel) || !Number.isFinite(xp)) return null;

  const epic = track === "side" ? undefined : typeof q.epic === "string" ? q.epic : undefined;

  return {
    id: q.id,
    title: q.title,
    scale,
    track,
    category,
    unlockLevel,
    xp,
    epic,
  };
}
