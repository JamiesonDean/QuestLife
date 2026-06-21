import type { Category } from "./quest.ts";

export interface QuestCategoryContext {
  /** Storyline title — lower weight than the quest title. */
  storylineTitle?: string;
  /** Storyline description — lowest weight. */
  storylineDescription?: string;
}

type ScoreMap = Record<Category, number>;

const CATEGORIES: Category[] = [
  "keep-management",
  "vitality",
  "crafting",
  "design-guild",
  "alliances",
  "lore",
];

const EMPTY_SCORES = (): ScoreMap => ({
  "keep-management": 0,
  vitality: 0,
  crafting: 0,
  "design-guild": 0,
  alliances: 0,
  lore: 0,
});

/** Strong phrase hits — checked before single-word signals. */
const PHRASE_SIGNALS: { pattern: RegExp; category: Category; weight: number }[] = [
  { pattern: /\bask (?:your |my |a )?(?:manager|boss|colleague|senior|mentor|friend|partner|parent|doctor|therapist)\b/i, category: "alliances", weight: 8 },
  { pattern: /\b(?:talk|speak|chat) (?:to|with)\b/i, category: "alliances", weight: 7 },
  { pattern: /\b(?:have|start) (?:a |an )?(?:honest )?conversation\b/i, category: "alliances", weight: 7 },
  { pattern: /\b(?:call|email|text|message|reach out to)\b/i, category: "alliances", weight: 6 },
  { pattern: /\b(?:network|connect) with\b/i, category: "alliances", weight: 6 },
  { pattern: /\b(?:date|dating|relationship|marriage|wedding)\b/i, category: "alliances", weight: 8 },
  { pattern: /\b(?:family|friend|partner|spouse|colleague|team member)\b/i, category: "alliances", weight: 5 },
  { pattern: /\b(?:advocate|sponsor|someone you trust)\b/i, category: "alliances", weight: 6 },

  { pattern: /\b(?:budget|savings|emergency buffer|emergency fund|outflow|income|expense)\b/i, category: "keep-management", weight: 8 },
  { pattern: /\b(?:tax|gst|invoice|receipt|accounting|bookkeep)\b/i, category: "keep-management", weight: 8 },
  { pattern: /\b(?:rent|mortgage|bills|subscription|debt|loan|credit card)\b/i, category: "keep-management", weight: 7 },
  { pattern: /\b(?:automate|map every account|financial plan|money map)\b/i, category: "keep-management", weight: 7 },
  { pattern: /\b(?:paperwork|admin|organize files|filing)\b/i, category: "keep-management", weight: 6 },
  { pattern: /\b(?:insurance|superannuation|401k|retirement fund)\b/i, category: "keep-management", weight: 6 },

  { pattern: /\b(?:workout|exercise|gym|running|walk \d|steps|sleep schedule|bedtime|wake up)\b/i, category: "vitality", weight: 8 },
  { pattern: /\b(?:dentist|doctor|therapy|therapist|counsell|checkup|check-up|medical)\b/i, category: "vitality", weight: 8 },
  { pattern: /\b(?:mental health|anxiety|stress|burnout|meditat|mindful)\b/i, category: "vitality", weight: 7 },
  { pattern: /\b(?:nutrition|meal prep|healthy eating|diet)\b/i, category: "vitality", weight: 6 },
  { pattern: /\b(?:counsell|counsel(?:lor|ing)|therapist|therapy session)\b/i, category: "vitality", weight: 9 },
  { pattern: /\b(?:clear (?:work )?inbox|inbox to zero)\b/i, category: "keep-management", weight: 8 },
  { pattern: /\b(?:share .{0,40} with someone|feedback from someone)\b/i, category: "alliances", weight: 7 },
  { pattern: /\b(?:screen(?:ing)?|festival|film meetup|filmmaker event)\b/i, category: "crafting", weight: 6 },
  { pattern: /\b(?:journaling|journal(?:ing)?|morning pages|three mornings)\b/i, category: "vitality", weight: 7 },
  { pattern: /\b(?:research one local|video meetup|film meetup)\b/i, category: "alliances", weight: 8 },
  { pattern: /\b(?:attend (?:a |an )?screening|filmmaker event)\b/i, category: "alliances", weight: 8 },
  { pattern: /\b(?:complete (?:one |a )?module|cinematography or film course)\b/i, category: "lore", weight: 8 },

  { pattern: /\b(?:shoot|filming|photography|cinematography|edit video|record (?:a |an )?(?:song|track|demo))\b/i, category: "crafting", weight: 8 },
  { pattern: /\b(?:paint|draw|illustrat|pottery|knit|sew|woodwork)\b/i, category: "crafting", weight: 8 },
  { pattern: /\b(?:write (?:a |an )?(?:story|poem|script|zine|album|blog post|draft))\b/i, category: "crafting", weight: 7 },
  { pattern: /\b(?:cook|bake|recipe|creative project|portfolio piece|artwork)\b/i, category: "crafting", weight: 6 },
  { pattern: /\b(?:build (?:a |an )?(?:app|website|prototype|game|mod))\b/i, category: "crafting", weight: 6 },

  { pattern: /\b(?:get promoted|promotion|promoted|next level|performance review)\b/i, category: "design-guild", weight: 9 },
  { pattern: /\b(?:write down (?:\d+|three|your) wins|impact doc|promotion case|brag doc)\b/i, category: "design-guild", weight: 8 },
  { pattern: /\b(?:run (?:a |one )?(?:meeting|workshop|retro|standup|review))\b/i, category: "design-guild", weight: 7 },
  { pattern: /\b(?:present (?:your|my|the) (?:impact|work|case|findings))\b/i, category: "design-guild", weight: 8 },
  { pattern: /\b(?:cross-team|stakeholder|roadmap|deliverable|milestone|project plan)\b/i, category: "design-guild", weight: 6 },
  { pattern: /\b(?:job application|interview prep|resume|cv|linkedin|career)\b/i, category: "design-guild", weight: 7 },
  { pattern: /\b(?:leadership|professional|work project|at work|on the job)\b/i, category: "design-guild", weight: 5 },

  { pattern: /\b(?:read (?:a |an )?(?:book|paper|chapter|course module))\b/i, category: "lore", weight: 7 },
  { pattern: /\b(?:study for|take (?:a |an )?course|enrol|enroll|class|lesson|tutorial)\b/i, category: "lore", weight: 8 },
  { pattern: /\b(?:research|learn about|deep dive|essay|thesis|argument)\b/i, category: "lore", weight: 7 },
  { pattern: /\b(?:practice (?:theory|scales|language|vocab)|language learning)\b/i, category: "lore", weight: 6 },
  { pattern: /\b(?:journal|reflect on|think through|write notes on)\b/i, category: "lore", weight: 4 },
];

const WORD_SIGNALS: { word: string; category: Category; weight: number }[] = [
  { word: "money", category: "keep-management", weight: 4 },
  { word: "finance", category: "keep-management", weight: 4 },
  { word: "budget", category: "keep-management", weight: 5 },
  { word: "tax", category: "keep-management", weight: 5 },
  { word: "rent", category: "keep-management", weight: 4 },
  { word: "savings", category: "keep-management", weight: 5 },
  { word: "admin", category: "keep-management", weight: 4 },
  { word: "bills", category: "keep-management", weight: 4 },
  { word: "health", category: "vitality", weight: 5 },
  { word: "exercise", category: "vitality", weight: 5 },
  { word: "sleep", category: "vitality", weight: 5 },
  { word: "walk", category: "vitality", weight: 3 },
  { word: "gym", category: "vitality", weight: 5 },
  { word: "doctor", category: "vitality", weight: 5 },
  { word: "dentist", category: "vitality", weight: 5 },
  { word: "photo", category: "crafting", weight: 4 },
  { word: "music", category: "crafting", weight: 4 },
  { word: "art", category: "crafting", weight: 4 },
  { word: "creative", category: "crafting", weight: 4 },
  { word: "film", category: "crafting", weight: 4 },
  { word: "cook", category: "crafting", weight: 3 },
  { word: "promotion", category: "design-guild", weight: 6 },
  { word: "promoted", category: "design-guild", weight: 6 },
  { word: "manager", category: "design-guild", weight: 3 },
  { word: "meeting", category: "design-guild", weight: 4 },
  { word: "work", category: "design-guild", weight: 2 },
  { word: "career", category: "design-guild", weight: 5 },
  { word: "job", category: "design-guild", weight: 4 },
  { word: "professional", category: "design-guild", weight: 4 },
  { word: "design", category: "design-guild", weight: 3 },
  { word: "leadership", category: "design-guild", weight: 4 },
  { word: "relationship", category: "alliances", weight: 5 },
  { word: "dating", category: "alliances", weight: 5 },
  { word: "friend", category: "alliances", weight: 4 },
  { word: "partner", category: "alliances", weight: 4 },
  { word: "family", category: "alliances", weight: 4 },
  { word: "network", category: "alliances", weight: 3 },
  { word: "community", category: "alliances", weight: 4 },
  { word: "research", category: "lore", weight: 5 },
  { word: "study", category: "lore", weight: 5 },
  { word: "learn", category: "lore", weight: 4 },
  { word: "read", category: "lore", weight: 3 },
  { word: "course", category: "lore", weight: 4 },
  { word: "book", category: "lore", weight: 3 },
];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function scoreText(text: string, multiplier: number): ScoreMap {
  const scores = EMPTY_SCORES();
  const normalized = text.trim();
  if (!normalized) return scores;

  for (const { pattern, category, weight } of PHRASE_SIGNALS) {
    if (pattern.test(normalized)) {
      scores[category] += weight * multiplier;
    }
  }

  for (const { word, category, weight } of WORD_SIGNALS) {
    const pattern = new RegExp(`\\b${escapeRegex(word)}\\b`, "i");
    if (pattern.test(normalized)) {
      scores[category] += weight * multiplier;
    }
  }

  return scores;
}

function mergeScores(...maps: ScoreMap[]): ScoreMap {
  const total = EMPTY_SCORES();
  for (const map of maps) {
    for (const category of CATEGORIES) {
      total[category] += map[category];
    }
  }
  return total;
}

function pickCategory(scores: ScoreMap, fallback: Category): Category {
  let best = fallback;
  let bestScore = scores[fallback] ?? 0;

  for (const category of CATEGORIES) {
    if (scores[category] > bestScore) {
      bestScore = scores[category];
      best = category;
    }
  }

  return bestScore > 0 ? best : fallback;
}

function isPeoplePrimaryTask(text: string): boolean {
  return (
    /\bask (?:your |my |a )?(?:manager|boss|colleague|senior|mentor|friend|partner)\b/i.test(text) ||
    /\b(?:talk|speak|chat) (?:to|with)\b/i.test(text) ||
    /\b(?:share .{0,50} with|reach out to|introduce yourself)\b/i.test(text) ||
    /\b(?:attend (?:a |an )?(?:event|meetup|screening|session)|find (?:a |an )?(?:creative )?community)\b/i.test(text) ||
    /\b(?:research one local|filmmaker event|online film community)\b/i.test(text) ||
    /\b(?:have|start) (?:a |an )?(?:honest )?conversation\b/i.test(text) ||
    /\b(?:call|email|text|message) (?:your |my |a |the )?\b/i.test(text)
  );
}

function isVitalityCareTask(text: string): boolean {
  return /\b(?:counsell|counsel|therapist|therapy session|doctor|dentist|checkup|medical appointment)\b/i.test(
    text,
  );
}

function isLearningTask(text: string): boolean {
  return /\b(?:course|module|class|lesson|study|research|learn|read (?:a |an )?book)\b/i.test(text);
}

function isAdminTask(text: string): boolean {
  return /\b(?:inbox|paperwork|filing|budget|bills|tax|savings|account|automate)\b/i.test(text);
}

/**
 * Analyse quest title (+ optional Storyline context) and pick the best category.
 *
 * 1. Score the quest title (×3) with phrase + word signals
 * 2. Apply people-first / vitality / learning overrides for common shapes
 * 3. If the title is ambiguous, blend in Storyline title (×1.5) and description (×1)
 */
export function inferQuestCategory(
  questTitle: string,
  context: QuestCategoryContext = {},
): Category {
  const titleScores = scoreText(questTitle, 3);
  const titlePick = pickCategory(titleScores, "design-guild");
  const titleTopScore = Math.max(...CATEGORIES.map((c) => titleScores[c]));

  if (isVitalityCareTask(questTitle)) {
    return "vitality";
  }

  if (isPeoplePrimaryTask(questTitle) && titleScores.alliances > 0) {
    return "alliances";
  }

  if (isLearningTask(questTitle) && !/\b(?:meetup|community|screening|event)\b/i.test(questTitle)) {
    if (titleScores.lore >= titleScores.crafting) {
      return "lore";
    }
  }

  if (isAdminTask(questTitle) && titleScores["keep-management"] >= titleScores["design-guild"]) {
    return "keep-management";
  }

  if (titleTopScore >= 9) {
    return titlePick;
  }

  const contextScores = mergeScores(
    scoreText(context.storylineTitle ?? "", 1.5),
    scoreText(context.storylineDescription ?? "", 1),
  );
  const combined = mergeScores(titleScores, contextScores);
  const storylineFallback = pickCategory(contextScores, "design-guild");

  return pickCategory(combined, storylineFallback);
}

/** @deprecated Use inferQuestCategory — kept for existing imports. */
export function inferCategory(text: string): Category {
  return inferQuestCategory(text);
}
