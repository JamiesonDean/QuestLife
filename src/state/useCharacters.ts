import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { DEFAULT_EPICS, DEFAULT_QUESTS, DISCIPLINES } from "@questlife/catalog";
import { ownerCharacterSortPrefix } from "@questlife/ownerRegistry";
import type { Discipline } from "../domain/discipline.ts";
import type { Epic } from "../domain/epic.ts";
import {
  addHabit,
  buildDisciplineListView,
  isHabit,
  resolveHabitIds,
} from "../domain/disciplineHabits.ts";
import { buildStarterPack, type IntakeProfile } from "../domain/intake.ts";
import type { Quest } from "../domain/quest.ts";
import {
  activateTutorialDemo,
  createCharacterFromIntake,
  disciplinesForCharacter,
  epicsForCharacter,
  loadCharacterRegistry,
  markWelcomeComplete,
  patchActiveCharacter,
  questsForCharacter,
  saveCharacterRegistry,
  switchActiveCharacter,
  type CharacterRuntime,
  type StoredCharacterRegistry,
} from "./characterStorage.ts";
import { TUTORIAL_CHARACTER_ID } from "../data/tutorialCharacter.ts";
import { freshState, gameReducer, rollOver, todayStr, type GameAction, type GameState } from "./game.ts";

type GameReducerAction = GameAction | { type: "hydrate"; state: GameState };

function normalizeHydratedState(state: GameState): GameState {
  const today = todayStr();
  return state.day === today ? state : rollOver(state, today);
}

function gameStateForRegistry(registry: StoredCharacterRegistry): GameState {
  const activeId = registry.activeCharacterId;
  const active = activeId ? registry.characters[activeId] : undefined;
  if (active?.gameState) return normalizeHydratedState(active.gameState);
  return freshState();
}

const DEFAULT_QUEST_IDS = new Set(DEFAULT_QUESTS.map((q) => q.id));
const DEFAULT_EPIC_NAMES = new Set(DEFAULT_EPICS.map((e) => e.name.toLowerCase()));
const DEFAULT_DISCIPLINE_IDS = new Set(DISCIPLINES.map((d) => d.id));

export interface CharacterSummary {
  id: string;
  displayName: string;
  isDemo: boolean;
}

function characterSortKey(id: string, displayName: string): string {
  if (id === TUTORIAL_CHARACTER_ID) return "0";
  const ownerPrefix = ownerCharacterSortPrefix(id);
  if (ownerPrefix) return ownerPrefix;
  return `2-${displayName.toLowerCase()}`;
}

function summariesForRegistry(characters: StoredCharacterRegistry["characters"]): CharacterSummary[] {
  return Object.values(characters)
    .map((character) => ({
      id: character.id,
      displayName: character.displayName,
      isDemo: character.id === TUTORIAL_CHARACTER_ID,
    }))
    .sort((a, b) =>
      characterSortKey(a.id, a.displayName).localeCompare(characterSortKey(b.id, b.displayName)),
    );
}

export function useCharacters() {
  const [registry, setRegistry] = useState(loadCharacterRegistry);
  const activeId = registry.activeCharacterId;
  const active = activeId ? registry.characters[activeId] : undefined;

  const quests = useMemo(() => questsForCharacter(active), [active]);
  const epics = useMemo(() => epicsForCharacter(active), [active]);
  const disciplines = useMemo(() => disciplinesForCharacter(active), [active]);
  const habitDisciplineIds = useMemo(
    () => resolveHabitIds(disciplines, active?.habitDisciplineIds ?? []),
    [disciplines, active?.habitDisciplineIds],
  );
  const questIds = useMemo(() => new Set(quests.map((q) => q.id)), [quests]);
  const epicNames = useMemo(
    () => new Set(epics.map((e) => e.name.toLowerCase())),
    [epics],
  );

  const [gameState, dispatchRaw] = useReducer(
    (state: GameState, action: GameReducerAction) => {
      if (action.type === "hydrate") return normalizeHydratedState(action.state);
      return gameReducer(state, action, quests, disciplines);
    },
    registry,
    gameStateForRegistry,
  );

  const persistGameStateRef = useRef(true);
  const charactersRef = useRef(registry.characters);
  charactersRef.current = registry.characters;

  useEffect(() => {
    saveCharacterRegistry(registry);
  }, [registry]);

  useEffect(() => {
    if (!activeId) return;
    const character = charactersRef.current[activeId];
    if (!character) return;
    persistGameStateRef.current = false;
    dispatchRaw({ type: "hydrate", state: character.gameState });
  }, [activeId]);

  useEffect(() => {
    if (!activeId) return;
    if (!persistGameStateRef.current) {
      persistGameStateRef.current = true;
      return;
    }
    setRegistry((prev) => patchActiveCharacter(prev, { gameState }));
  }, [gameState, activeId]);

  const patchActive = useCallback((patch: Partial<CharacterRuntime>) => {
    setRegistry((prev) => patchActiveCharacter(prev, patch));
  }, []);

  const dispatch = useCallback(
    (action: GameAction) => {
      dispatchRaw(action);
    },
    [],
  );

  const addDisciplineHabit = useCallback(
    (id: string) => {
      if (!active) return;
      patchActive({
        habitDisciplineIds: addHabit(active.habitDisciplineIds ?? [], id, disciplines),
      });
    },
    [active, disciplines, patchActive],
  );

  const addQuest = useCallback(
    (quest: Quest) => {
      if (!active) return;
      patchActive({ customQuests: [...active.customQuests, quest] });
    },
    [active, patchActive],
  );

  const addEpic = useCallback(
    (epic: Epic) => {
      if (!active) return;
      patchActive({ customEpics: [...active.customEpics, epic] });
    },
    [active, patchActive],
  );

  const addDiscipline = useCallback(
    (discipline: Discipline) => {
      if (!active) return;
      patchActive({
        customDisciplines: [...active.customDisciplines, discipline],
        habitDisciplineIds: addHabit(active.habitDisciplineIds ?? [], discipline.id, [
          ...disciplines,
          discipline,
        ]),
      });
    },
    [active, disciplines, patchActive],
  );

  const completeIntake = useCallback((intake: IntakeProfile) => {
    setRegistry((prev) => {
      const pack = buildStarterPack(
        intake,
        DEFAULT_QUEST_IDS,
        DEFAULT_EPIC_NAMES,
        DEFAULT_DISCIPLINE_IDS,
      );
      return markWelcomeComplete(createCharacterFromIntake(prev, intake, pack));
    });
  }, []);

  const completeWelcome = useCallback(() => {
    setRegistry((prev) => markWelcomeComplete(prev));
  }, []);

  const startTutorialDemo = useCallback(() => {
    setRegistry((prev) => activateTutorialDemo(markWelcomeComplete(prev)));
  }, []);

  const disciplineListView = useCallback(
    (expanded: boolean) =>
      buildDisciplineListView(disciplines, active?.habitDisciplineIds ?? [], expanded),
    [disciplines, active?.habitDisciplineIds],
  );

  const characterSummaries = useMemo(
    () => summariesForRegistry(registry.characters),
    [registry.characters],
  );

  const switchCharacter = useCallback((characterId: string) => {
    const character = charactersRef.current[characterId];
    if (!character) return;
    persistGameStateRef.current = false;
    dispatchRaw({ type: "hydrate", state: character.gameState });
    setRegistry((prev) => switchActiveCharacter(prev, characterId));
  }, []);

  return {
    active,
    activeCharacterId: activeId,
    characterSummaries,
    welcomeComplete: registry.welcomeComplete ?? false,
    switchCharacter,
    completeWelcome,
    startTutorialDemo,
    quests,
    questIds,
    epics,
    epicNames,
    disciplines,
    habitDisciplineIds,
    isDisciplineHabit: (id: string) => isHabit(habitDisciplineIds, id),
    disciplineListView,
    state: gameState,
    dispatch,
    addQuest,
    addEpic,
    addDiscipline,
    addDisciplineHabit,
    completeIntake,
  };
}
