import { createEpic, type Epic } from "./epic.ts";
import {
  disciplineRewardsForDifficulty,
  epicIntensityNote,
  questProfileForDifficulty,
  type Difficulty,
} from "./difficulty.ts";
import { createCheckDiscipline, type CheckDiscipline } from "./discipline.ts";
import { createQuest, type Category, type Quest } from "./quest.ts";

export type { Difficulty };

/** A named item the player rated for difficulty during intake. */
export interface IntakeRatedItem {
  title: string;
  difficulty: Difficulty;
}

/** Raw answers collected during mentor conversation. */
export interface IntakeProfile {
  playerName: string;
  /** Six-month / next-level horizon. */
  northStar: string;
  /** Optional campaigns → Epics. */
  epics: IntakeRatedItem[];
  /** Quest commissions at any scale — player sets difficulty per item. */
  quests: IntakeRatedItem[];
  blockers: string;
  resistance: string;
  /** Daily rituals → check disciplines. */
  disciplines: IntakeRatedItem[];
}

export interface StarterPack {
  epics: Epic[];
  quests: Quest[];
  disciplines: CheckDiscipline[];
  /** Quest ids to assign on Current Quests tab (max 3 minor). */
  assignedQuestIds: string[];
}

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  "keep-management": ["tax", "finance", "rent", "admin", "house", "budget", "gst", "money"],
  vitality: ["health", "dentist", "exercise", "sleep", "doctor", "teeth", "gym", "walk"],
  crafting: ["make", "build", "write", "photo", "cook", "create", "zine", "art"],
  "design-guild": ["career", "work", "leadership", "design", "job", "professional", "promotion"],
  alliances: ["relationship", "dating", "friend", "partner", "network", "family"],
  lore: ["research", "read", "study", "learn", "essay", "argument", "think"],
};

/** Rough keyword sort for onboarding — player can refine later. */
export function inferCategory(text: string): Category {
  const lower = text.toLowerCase();
  let best: Category = "design-guild";
  let bestScore = 0;
  for (const cat of Object.keys(CATEGORY_KEYWORDS) as Category[]) {
    const words = CATEGORY_KEYWORDS[cat];
    const score = words.filter((w) => lower.includes(w)).length;
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  }
  return best;
}

export function emptyIntake(): IntakeProfile {
  return {
    playerName: "",
    northStar: "",
    epics: [],
    quests: [],
    blockers: "",
    resistance: "",
    disciplines: [],
  };
}

export function buildStarterPack(
  intake: IntakeProfile,
  existingQuestIds: Set<string>,
  existingEpicNames: Set<string>,
  existingDisciplineIds: Set<string>,
): StarterPack {
  const epics: Epic[] = [];
  const epicNameSet = new Set(existingEpicNames);

  for (const item of intake.epics) {
    const name = item.title.trim();
    if (!name) continue;
    const description = [
      intake.northStar.slice(0, 100) || name,
      epicIntensityNote(item.difficulty),
    ]
      .filter(Boolean)
      .join(" · ");
    try {
      const epic = createEpic(name, description, epicNameSet);
      epics.push(epic);
      epicNameSet.add(epic.name.toLowerCase());
    } catch {
      // skip duplicate / invalid
    }
  }

  const quests: Quest[] = [];
  const questIds = new Set(existingQuestIds);
  const firstEpic = epics[0]?.name;

  for (const item of intake.quests) {
    const title = item.title.trim();
    if (!title) continue;
    const profile = questProfileForDifficulty(item.difficulty);
    try {
      const quest = createQuest(
        {
          title,
          scale: profile.scale,
          track: "main",
          category: inferCategory(title),
          unlockLevel: profile.unlockLevel,
          xp: profile.xp,
          epic: epics.length === 1 ? firstEpic : undefined,
        },
        questIds,
      );
      quests.push(quest);
      questIds.add(quest.id);
    } catch {
      // skip
    }
  }

  if (intake.northStar.trim()) {
    const horizonProfile = questProfileForDifficulty("legendary");
    try {
      const horizon = createQuest(
        {
          title: intake.northStar.trim(),
          scale: horizonProfile.scale,
          track: "main",
          category: inferCategory(intake.northStar),
          unlockLevel: horizonProfile.unlockLevel,
          xp: horizonProfile.xp,
          epic: epics.length === 1 ? firstEpic : undefined,
        },
        questIds,
      );
      quests.push(horizon);
    } catch {
      // skip
    }
  }

  const disciplines: CheckDiscipline[] = [];
  const disciplineIds = new Set(existingDisciplineIds);

  for (const item of intake.disciplines) {
    const title = item.title.trim();
    if (!title) continue;
    try {
      const discipline = createCheckDiscipline(
        title,
        disciplineRewardsForDifficulty(item.difficulty),
        disciplineIds,
      );
      disciplines.push(discipline);
      disciplineIds.add(discipline.id);
    } catch {
      // skip
    }
  }

  const assignedQuestIds = quests
    .filter((q) => q.scale === "minor")
    .slice(0, 3)
    .map((q) => q.id);

  return { epics, quests, disciplines, assignedQuestIds };
}
