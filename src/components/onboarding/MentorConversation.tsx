import { useEffect, useRef, useState, type FormEvent } from "react";
import { DIFFICULTY_BY_KEY } from "../../domain/difficulty.ts";
import { emptyIntake, type IntakeProfile } from "../../domain/intake.ts";
import { parseItemsFromProse } from "../../domain/intakeParse.ts";
import {
  CONVERSATION_STEPS,
  fillMentorTemplate,
  MENTOR_NAME,
} from "../../data/mentorDialogue.ts";
import mentorPortrait from "../../assets/mentor-cloak-pixel.png";
import styles from "./MentorConversation.module.css";

export interface MentorConversationProps {
  onComplete: (intake: IntakeProfile) => void;
}

interface TranscriptLine {
  role: "mentor" | "player";
  text: string;
}

type StringField = "playerName" | "northStar" | "blockers" | "resistance";
type ItemsField = "epics" | "quests" | "disciplines";

function isStringField(field: keyof IntakeProfile): field is StringField {
  return field !== "epics" && field !== "quests" && field !== "disciplines";
}

function isItemsField(field: keyof IntakeProfile): field is ItemsField {
  return field === "epics" || field === "quests" || field === "disciplines";
}

export function MentorConversation({ onComplete }: MentorConversationProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [intake, setIntake] = useState<IntakeProfile>(emptyIntake);
  const [transcript, setTranscript] = useState<TranscriptLine[]>(() => [
    {
      role: "mentor",
      text: fillMentorTemplate(CONVERSATION_STEPS[0]!.mentor, emptyIntake()),
    },
  ]);
  const [draft, setDraft] = useState("");
  const threadEndRef = useRef<HTMLDivElement>(null);

  const step = CONVERSATION_STEPS[stepIndex]!;

  useEffect(() => {
    const anchor = threadEndRef.current;
    if (!anchor) return;

    const frame = requestAnimationFrame(() => {
      anchor.scrollIntoView({ block: "end" });
    });

    return () => cancelAnimationFrame(frame);
  }, [transcript, stepIndex]);

  useEffect(() => {
    if (!step.field) {
      setDraft("");
      return;
    }
    const value = intake[step.field];
    if (typeof value === "string") {
      setDraft(value);
    } else {
      setDraft("");
    }
  }, [stepIndex, step.field, intake]);

  function appendTranscript(lines: TranscriptLine[]) {
    setTranscript((prev) => [...prev, ...lines]);
  }

  function goNext(nextIntake: IntakeProfile) {
    if (stepIndex >= CONVERSATION_STEPS.length - 1) return;
    const nextStep = CONVERSATION_STEPS[stepIndex + 1]!;
    appendTranscript([
      {
        role: "mentor",
        text: fillMentorTemplate(nextStep.mentor, nextIntake),
      },
    ]);
    setStepIndex((i) => i + 1);
    setDraft("");
  }

  function handleSkip() {
    if (!step.field) {
      goNext(intake);
      return;
    }
    const nextIntake = { ...intake };
    if (isItemsField(step.field)) {
      nextIntake[step.field] = [];
    } else if (isStringField(step.field)) {
      nextIntake[step.field] = "";
    }
    setIntake(nextIntake);
    appendTranscript([{ role: "player", text: "…" }]);
    goNext(nextIntake);
  }

  function handleContinue() {
    if (step.kind === "review") {
      onComplete(intake);
      return;
    }
    goNext(intake);
  }

  function handleReplySubmit(e: FormEvent) {
    e.preventDefault();
    if (!step.field) return;

    const value = draft.trim();
    if (!value && !step.optional) return;

    const nextIntake = { ...intake };

    if (step.parseItems && isItemsField(step.field)) {
      const items = value ? parseItemsFromProse(value) : [];
      const min = step.listMin ?? 0;
      if (items.length < min && !(step.optional && items.length === 0)) return;
      nextIntake[step.field] = items;
    } else if (isStringField(step.field)) {
      nextIntake[step.field] = value;
    }

    setIntake(nextIntake);
    appendTranscript([{ role: "player", text: value || "…" }]);
    goNext(nextIntake);
  }

  function handleBack() {
    if (stepIndex === 0) return;
    setStepIndex((i) => i - 1);
    setDraft("");
  }

  const showBack = stepIndex > 0 && step.kind !== "review";
  const isReply = step.kind === "reply" || step.kind === "reply-short";

  return (
    <div className={styles.conversation}>
      <header className={styles.header}>
        <div className={styles.portraitWrap}>
          <img className={styles.portrait} src={mentorPortrait} alt="" />
        </div>
        <div className={styles.headerMeta}>
          <p className={styles.mentorName}>{MENTOR_NAME}</p>
        </div>
      </header>

      <div className={styles.thread} aria-live="polite">
        {transcript.map((line, i) => (
          <div
            key={`${line.role}-${i}`}
            className={line.role === "mentor" ? styles.mentorBubble : styles.playerBubble}
          >
            {line.role === "mentor" && (
              <span className={styles.bubbleLabel}>{MENTOR_NAME}</span>
            )}
            <p className={styles.bubbleText}>{line.text}</p>
          </div>
        ))}
        <div ref={threadEndRef} className={styles.threadAnchor} aria-hidden />
      </div>

      <div className={styles.stage}>
        {step.kind === "continue" && (
          <div className={styles.actions}>
            {showBack && (
              <button type="button" className={styles.back} onClick={handleBack}>
                Back
              </button>
            )}
            <button type="button" className={styles.primary} onClick={handleContinue}>
              Go on
            </button>
          </div>
        )}

        {isReply && (
          <form className={styles.replyForm} onSubmit={handleReplySubmit}>
            {step.kind === "reply" ? (
              <textarea
                className={styles.replyInput}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={step.placeholder}
                rows={4}
                autoFocus
                aria-label="Your reply"
              />
            ) : (
              <input
                className={styles.replyInput}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={step.placeholder}
                autoFocus
                aria-label="Your reply"
              />
            )}
            <div className={styles.actions}>
              {showBack && (
                <button type="button" className={styles.back} onClick={handleBack}>
                  Back
                </button>
              )}
              {step.optional && !draft.trim() && (
                <button type="button" className={styles.secondary} onClick={handleSkip}>
                  Pass
                </button>
              )}
              <button
                type="submit"
                className={styles.primary}
                disabled={!step.optional && !draft.trim()}
              >
                Send
              </button>
            </div>
          </form>
        )}

        {step.kind === "review" && (
          <div className={styles.review}>
            <dl className={styles.summary}>
              <div>
                <dt>What you seek</dt>
                <dd>{intake.northStar || "—"}</dd>
              </div>
              <div>
                <dt>Name</dt>
                <dd>{intake.playerName || "—"}</dd>
              </div>
              {intake.epics.length > 0 && (
                <div>
                  <dt>The larger wars</dt>
                  <dd>
                    {intake.epics.map((item) => (
                      <span key={item.title}>
                        {item.title}
                        <em>{DIFFICULTY_BY_KEY[item.difficulty].label}</em>
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              <div>
                <dt>What must move</dt>
                <dd>
                  {intake.quests.length
                    ? intake.quests.map((item) => (
                        <span key={item.title}>
                          {item.title}
                          <em>{DIFFICULTY_BY_KEY[item.difficulty].label}</em>
                        </span>
                      ))
                    : "—"}
                </dd>
              </div>
              <div>
                <dt>Hazards</dt>
                <dd>{intake.blockers || "—"}</dd>
              </div>
              <div>
                <dt>Unspoken</dt>
                <dd>{intake.resistance || "—"}</dd>
              </div>
              <div>
                <dt>Daily keep</dt>
                <dd>
                  {intake.disciplines.length
                    ? intake.disciplines.map((item) => (
                        <span key={item.title}>
                          {item.title}
                          <em>{DIFFICULTY_BY_KEY[item.difficulty].label}</em>
                        </span>
                      ))
                    : "—"}
                </dd>
              </div>
            </dl>
            <div className={styles.actions}>
              <button type="button" className={styles.back} onClick={handleBack}>
                Amend charter
              </button>
              <button type="button" className={styles.primary} onClick={handleContinue}>
                Seal the charter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
