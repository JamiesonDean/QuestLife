import { useEffect, useMemo, useState } from "react";
import { QuestCard, CategoryFilter, NewQuestModal } from "./components/quest/index.ts";
import { DisciplineCard } from "./components/discipline/index.ts";
import { EpicsPanel } from "./components/epic/index.ts";
import { CharacterHeader } from "./components/character/index.ts";
import { AppHeader } from "./components/layout/index.ts";
import { MentorIntakeModal, WelcomeModal } from "./components/onboarding/index.ts";
import { StatIcon } from "./components/stats/StatIcon.tsx";
import { AnimatedList, AnimatedListItem } from "./components/ui/AnimatedList.tsx";
import { Tabs } from "./components/ui/Tabs.tsx";
import { usePresenceList } from "./hooks/usePresenceList.ts";
import { IS_OWNER_MODE } from "./config/appMode.ts";
import {
  TUTORIAL_CHARACTER_CLASS,
  TUTORIAL_DISPLAY_NAME,
} from "./data/tutorialCharacter.ts";
import { DEFAULT_CHARACTER_CLASS } from "./domain/character.ts";
import { ownerDefaultDisplayName } from "@questlife/ownerRegistry";
import type { Category, Quest } from "./domain/quest.ts";
import { deriveQuestView, isUnassignedPool, showInCurrentTab } from "./domain/quest.ts";
import type { IntakeProfile } from "./domain/intake.ts";
import { clamp, levelFromXp, MAX_HP, MAX_MANA } from "./domain/player.ts";
import { todayStr } from "./state/game.ts";
import { useCharacters } from "./state/useCharacters.ts";
import chevronDown from "./assets/chevron-down.svg";
import styles from "./App.module.css";

type TabId = "current" | "all";

function formatNet(n: number): string {
  if (n === 0) return "-";
  return n > 0 ? `+${n}` : `${n}`;
}

function categoryCountsFor(quests: { category: Category }[]): Record<string, number> {
  return quests.reduce<Record<string, number>>((acc, q) => {
    acc[q.category] = (acc[q.category] ?? 0) + 1;
    return acc;
  }, {});
}

function sortByLevelAndXp(a: Quest, b: Quest): number {
  return a.unlockLevel - b.unlockLevel || a.xp - b.xp;
}

function questKey(quest: Quest): string {
  return quest.id;
}

function disciplineKey(discipline: { id: string }): string {
  return discipline.id;
}

export function App() {
  const {
    active,
    activeCharacterId,
    characterSummaries,
    switchCharacter,
    quests,
    questIds,
    epics,
    epicNames,
    disciplines,
    habitDisciplineIds,
    isDisciplineHabit,
    disciplineListView,
    state,
    dispatch,
    addQuest,
    addEpic,
    addDisciplineHabit,
    completeIntake,
    completeWelcome,
    startTutorialDemo,
    welcomeComplete,
  } = useCharacters();

  const [mentorOpen, setMentorOpen] = useState(false);
  const [mentorSession, setMentorSession] = useState(0);
  const [tab, setTab] = useState<TabId>("current");
  const [showAll, setShowAll] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<Set<Category>>(new Set());
  const [epicFilter, setEpicFilter] = useState<string | null>(null);
  const [questModalOpen, setQuestModalOpen] = useState(false);

  const playerName =
    active?.displayName ?? (IS_OWNER_MODE ? ownerDefaultDisplayName() : TUTORIAL_DISPLAY_NAME);
  const characterClass =
    active?.characterClass ?? (IS_OWNER_MODE ? DEFAULT_CHARACTER_CLASS : TUTORIAL_CHARACTER_CLASS);
  const boardReady = IS_OWNER_MODE || (welcomeComplete && active);

  useEffect(() => {
    setShowAll(false);
    setEpicFilter(null);
    setCategoryFilter(new Set());
    setTab("current");
  }, [active?.id]);

  function openMentorModal() {
    setMentorSession((n) => n + 1);
    setMentorOpen(true);
  }

  function handleIntakeComplete(intake: IntakeProfile) {
    completeIntake(intake);
    setMentorOpen(false);
  }

  function handleTryExample() {
    startTutorialDemo();
  }

  function handleCreateFromWelcome() {
    completeWelcome();
    openMentorModal();
  }

  const allQuestsSorted = useMemo(
    () => [...quests].sort((a, b) => a.unlockLevel - b.unlockLevel || a.xp - b.xp),
    [quests],
  );

  const level = levelFromXp(state.totalXp);
  const completedIds = useMemo(
    () => new Set(Object.keys(state.completions)),
    [state.completions],
  );
  const assignedIds = useMemo(
    () => new Set(state.assignedQuests),
    [state.assignedQuests],
  );

  const questViews = useMemo(() => {
    const map = new Map<string, ReturnType<typeof deriveQuestView>>();
    for (const quest of quests) {
      map.set(
        quest.id,
        deriveQuestView(quest, level.level, state.assignedQuests, state.completions, todayStr()),
      );
    }
    return map;
  }, [quests, level.level, state.assignedQuests, state.completions]);

  function toggleCategory(cat: Category) {
    setCategoryFilter((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function toggleEpic(name: string) {
    setEpicFilter((prev) => (prev === name ? null : name));
  }

  function handleAddQuest(quest: Quest) {
    addQuest(quest);
    dispatch({ type: "assignQuest", id: quest.id });
  }

  const epicFilteredQuests =
    epicFilter === null
      ? allQuestsSorted
      : allQuestsSorted.filter((q) => q.epic === epicFilter);

  const dynamicCategoryCounts = categoryCountsFor(epicFilteredQuests);
  const allCategoryCounts = categoryCountsFor(allQuestsSorted);

  const visibleQuests =
    tab === "current"
      ? quests.filter((q) => showInCurrentTab(questViews.get(q.id)!)).sort(sortByLevelAndXp)
      : epicFilteredQuests.filter(
          (q) => categoryFilter.size === 0 || categoryFilter.has(q.category),
        );

  const disciplineView = disciplineListView(showAll);
  const visibleDisciplines = disciplineView.ordered;
  const hiddenDisciplineCount = showAll
    ? 0
    : Math.max(0, disciplines.length - disciplineView.ordered.length);

  const questList = usePresenceList(visibleQuests, questKey);
  const disciplineList = usePresenceList(visibleDisciplines, disciplineKey);

  return (
    <div className={styles.app}>
      {!IS_OWNER_MODE && (
        <p className={styles.publicDemoBanner} role="status">
          Public demo — Morgan only. Your private quests are not in this build.
        </p>
      )}
      <AppHeader
        characters={characterSummaries}
        activeCharacterId={activeCharacterId}
        onSelectCharacter={switchCharacter}
        onNewCharacter={IS_OWNER_MODE ? undefined : openMentorModal}
      />
      {!IS_OWNER_MODE && (
        <WelcomeModal
          open={!welcomeComplete}
          onTryExample={handleTryExample}
          onCreateCharacter={handleCreateFromWelcome}
        />
      )}
      {!IS_OWNER_MODE && (
        <MentorIntakeModal
          key={mentorSession}
          open={mentorOpen}
          onClose={() => setMentorOpen(false)}
          onComplete={handleIntakeComplete}
        />
      )}
      <main className={styles.screen}>
        <div className={styles.inner}>
          {boardReady ? (
          <div className={styles.corePanel}>
          <CharacterHeader
            name={playerName}
            characterClass={characterClass}
            level={level.level}
            levelProgress={level.progress}
            hp={{ value: clamp(state.hp, 0, MAX_HP), max: MAX_HP }}
            mana={{ value: clamp(state.mana, 0, MAX_MANA), max: MAX_MANA }}
            onNewQuest={() => setQuestModalOpen(true)}
          />

          <div className={styles.columns}>
            <section className={styles.column}>
              <Tabs<TabId>
                tabs={[
                  { id: "current", label: "Current Quests" },
                  { id: "all", label: "All Quests" },
                ]}
                active={tab}
                onChange={setTab}
              />
              {tab === "all" && (
                <CategoryFilter
                  selected={categoryFilter}
                  onToggle={toggleCategory}
                  questCounts={epicFilter !== null ? dynamicCategoryCounts : allCategoryCounts}
                />
              )}
              <AnimatedList>
                {questList.map(({ key, item: quest, phase }) => {
                  const view = questViews.get(quest.id);
                  if (!view) return null;
                  const isAllTab = tab === "all";
                  const inUnassignedPool = isAllTab && isUnassignedPool(view);
                  const updateSignal = [
                    tab,
                    inUnassignedPool,
                    view.isAssigned,
                    view.isCompleted,
                    view.isCompletedToday,
                  ].join("|");

                  return (
                    <AnimatedListItem key={key} phase={phase} updateSignal={updateSignal}>
                      <QuestCard
                        title={quest.title}
                        scale={quest.scale}
                        track={quest.track}
                        category={quest.category}
                        unlockLevel={quest.unlockLevel}
                        xp={quest.xp}
                        epic={quest.epic}
                        isFuture={view.isFuture}
                        completed={view.isCompleted}
                        completedToday={view.isCompletedToday}
                        unassigned={inUnassignedPool}
                        onToggle={
                          !inUnassignedPool
                            ? () => dispatch({ type: "toggleQuest", id: quest.id })
                            : undefined
                        }
                        onAccept={
                          inUnassignedPool
                            ? () => dispatch({ type: "assignQuest", id: quest.id })
                            : undefined
                        }
                        onComplete={
                          inUnassignedPool
                            ? () => dispatch({ type: "completeQuest", id: quest.id })
                            : undefined
                        }
                      />
                    </AnimatedListItem>
                  );
                })}
              </AnimatedList>
            </section>

            <section className={styles.column}>
              {tab === "all" ? (
                <EpicsPanel
                  epics={epics}
                  quests={quests}
                  completedIds={completedIds}
                  assignedIds={assignedIds}
                  epicFilter={epicFilter}
                  onEpicToggle={toggleEpic}
                  onCreateEpic={addEpic}
                  existingEpicNames={epicNames}
                />
              ) : (
                <>
                  <div className={styles.discHeader}>
                    <h2 className={styles.discTitle}>Disciplines</h2>
                    <div className={styles.discTotals}>
                      <span className={styles.total}>
                        <span className={styles.totalVal}>{formatNet(state.hp - MAX_HP)}</span>
                        <StatIcon stat="hp" size={30} />
                      </span>
                      <span className={styles.total}>
                        <span className={styles.totalVal}>{formatNet(state.mana - MAX_MANA)}</span>
                        <StatIcon stat="mana" size={30} />
                      </span>
                    </div>
                  </div>
                  <AnimatedList>
                    {disciplineList.map(({ key, item: discipline, phase }) => {
                      const done = state.checks[discipline.id];
                      const answer = state.answers[discipline.id];
                      const progress = state.streaks[discipline.id];
                      const updateSignal = [done, answer, progress, showAll, isDisciplineHabit(discipline.id)].join("|");
                      const habit = isDisciplineHabit(discipline.id);

                      return (
                        <AnimatedListItem key={key} phase={phase} updateSignal={updateSignal}>
                          <DisciplineCard
                            discipline={discipline}
                            done={done}
                            answer={answer}
                            progress={progress}
                            isHabit={habit}
                            showHabitControl={showAll}
                            onAddHabit={
                              showAll && !habit
                                ? () => addDisciplineHabit(discipline.id)
                                : undefined
                            }
                            onToggleCheck={() =>
                              dispatch({ type: "toggleCheck", id: discipline.id })
                            }
                            onAnswer={(value) =>
                              dispatch({ type: "setAnswer", id: discipline.id, answer: value })
                            }
                            onLogStreak={() =>
                              dispatch({ type: "logStreak", id: discipline.id })
                            }
                          />
                        </AnimatedListItem>
                      );
                    })}
                  </AnimatedList>
                  {disciplines.length > habitDisciplineIds.length || showAll ? (
                  <button
                    type="button"
                    className={styles.seeAll}
                    onClick={() => setShowAll((value) => !value)}
                  >
                    <span>
                      {showAll
                        ? "Show fewer Disciplines"
                        : hiddenDisciplineCount > 0
                          ? `See ${hiddenDisciplineCount} more Discipline${hiddenDisciplineCount === 1 ? "" : "s"}`
                          : "See all Disciplines"}
                    </span>
                    <img
                      className={[styles.chevron, showAll ? styles.chevronUp : ""].filter(Boolean).join(" ")}
                      src={chevronDown}
                    alt=""
                  />
                </button>
                  ) : null}
                </>
              )}
            </section>
          </div>
          </div>
          ) : null}
        </div>

        {boardReady ? (
        <NewQuestModal
          open={questModalOpen}
          onClose={() => setQuestModalOpen(false)}
          onSubmit={handleAddQuest}
          existingIds={questIds}
          epics={epics}
          playerLevel={level.level}
        />
        ) : null}
      </main>
    </div>
  );
}
