import { useEffect, useRef, useState, type FormEvent } from "react";
import { DIFFICULTY_BY_KEY } from "../../domain/difficulty.ts";
import { analyzeIntake } from "../../domain/intakeAnalysis.ts";
import { emptyIntake, type IntakeProfile } from "../../domain/intake.ts";
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

type AnswerField = "playerName" | "northStar" | "blockers" | "dailyHabits";

function isAnswerField(field: keyof IntakeProfile): field is AnswerField {
  return (
    field === "playerName" ||
    field === "northStar" ||
    field === "blockers" ||
    field === "dailyHabits"
  );
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
  const analyzeStartedRef = useRef(false);

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
    if (!step.field || !isAnswerField(step.field)) {
      setDraft("");
      return;
    }
    setDraft(intake[step.field]);
  }, [stepIndex, step.field, intake]);

  useEffect(() => {
    if (step.kind !== "analyze") {
      analyzeStartedRef.current = false;
      return;
    }
    if (analyzeStartedRef.current) return;
    analyzeStartedRef.current = true;

    const timer = window.setTimeout(() => {
      setIntake((current) => {
        const generated = analyzeIntake({
          northStar: current.northStar,
          blockers: current.blockers,
          dailyHabits: current.dailyHabits,
        });
        const nextIntake = { ...current, ...generated };
        const reviewStep = CONVERSATION_STEPS[stepIndex + 1];
        if (reviewStep) {
          appendTranscript([
            {
              role: "mentor",
              text: fillMentorTemplate(reviewStep.mentor, nextIntake),
            },
          ]);
        }
        setStepIndex(stepIndex + 1);
        return nextIntake;
      });
    }, 900);

    return () => window.clearTimeout(timer);
  }, [step.kind, stepIndex]);

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
    if (!step.field || !isAnswerField(step.field)) {
      goNext(intake);
      return;
    }
    const nextIntake = { ...intake, [step.field]: "" };
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
    if (!step.field || !isAnswerField(step.field)) return;

    const value = draft.trim();
    if (!value && !step.optional) return;

    const nextIntake = { ...intake, [step.field]: value };
    setIntake(nextIntake);
    appendTranscript([{ role: "player", text: value || "…" }]);
    goNext(nextIntake);
  }

  function handleBack() {
    if (stepIndex === 0) return;
    const prevIndex = step.kind === "review" ? stepIndex - 2 : stepIndex - 1;
    if (prevIndex < 0) return;
    setStepIndex(prevIndex);
    setDraft("");
  }

  const showBack = stepIndex > 0 && step.kind !== "analyze";
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

        {step.kind === "analyze" && (
          <div className={styles.analyzing} role="status" aria-live="polite">
            <p className={styles.hint}>{step.mentor}</p>
          </div>
        )}

        {step.kind === "review" && (
          <div className={styles.review}>
            <dl className={styles.summary}>
              {intake.epics.length > 0 && (
                <div>
                  <dt>Storylines</dt>
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
                <dt>Quests</dt>
                <dd>
                  {intake.quests.map((item) => (
                    <span key={item.title}>
                      {item.title}
                      <em>{DIFFICULTY_BY_KEY[item.difficulty].label}</em>
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt>Disciplines</dt>
                <dd>
                  {intake.disciplines.map((item) => (
                    <span key={item.title}>
                      {item.title}
                      <em>{DIFFICULTY_BY_KEY[item.difficulty].label}</em>
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <div className={styles.actions}>
              <button type="button" className={styles.back} onClick={handleBack}>
                Change my answers
              </button>
              <button type="button" className={styles.primary} onClick={handleContinue}>
                Looks good — begin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
