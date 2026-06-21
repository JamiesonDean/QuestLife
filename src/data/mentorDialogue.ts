import type { IntakeProfile } from "../domain/intake.ts";

export type StepKind = "continue" | "reply" | "reply-short" | "analyze" | "review";

export interface ConversationStep {
  id: string;
  kind: StepKind;
  /** Mentor line — may include {placeholders} filled from intake. */
  mentor: string;
  /** Intake field to write on submit. */
  field?: keyof IntakeProfile;
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
      "Welcome, traveller. Before we draw up your charter, I need to understand the road you're on.",
  },
  {
    id: "goals",
    kind: "reply",
    field: "northStar",
    mentor:
      "What are you working toward right now? Think goals, ambitions, the changes you want in your life.",
    placeholder: "Career move, health, creative work, relationships…",
  },
  {
    id: "name",
    kind: "reply-short",
    field: "playerName",
    mentor: "And whom shall I name in the log?",
    placeholder: "Your name",
  },
  {
    id: "blockers",
    kind: "reply",
    field: "blockers",
    mentor: "Every road has hazards. What's getting in your way — time, energy, fear, other people?",
    placeholder: "Be honest; it helps me plan…",
  },
  {
    id: "habits",
    kind: "reply",
    field: "dailyHabits",
    mentor:
      "Last — what daily habits do you already keep, or want to build, that steady you on the march?",
    placeholder: "Morning walk, reading, bed on time…",
  },
  {
    id: "analyze",
    kind: "analyze",
    mentor: "Give me a moment to study what you've told me…",
  },
  {
    id: "review",
    kind: "review",
    mentor:
      "{playerName}, here's what I'd propose — Storylines for the larger wars, quests to move soon, and disciplines for daily keep. Does this charter fit?",
  },
];

export function fillMentorTemplate(template: string, intake: IntakeProfile): string {
  const name = intake.playerName.trim() || "Traveler";
  return template
    .replace(/\{playerName\}/g, name)
    .replace(/\*\*(.+?)\*\*/g, "$1");
}
