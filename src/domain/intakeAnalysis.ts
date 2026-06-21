import type { Difficulty } from "./difficulty.ts";
import type { IntakeProfile, IntakeRatedItem } from "./intake.ts";
import { inferDifficulty, parseItemsFromProse } from "./intakeParse.ts";

const EPIC_SIGNALS =
  /\b(career|life|long.?term|year|years|business|promotion|journey|vision|become|build a|launch|transform|security|community|health journey)\b/i;

function shorten(text: string, max = 52): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  const cut = trimmed.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 20 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

function dedupeKey(title: string): string {
  return title.toLowerCase().replace(/\s+/g, " ").trim();
}

/** Turn free-text intake answers into a starter set of epics, quests, and disciplines. */
export function analyzeIntake(input: {
  northStar: string;
  blockers: string;
  dailyHabits: string;
}): Pick<IntakeProfile, "epics" | "quests" | "disciplines"> {
  const epics: IntakeRatedItem[] = [];
  const quests: IntakeRatedItem[] = [];
  const disciplines: IntakeRatedItem[] = [];
  const seenEpics = new Set<string>();
  const seenQuests = new Set<string>();
  const seenDisciplines = new Set<string>();

  function addEpic(title: string, difficulty: Difficulty = "heavy") {
    const clean = shorten(title, 56);
    const key = dedupeKey(clean);
    if (!clean || seenEpics.has(key)) return;
    seenEpics.add(key);
    epics.push({ title: clean, difficulty });
  }

  function addQuest(title: string, difficulty: Difficulty = "moderate") {
    const clean = shorten(title, 72);
    const key = dedupeKey(clean);
    if (!clean || seenQuests.has(key)) return;
    seenQuests.add(key);
    quests.push({ title: clean, difficulty });
  }

  function addDiscipline(title: string, difficulty: Difficulty = "light") {
    const clean = shorten(title, 48);
    const key = dedupeKey(clean);
    if (!clean || seenDisciplines.has(key)) return;
    seenDisciplines.add(key);
    disciplines.push({ title: clean, difficulty });
  }

  const goalItems = parseItemsFromProse(input.northStar);
  if (goalItems.length === 0 && input.northStar.trim()) {
    goalItems.push({
      title: input.northStar.trim(),
      difficulty: inferDifficulty(input.northStar),
    });
  }

  for (const item of goalItems) {
    const epicCandidate =
      item.difficulty === "legendary" ||
      item.difficulty === "heavy" ||
      EPIC_SIGNALS.test(item.title) ||
      item.title.length > 55;

    if (epicCandidate) {
      addEpic(item.title, item.difficulty === "light" ? "heavy" : item.difficulty);
    } else {
      addQuest(item.title, item.difficulty);
    }
  }

  if (epics.length === 0 && goalItems.length > 0) {
    addEpic(goalItems[0]!.title, "heavy");
  }

  if (quests.length === 0 && input.northStar.trim()) {
    addQuest("Define three concrete milestones toward your goal", "light");
    addQuest("Complete the first small step on your goal this week", "moderate");
  }

  if (input.blockers.trim()) {
    const blockerItems = parseItemsFromProse(input.blockers);
    if (blockerItems.length === 0) {
      addQuest(`Clear one blocker: ${shorten(input.blockers, 44)}`, "moderate");
    } else {
      for (const blocker of blockerItems.slice(0, 2)) {
        addQuest(`Address: ${shorten(blocker.title, 44)}`, blocker.difficulty === "light" ? "moderate" : blocker.difficulty);
      }
    }
  }

  const habitItems = parseItemsFromProse(input.dailyHabits);
  if (habitItems.length === 0 && input.dailyHabits.trim()) {
    addDiscipline(input.dailyHabits.trim(), inferDifficulty(input.dailyHabits));
  } else {
    for (const habit of habitItems) {
      const difficulty =
        habit.difficulty === "legendary" ? "heavy" : habit.difficulty === "heavy" ? "moderate" : habit.difficulty;
      addDiscipline(habit.title, difficulty);
    }
  }

  if (disciplines.length === 0) {
    addDiscipline("Daily check-in on your quest board", "light");
  }

  return {
    epics: epics.slice(0, 4),
    quests: quests.slice(0, 8),
    disciplines: disciplines.slice(0, 5),
  };
}
