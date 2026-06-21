# QuestLife Onboarding — Progressive Reveal Plan

> **Status:** Spec only — not yet implemented.  
> **Purpose:** Get people started without overwhelm; teach mechanics through experience, not tutorials.  
> **Assumption:** Full Quest and Discipline data exists in the system. Onboarding controls **visibility, assignment, and feature access** — not seed data deletion.

---

## Player journey (full stack)

```text
Mentor conversation (intake) → Review & seed → Onboarding Phase 0–7
```

**Implemented:** [`MentorIntakeModal`](../src/components/onboarding/MentorIntakeModal.tsx) — modal overlay with The Mentor. Collects rated quests, optional epics, daily disciplines, blockers, and resistance. Difficulty (`light` → `legendary`) drives XP, quest scale, unlock level, and discipline rewards via [`difficulty.ts`](../src/domain/difficulty.ts). Triggered on first visit (required) or via **+ New character** (optional dismiss).

See [`class-sorting-and-mentor-matching.md`](./class-sorting-and-mentor-matching.md) for class sort, mentor assignment, and profile schema. **Progressive reveal (this doc) begins after StarterPack is seeded.**

**Reset demo (public):** reload the page — session-only mode clears progress.

**Characters (public demo):** Morgan is the example character. **+ New character** runs Soren's intake for a custom profile.

---

## Core principles

1. **One new mechanic at a time** — only after the previous one has been *felt* (completed/checked).
2. **Curated slice of the real UI** — no duplicate onboarding screens; use the actual Quest Card, Discipline Card, etc.
3. **Wins before weight** — Side quests and positive disciplines first; Boss tiers and punitive disciplines later.
4. **Progressive disclosure** — tabs, filters, creation flows, and full lists unlock in sequence.
5. **Graduation by behaviour** — phase advances when the player demonstrates the loop (e.g. 3 quests completed), with an optional skip for returning users.

---

## Mechanics teaching order

```
Complete 1 quest → XP / level
    → 3-quest board (Current Quests)
    → 1 daily check → vitals move
    → 2–3 disciplines (+ optional yes/no)
    → All Quests tab (level-gated browse)
    → 1 Epic as story + epic filter
    → Full disciplines (incl. streaks)
    → Create + multi-filter + full tiers (operator mode)
```

**Why this order:** Quest loop → daily loop → exploration → narrative (Epics) → accountability depth → autonomy.

---

## Phases

### Phase 0 — Arrival (~30 seconds)

| | |
|---|---|
| **Goal** | “This is a character sheet for my life, not a todo app.” |
| **Assigned quests** | 1 Side quest |
| **Disciplines** | 0 |
| **Show** | Character header; Current Quests tab; one Quest Card |
| **Hide** | All Quests tab, Epics panel, category filters, + New Quest / + New Epic, Disciplines column, discipline totals |
| **First action** | Complete the one quest |
| **Learns** | Quest completion → XP → level meter moves |

---

### Phase 1 — Small quest board (same day or next session)

| | |
|---|---|
| **Goal** | “I have a short, manageable board — not my whole life at once.” |
| **Assigned quests** | 3 Side quests (mixed categories; no Epic required) |
| **Disciplines** | 0 |
| **Show** | Current Quests only; category labels on cards (not filters) |
| **Hide** | Same as Phase 0 |
| **Assignment rules** | All unlock at level 1; all `assigned`; completable within a few days; no Main/Boss |
| **Learns** | Multiple quests, same mechanic |

---

### Phase 2 — First daily habit (day 2–3)

| | |
|---|---|
| **Goal** | “Some things reset every day; they affect how I feel, not just XP.” |
| **Assigned quests** | 3 Side (unchanged) |
| **Disciplines** | 1 `check` discipline with **positive** stat only (e.g. exercise, breakfast, morning walk) |
| **Show** | Disciplines column with single card; brief vitals feedback after first check |
| **Hide** | “See all Disciplines”; yes/no and streak cards; full discipline list |
| **Learns** | Daily loop ≠ quest loop; HP/Mana as vitals, not punishment |

**Suggested graduation trigger:** First discipline checked at least once.

---

### Phase 3 — Vitals as feedback (after ~3 discipline check-ins)

| | |
|---|---|
| **Goal** | “My choices shape HP/Mana — gently.” |
| **Assigned quests** | 3–5 Side |
| **Disciplines** | 2–3 total (mostly positive checks); optional one `yes-no` with clear framing |
| **Show** | Discipline header totals (HP/Mana net); up to 3 cards |
| **Hide** | Streak disciplines; full list; stacking multiple punitive cards |
| **Learns** | Ongoing disciplines vs one-off quests; choice on yes/no |

**Suggested graduation trigger:** 3+ discipline interactions (any kind).

---

### Phase 4 — The wider world (after first quest batch mostly done)

| | |
|---|---|
| **Goal** | “There’s more to explore, but I’m not dumped into all of it.” |
| **Assigned quests** | 5 + browse pool |
| **Disciplines** | 3–5 |
| **Show** | **All Quests** tab; list sorted by unlock level then XP; only quests at or below player level (+ assigned set) |
| **Hide** | Category multi-filter; Epic panel as filter; + New Quest / + New Epic |
| **Learns** | Current = doing now; All = what exists; exploration without commitment |

**Suggested graduation trigger:** 3+ quests completed (lifetime).

---

### Phase 5 — Campaigns (after ~1–2 weeks or ~level 3–4)

| | |
|---|---|
| **Goal** | “Quests can belong to a bigger story.” |
| **Assigned quests** | Prior set + **1 Epic bundle** (2–3 assigned quests sharing one Epic) |
| **Disciplines** | 5–7 |
| **Show** | Epics panel (quote + **one** Epic card first, then full grid); Epic name on quest cards; Epic card as **single-dimension filter** |
| **Hide** | + New Epic until Phase 7; empty Epics (0 quests) must never appear |
| **Learns** | Epics as themes; filtering as a lens, not a requirement |

**Suggested graduation trigger:** 1+ quest in onboarding Epic completed, or player reaches level 3.

---

### Phase 6 — Full discipline practice (week 2–3)

| | |
|---|---|
| **Goal** | “Daily life has texture — gains and tradeoffs.” |
| **Assigned quests** | Player-driven + browse |
| **Disciplines** | Full list (expand from preview to all) |
| **Show** | All discipline kinds; introduce **streak** last; mix positive and negative deltas |
| **Constraint** | No more than **one punitive discipline** in the first week of this phase |
| **Learns** | System can hold difficulty because core loops are trusted |

**Suggested graduation trigger:** 5+ distinct discipline days logged, or 7 calendar days in app.

---

### Phase 7 — Operator mode (graduated / ongoing)

| | |
|---|---|
| **Goal** | Self-directed use of the full system. |
| **Show** | All Epics; category multi-filter; + New Quest; + New Epic; Main and Boss tiers via natural unlock level; assign from Available or create new |
| **Learns** | Player runs the game |

**Entry:** Auto after Phase 6 triggers, or explicit **“I’ve used this before — skip to full app”** for returning users.

---

## Starting numbers (quick reference)

| Phase | Assigned quests | Disciplines | UI surface |
|-------|-----------------|-------------|------------|
| 0 | 1 Side | 0 | Current only |
| 1 | 3 Side | 0 | Current only |
| 2 | 3 Side | 1 check | Current + 1 discipline |
| 3 | 3–5 Side | 2–3 | + yes/no optional |
| 4 | 5 + browse | 3–5 | + All Quests (level-gated) |
| 5 | + 1 Epic bundle | 5–7 | + Epics panel |
| 6 | player-driven | all | full Disciplines |
| 7 | player-driven | all | full app |

---

## First-session experience script (behaviour, not copy)

1. Land on character + **one** quest.
2. Complete it → XP / level feedback.
3. Two more quests appear: “Your board for this week.”
4. **Next day:** one discipline lights up — “This one’s daily.”
5. **After a few days:** All Quests tab unlocks — “There’s a whole quest journal.”
6. **After first Epic quest done:** Epic card highlights — “This belongs to a campaign.”

---

## Anti-patterns (do not do early)

- Assign **Main/Boss** quests in week one — tier styling implies weight before Side quests are understood.
- Show **category or Epic filters** before single-list browsing feels natural.
- Lead with **negative disciplines** — establish “building vitals” first, then cost.
- Show **empty Epics** (0 quests) — always seed one Epic with assigned quests when Epics unlock.
- **Modal tutorial decks** for rules — guide first actions on real cards instead.
- Dump **full quest inventory** as assigned — use `assigned` vs `available` and level gates.

---

## Implementation notes (for when ready)

### State shape (proposed)

```typescript
type OnboardingPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface OnboardingState {
  phase: OnboardingPhase;
  /** ISO date onboarding started — for day-based triggers later */
  startedAt: string;
  /** Explicit skip for returning users */
  skipped: boolean;
  /** Counters for graduation (optional; can derive from game state) */
  questsCompletedAtPhaseStart?: number;
}
```

Persist in `localStorage` alongside game state (e.g. `questlife.onboarding.v1`).

### Derived policy (not duplicate data)

From `phase` + full `quests` / `disciplines` arrays, compute:

- `visibleQuests` — filter by assignment, unlock level, phase allow-list
- `visibleDisciplines` — slice or filter by id/kind
- `enabledFeatures` — flags e.g. `{ allQuestsTab, epicsPanel, categoryFilter, epicFilter, newQuest, newEpic, seeAllDisciplines }`

### Graduation triggers (defaults)

| From → To | Trigger |
|-----------|---------|
| 0 → 1 | First quest completed |
| 1 → 2 | 2+ quests completed OR next calendar day |
| 2 → 3 | First discipline checked |
| 3 → 4 | 3+ discipline interactions |
| 4 → 5 | 3+ quests completed (lifetime) |
| 5 → 6 | 1+ Epic quest completed OR level ≥ 3 |
| 6 → 7 | 5+ discipline days OR 7 days since `startedAt` |

Triggers should be tunable constants. Prefer deriving counts from existing `GameState` where possible.

### UI integration points

- `App.tsx` — tab visibility, column layout, which panel mounts
- `CharacterHeader` — defer + New Quest until phase 7
- `EpicsPanel` — defer until phase 5; single-Epic mode before full grid
- `CategoryFilter` — defer until phase 7 (or read-only labels in 4–6)
- `useGame` / quest lists — onboarding does not replace reducer; only filters what renders

### Daily quote rotation

When onboarding moves to daily quote (post-onboarding polish), swap `getSessionQuote()` for `getDailyQuote(date)` — see `src/data/quotes.ts`. Onboarding phases are orthogonal to quote selection.

### Returning users

Offer once at Phase 0: **“Start fresh”** vs **“I know this — full app”** → sets `phase: 7`, `skipped: true`.

---

## Open questions (decide before build)

- [ ] Should phase 4 **auto-assign** one quest from Available when All Quests unlocks, or leave assignment entirely to the player?
- [ ] Fixed onboarding quest ids in data vs dynamic “pick first N Side quests at level 1”?
- [ ] Celebrate phase transitions (toast, modal, subtle banner) or silent unlock?
- [ ] Reset onboarding on game state reset, or persist graduation permanently?

---

## Related files (current codebase)

| Area | Path |
|------|------|
| Quest model & status | `src/domain/quest.ts` |
| Discipline kinds | `src/domain/discipline.ts` |
| Game state & persistence | `src/state/game.ts`, `src/state/useGame.ts` |
| Main layout & tabs | `src/App.tsx` |
| Epics & quote | `src/components/epic/EpicsPanel.tsx`, `src/data/quotes.ts` |
| Class sort & mentor | [`docs/class-sorting-and-mentor-matching.md`](./class-sorting-and-mentor-matching.md) |

---

*Last updated: onboarding spec codified from product design session. Class sort & mentor matching documented separately.*
