import type { Discipline, Stat, StatDelta } from "../domain/discipline.ts";
import type { Quest, QuestCompletion } from "../domain/quest.ts";
import { MAX_HP, MAX_MANA } from "../domain/player.ts";
import { INITIAL_ASSIGNED_IDS } from "@questlife/catalog";
import { TUTORIAL_STARTER_QUEST_IDS } from "../data/tutorialCharacter.ts";

function disciplineMap(disciplines: Discipline[]): Map<string, Discipline> {
  return new Map(disciplines.map((d) => [d.id, d]));
}

function questById(quests: Quest[], id: string): Quest | undefined {
  return quests.find((q) => q.id === id);
}

export type Answer = "yes" | "no";

/**
 * Persisted game state. `totalXp` is cumulative; `hp`/`mana` are the day's pool
 * (stored raw — they may exceed max or drop below zero internally and are
 * clamped only for display). Per-day discipline interactions reset each day.
 * `completions` is permanent; `assignedQuests` persists across days.
 */
export interface GameState {
  /** ISO day (YYYY-MM-DD) this state belongs to. */
  day: string;
  totalXp: number;
  hp: number;
  mana: number;
  /** Quest ids pulled into Current Quests. */
  assignedQuests: string[];
  /** Completed quests keyed by quest id. */
  completions: Record<string, QuestCompletion>;
  /** Check-discipline id → done today. */
  checks: Record<string, boolean>;
  /** Yes/no-discipline id → chosen answer. */
  answers: Record<string, Answer>;
  /** Streak-discipline id → current sequential count. */
  streaks: Record<string, number>;
}

export type GameAction =
  | { type: "assignQuest"; id: string }
  | { type: "unassignQuest"; id: string }
  | { type: "completeQuest"; id: string }
  | { type: "toggleQuest"; id: string }
  | { type: "toggleCheck"; id: string }
  | { type: "setAnswer"; id: string; answer: Answer }
  | { type: "logStreak"; id: string }
  | { type: "newDay"; day: string }
  | { type: "finishIntake"; assignedIds: string[] }
  | { type: "hydrate"; state: GameState }
  | { type: "reset" };

export function todayStr(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function freshState(day = todayStr()): GameState {
  return {
    day,
    totalXp: 0,
    hp: MAX_HP,
    mana: MAX_MANA,
    assignedQuests: [...INITIAL_ASSIGNED_IDS],
    completions: {},
    checks: {},
    answers: {},
    streaks: {},
  };
}

/** Fresh game state for the public demo character. */
export function tutorialFreshGameState(day = todayStr()): GameState {
  return {
    day,
    totalXp: 0,
    hp: MAX_HP,
    mana: MAX_MANA,
    assignedQuests: [...TUTORIAL_STARTER_QUEST_IDS],
    completions: {},
    checks: {},
    answers: {},
    streaks: {},
  };
}

/** Reset the daily pool + per-day discipline interactions for a new day. */
export function rollOver(state: GameState, day: string): GameState {
  return {
    ...state,
    day,
    hp: MAX_HP,
    mana: MAX_MANA,
    checks: {},
    answers: {},
    // Completions and assignedQuests carry across days.
    // Streak progress carries across days (sequential activations).
  };
}

function applyDelta(state: GameState, delta: StatDelta, sign: 1 | -1): GameState {
  const amount = delta.amount * sign;
  const byStat: Record<Stat, Partial<GameState>> = {
    hp: { hp: state.hp + amount },
    mana: { mana: state.mana + amount },
    xp: { totalXp: Math.max(0, state.totalXp + amount) },
  };
  return { ...state, ...byStat[delta.stat] };
}

function applyDeltas(state: GameState, deltas: StatDelta[], sign: 1 | -1): GameState {
  return deltas.reduce((acc, delta) => applyDelta(acc, delta, sign), state);
}

export function gameReducer(
  state: GameState,
  action: GameAction,
  quests: Quest[],
  disciplines: Discipline[],
): GameState {
  const disciplineById = disciplineMap(disciplines);

  switch (action.type) {
    case "assignQuest": {
      if (state.completions[action.id]) return state;
      if (state.assignedQuests.includes(action.id)) return state;
      if (!questById(quests, action.id)) return state;
      return { ...state, assignedQuests: [...state.assignedQuests, action.id] };
    }

    case "unassignQuest": {
      if (!state.assignedQuests.includes(action.id)) return state;
      return {
        ...state,
        assignedQuests: state.assignedQuests.filter((id) => id !== action.id),
      };
    }

    case "completeQuest": {
      const quest = questById(quests, action.id);
      if (!quest || state.completions[action.id]) return state;

      const assignedQuests = state.assignedQuests.includes(action.id)
        ? state.assignedQuests
        : [...state.assignedQuests, action.id];

      const now = new Date().toISOString();
      const completion: QuestCompletion = {
        questId: action.id,
        completedAt: now,
        completedOnDay: state.day,
        xpAwarded: quest.xp,
      };

      return {
        ...state,
        assignedQuests,
        completions: { ...state.completions, [action.id]: completion },
        totalXp: state.totalXp + quest.xp,
      };
    }

    case "toggleQuest": {
      const quest = questById(quests, action.id);
      if (!quest) return state;

      const existing = state.completions[action.id];
      if (existing) {
        // Archived completions (prior days) are permanent.
        if (existing.completedOnDay !== state.day) return state;
        const { [action.id]: _removed, ...rest } = state.completions;
        return {
          ...state,
          completions: rest,
          totalXp: Math.max(0, state.totalXp - existing.xpAwarded),
        };
      }

      const now = new Date().toISOString();
      const completion: QuestCompletion = {
        questId: action.id,
        completedAt: now,
        completedOnDay: state.day,
        xpAwarded: quest.xp,
      };
      return {
        ...state,
        completions: { ...state.completions, [action.id]: completion },
        totalXp: state.totalXp + quest.xp,
      };
    }

    case "toggleCheck": {
      const d = disciplineById.get(action.id);
      if (!d || d.kind !== "check") return state;
      const done = !state.checks[action.id];
      const next = applyDeltas(state, d.rewards, done ? 1 : -1);
      return { ...next, checks: { ...state.checks, [action.id]: done } };
    }

    case "setAnswer": {
      const d = disciplineById.get(action.id);
      if (!d || d.kind !== "yes-no") return state;
      const prev = state.answers[action.id];
      let next = state;
      if (prev) next = applyDelta(next, prev === "yes" ? d.yes : d.no, -1);
      const answers = { ...state.answers };
      if (prev === action.answer) {
        delete answers[action.id];
      } else {
        next = applyDelta(next, action.answer === "yes" ? d.yes : d.no, 1);
        answers[action.id] = action.answer;
      }
      return { ...next, answers };
    }

    case "logStreak": {
      const d = disciplineById.get(action.id);
      if (!d || d.kind !== "streak") return state;
      const [perDay, ...onTrigger] = d.rewards;
      let next = perDay ? applyDelta(state, perDay, 1) : state;
      let progress = (state.streaks[action.id] ?? d.progress) + 1;
      if (progress >= d.threshold) {
        next = applyDeltas(next, onTrigger, 1);
        progress = 0;
      }
      return { ...next, streaks: { ...state.streaks, [action.id]: progress } };
    }

    case "newDay":
      return rollOver(state, action.day);

    case "finishIntake":
      return { ...state, assignedQuests: action.assignedIds };

    case "hydrate":
      return action.state;

    case "reset":
      return freshState();

    default:
      return state;
  }
}
