import { useEffect, useState } from "react";
import { emptyIntake, type IntakeProfile } from "../domain/intake.ts";

const STORAGE_KEY = "questlife.onboarding.v1";

function migrateIntake(raw: Partial<IntakeProfile> | undefined): IntakeProfile {
  const base = emptyIntake();
  if (!raw) return base;

  return {
    playerName: raw.playerName ?? base.playerName,
    northStar: raw.northStar ?? base.northStar,
    epics: raw.epics ?? (raw as { campaigns?: string[] }).campaigns?.map((title) => ({
      title,
      difficulty: "moderate" as const,
    })) ?? base.epics,
    quests:
      raw.quests ??
      (raw as { weekQuests?: string[] }).weekQuests?.map((title) => ({
        title,
        difficulty: "moderate" as const,
      })) ??
      base.quests,
    blockers: raw.blockers ?? base.blockers,
    resistance: raw.resistance ?? base.resistance,
    disciplines:
      raw.disciplines ??
      (raw as { dailyHabits?: string[] }).dailyHabits?.map((title) => ({
        title,
        difficulty: "light" as const,
      })) ??
      base.disciplines,
  };
}

export interface OnboardingState {
  complete: boolean;
  intake: IntakeProfile;
}

function loadOnboarding(): OnboardingState {
  if (typeof localStorage === "undefined") {
    return { complete: false, intake: emptyIntake() };
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { complete: false, intake: emptyIntake() };

  try {
    const parsed = JSON.parse(raw) as OnboardingState;
    return {
      complete: Boolean(parsed.complete),
      intake: migrateIntake(parsed.intake),
    };
  } catch {
    return { complete: false, intake: emptyIntake() };
  }
}

export function useOnboarding() {
  const [state, setState] = useState(loadOnboarding);

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function finishOnboarding(intake: IntakeProfile) {
    setState({ complete: true, intake });
  }

  function reset() {
    setState({ complete: false, intake: emptyIntake() });
  }

  return {
    isComplete: state.complete,
    intake: state.intake,
    finishOnboarding,
    reset,
  };
}
