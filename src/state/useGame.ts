import { useEffect, useReducer } from "react";
import type { Discipline } from "../domain/discipline.ts";
import type { Quest, QuestCompletion } from "../domain/quest.ts";
import { DEFAULT_QUESTS, INITIAL_ASSIGNED_IDS } from "@questlife/catalog";
import {
  freshState,
  gameReducer,
  rollOver,
  todayStr,
  type GameState,
} from "./game.ts";

const STORAGE_KEY = "questlife.state.v2";
const LEGACY_STORAGE_KEY = "questlife.state.v1";

interface LegacyGameState {
  day?: string;
  totalXp?: number;
  hp?: number;
  mana?: number;
  completedQuests?: string[];
  checks?: GameState["checks"];
  answers?: GameState["answers"];
  streaks?: GameState["streaks"];
}

function questXpById(id: string): number {
  return DEFAULT_QUESTS.find((q) => q.id === id)?.xp ?? 0;
}

function migrateLegacyState(saved: LegacyGameState, today: string): GameState {
  const day = saved.day ?? today;
  const completions: Record<string, QuestCompletion> = {};

  for (const id of saved.completedQuests ?? []) {
    completions[id] = {
      questId: id,
      completedAt: new Date().toISOString(),
      completedOnDay: day,
      xpAwarded: questXpById(id),
    };
  }

  return {
    day,
    totalXp: saved.totalXp ?? 0,
    hp: saved.hp ?? freshState(day).hp,
    mana: saved.mana ?? freshState(day).mana,
    assignedQuests: [...INITIAL_ASSIGNED_IDS],
    completions,
    checks: saved.checks ?? {},
    answers: saved.answers ?? {},
    streaks: saved.streaks ?? {},
  };
}

function normalizeState(raw: unknown, today: string): GameState {
  if (!raw || typeof raw !== "object") return freshState(today);

  const saved = raw as Partial<GameState & LegacyGameState>;

  if (Array.isArray(saved.assignedQuests) && saved.completions && typeof saved.completions === "object") {
    return saved as GameState;
  }

  if (Array.isArray(saved.completedQuests)) {
    return migrateLegacyState(saved, today);
  }

  return freshState(today);
}

function loadState(): GameState {
  const today = todayStr();
  if (typeof localStorage === "undefined") return freshState(today);

  const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) return freshState(today);

  try {
    const saved = normalizeState(JSON.parse(raw), today);
    return saved.day === today ? saved : rollOver(saved, today);
  } catch {
    return freshState(today);
  }
}

export function useGame(quests: Quest[], disciplines: Discipline[]) {
  const [state, dispatch] = useReducer(
    (state: GameState, action: Parameters<typeof gameReducer>[1]) =>
      gameReducer(state, action, quests, disciplines),
    undefined,
    loadState,
  );

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return { state, dispatch };
}
