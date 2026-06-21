import type { Discipline } from "../domain/discipline.ts";
import type { Epic } from "../domain/epic.ts";
import type { Quest } from "../domain/quest.ts";

/** Bump to reset the public demo character to the latest template. */
export const TUTORIAL_STARTER_VERSION = 4;

export const TUTORIAL_CHARACTER_ID = "jules";

export const TUTORIAL_DISPLAY_NAME = "Jules";
export const TUTORIAL_CHARACTER_CLASS = "Specialist / Wayfinder";

export const TUTORIAL_NORTH_STAR =
  "The promotion, a cinematography practice that sticks, and a creative community that gets it.";

export const TUTORIAL_EPICS: Epic[] = [
  {
    name: "Get Promoted",
    description: "Make the case, do the work, and earn the step up.",
  },
  {
    name: "Build Real Security",
    description: "Turn vague money anxiety into a plan you trust.",
  },
  {
    name: "Keep Shooting",
    description: "Cinematography on the side — protect it from good intentions that fade.",
  },
  {
    name: "Feel Like Myself Again",
    description: "Steadier inside, kinder to the people around you.",
  },
  {
    name: "Find a Creative Community",
    description: "People who speak your language — not creating in a vacuum.",
  },
];

export const TUTORIAL_QUESTS: Quest[] = [
  // --- Get Promoted ---
  {
    id: "demo-wins-doc",
    title: "Write down three wins from the last quarter",
    scale: "minor",
    track: "main",
    category: "design-guild",
    epic: "Get Promoted",
    unlockLevel: 1,
    xp: 10,
  },
  {
    id: "demo-manager-ask",
    title: "Ask your manager what's required for promotion",
    scale: "minor",
    track: "main",
    category: "alliances",
    epic: "Get Promoted",
    unlockLevel: 1,
    xp: 10,
  },
  {
    id: "demo-run-meeting",
    title: "Run one cross-team meeting with a clear agenda",
    scale: "minor",
    track: "main",
    category: "design-guild",
    epic: "Get Promoted",
    unlockLevel: 2,
    xp: 15,
  },
  {
    id: "demo-sponsor",
    title: "Ask a senior colleague to advocate in your promotion case",
    scale: "minor",
    track: "main",
    category: "alliances",
    epic: "Get Promoted",
    unlockLevel: 3,
    xp: 15,
  },
  {
    id: "demo-present",
    title: "Present your impact in a promotion review or case",
    scale: "major",
    track: "main",
    category: "design-guild",
    epic: "Get Promoted",
    unlockLevel: 5,
    xp: 40,
  },
  {
    id: "demo-promotion",
    title: "Get promoted to the next level",
    scale: "boss",
    track: "main",
    category: "design-guild",
    epic: "Get Promoted",
    unlockLevel: 8,
    xp: 90,
  },

  // --- Build Real Security ---
  {
    id: "demo-money-map",
    title: "Map every account and monthly outflow in one place",
    scale: "minor",
    track: "main",
    category: "keep-management",
    epic: "Build Real Security",
    unlockLevel: 1,
    xp: 10,
  },
  {
    id: "demo-money-talk",
    title: "Have an honest conversation about money with someone you trust",
    scale: "minor",
    track: "main",
    category: "alliances",
    epic: "Build Real Security",
    unlockLevel: 2,
    xp: 15,
  },
  {
    id: "demo-savings-rule",
    title: "Pick one savings rule and automate it",
    scale: "minor",
    track: "main",
    category: "keep-management",
    epic: "Build Real Security",
    unlockLevel: 2,
    xp: 15,
  },
  {
    id: "demo-emergency",
    title: "Build a one-month emergency buffer",
    scale: "major",
    track: "main",
    category: "keep-management",
    epic: "Build Real Security",
    unlockLevel: 4,
    xp: 40,
  },

  // --- Keep Shooting ---
  {
    id: "demo-film-block",
    title: "Block one protected cinematography session this week",
    scale: "minor",
    track: "side",
    category: "crafting",
    epic: "Keep Shooting",
    unlockLevel: 1,
    xp: 10,
  },
  {
    id: "demo-capture-scene",
    title: "Capture one scene or shot list — shoot or storyboard",
    scale: "minor",
    track: "main",
    category: "crafting",
    epic: "Keep Shooting",
    unlockLevel: 1,
    xp: 10,
  },
  {
    id: "demo-share-cut",
    title: "Share a rough cut or stills with someone for feedback",
    scale: "minor",
    track: "main",
    category: "alliances",
    epic: "Keep Shooting",
    unlockLevel: 2,
    xp: 15,
  },
  {
    id: "demo-screen-piece",
    title: "Screen one piece — festival, online, or friends' night",
    scale: "major",
    track: "main",
    category: "crafting",
    epic: "Keep Shooting",
    unlockLevel: 6,
    xp: 40,
  },

  // --- Feel Like Myself Again ---
  {
    id: "demo-friend-reach",
    title: "Message a friend you've been meaning to reconnect with",
    scale: "minor",
    track: "side",
    category: "alliances",
    epic: "Feel Like Myself Again",
    unlockLevel: 1,
    xp: 10,
  },
  {
    id: "demo-morning-pages",
    title: "Three mornings of journaling — one page each",
    scale: "minor",
    track: "side",
    category: "vitality",
    epic: "Feel Like Myself Again",
    unlockLevel: 2,
    xp: 15,
  },
  {
    id: "demo-therapy",
    title: "Book or attend one session with a counsellor",
    scale: "minor",
    track: "main",
    category: "vitality",
    epic: "Feel Like Myself Again",
    unlockLevel: 2,
    xp: 15,
  },

  // --- Find a Creative Community ---
  {
    id: "demo-find-meetup",
    title: "Research one local film or video meetup",
    scale: "minor",
    track: "main",
    category: "alliances",
    epic: "Find a Creative Community",
    unlockLevel: 2,
    xp: 15,
  },
  {
    id: "demo-attend-event",
    title: "Attend a screening or filmmaker event",
    scale: "minor",
    track: "main",
    category: "alliances",
    epic: "Find a Creative Community",
    unlockLevel: 3,
    xp: 15,
  },
  {
    id: "demo-online-intro",
    title: "Introduce yourself in an online film community",
    scale: "minor",
    track: "main",
    category: "alliances",
    epic: "Find a Creative Community",
    unlockLevel: 3,
    xp: 15,
  },
  {
    id: "demo-community-boss",
    title: "Find a creative community you show up to regularly",
    scale: "boss",
    track: "main",
    category: "alliances",
    epic: "Find a Creative Community",
    unlockLevel: 6,
    xp: 90,
  },

  // --- Learning & side quests (ungrouped or cross-cutting) ---
  {
    id: "demo-finish-book",
    title: "Finish one book you started months ago",
    scale: "minor",
    track: "side",
    category: "lore",
    unlockLevel: 1,
    xp: 10,
  },
  {
    id: "demo-course-module",
    title: "Complete one module of a cinematography or film course",
    scale: "minor",
    track: "side",
    category: "lore",
    unlockLevel: 2,
    xp: 15,
  },
  {
    id: "demo-inbox-zero",
    title: "Clear work inbox to zero on Friday",
    scale: "minor",
    track: "side",
    category: "keep-management",
    unlockLevel: 1,
    xp: 10,
  },
];

export const TUTORIAL_DISCIPLINES: Discipline[] = [
  {
    id: "demo-film-practice",
    kind: "check",
    title: "Cinematography practice — 30 minutes",
    rewards: [{ stat: "mana", amount: 15 }],
  },
  {
    id: "demo-reading",
    kind: "check",
    title: "Reading — 20 minutes",
    rewards: [{ stat: "xp", amount: 10 }],
  },
  {
    id: "demo-movement",
    kind: "check",
    title: "Movement — 30+ minutes",
    rewards: [{ stat: "hp", amount: 10 }],
  },
  {
    id: "demo-sleep",
    kind: "check",
    title: "Sleep 7+ hours",
    rewards: [{ stat: "hp", amount: 10 }],
  },
  {
    id: "demo-deep-work",
    kind: "check",
    title: "Deep work block completed",
    rewards: [{ stat: "mana", amount: 15 }],
  },
  {
    id: "demo-lunch-walk",
    kind: "check",
    title: "Lunch break away from desk",
    rewards: [{ stat: "mana", amount: 10 }],
  },
  {
    id: "demo-journal",
    kind: "check",
    title: "Journaled or named one feeling",
    rewards: [
      { stat: "hp", amount: 5 },
      { stat: "mana", amount: 5 },
    ],
  },
  {
    id: "demo-skipped-lunch",
    kind: "yes-no",
    title: "Skipped lunch to push through work",
    yesLabel: "Aye",
    yes: { stat: "hp", amount: -10 },
    noLabel: "Naur",
    no: { stat: "hp", amount: 5 },
  },
  {
    id: "demo-after-hours-email",
    kind: "yes-no",
    title: "Checked work email after hours",
    yesLabel: "Aye",
    yes: { stat: "mana", amount: -10 },
    noLabel: "Naur",
    no: { stat: "mana", amount: 5 },
  },
  {
    id: "demo-overwork",
    kind: "streak",
    title: "Back-to-back late nights",
    threshold: 2,
    progress: 0,
    unit: "days",
    rewards: [
      { stat: "mana", amount: -10 },
      { stat: "hp", amount: -10 },
    ],
  },
];

/** Current board — three threads friends should recognise immediately. */
export const TUTORIAL_STARTER_QUEST_IDS = [
  "demo-manager-ask",
  "demo-film-block",
  "demo-money-map",
] as const;

export const TUTORIAL_STARTER_HABIT_IDS = [
  "demo-film-practice",
  "demo-reading",
] as const;
