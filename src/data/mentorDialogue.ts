import type { IntakeProfile } from "../domain/intake.ts";

export type StepKind = "continue" | "reply" | "reply-short" | "review";

export interface ConversationStep {
  id: string;
  kind: StepKind;
  /** Mentor line — may include {placeholders} filled from intake. */
  mentor: string;
  /** Intake field to write on submit. */
  field?: keyof IntakeProfile;
  /** Split free-text replies into rated items (epics, quests, disciplines). */
  parseItems?: boolean;
  listMin?: number;
  placeholder?: string;
  optional?: boolean;
}

/** First name only — role titles come later via class sort. */
export const MENTOR_NAME = "Soren";

export const CONVERSATION_STEPS: ConversationStep[] = [
  {
    id: "welcome",
    kind: "continue",
    mentor:
      "Welcome, traveller. I see you have sought my counsel for the road ahead.",
  },
  {
    id: "north-star",
    kind: "reply",
    field: "northStar",
    mentor: "Tell me, what is it that you seek?",
    placeholder: "Speak freely…",
  },
  {
    id: "name",
    kind: "reply-short",
    field: "playerName",
    mentor: "And whom shall I name in the log?",
    placeholder: "Your name",
  },
  {
    id: "epics",
    kind: "reply",
    field: "epics",
    parseItems: true,
    optional: true,
    mentor:
      "{playerName} — beneath that, what larger wars are you fighting? The ones that aren't errands.",
    placeholder: "A sentence or two is enough…",
  },
  {
    id: "quests",
    kind: "reply",
    field: "quests",
    parseItems: true,
    listMin: 1,
    mentor:
      "Good. What needs to move on the road soon? Say what comes — I'll mark the weight of each.",
    placeholder: "One thing, or several…",
  },
  {
    id: "blockers",
    kind: "reply",
    field: "blockers",
    mentor: "Every road has hazards. What's standing in yours?",
    placeholder: "Coin, time, fog, other people…",
  },
  {
    id: "resistance",
    kind: "reply",
    field: "resistance",
    mentor: "And what's gone unspoken — the deed you keep leaving off the log?",
    placeholder: "No need to dress it up…",
  },
  {
    id: "disciplines",
    kind: "reply",
    field: "disciplines",
    parseItems: true,
    listMin: 1,
    mentor:
      "Last — what do you keep daily, or mean to, that steadies you on the march?",
    placeholder: "Morning walk, reading, bed on time…",
  },
  {
    id: "review",
    kind: "review",
    mentor:
      "I've set your charter from what you told me. Read it back — amend if I misheard, or seal it and we march.",
  },
];

export function fillMentorTemplate(template: string, intake: IntakeProfile): string {
  const name = intake.playerName.trim() || "Traveler";
  return template
    .replace(/\{playerName\}/g, name)
    .replace(/\*\*(.+?)\*\*/g, "$1");
}
