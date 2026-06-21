# QuestLife — Class Sorting & Mentor Matching

> **Status:** Spec only — not yet implemented.  
> **Purpose:** Determine a player’s **motivation profile** accurately enough to assign a **Mentor voice** that speaks to their levers — then run intake and onboarding through that relationship.  
> **Related:** [`onboarding.md`](./onboarding.md) (progressive reveal after seeding), intake flows (conversation / upload / manual — to be spec’d separately).

---

## Design intent

**Class is not cosplay.** It is a compressed label on a **motivation profile**:

- How they prefer to be spoken to  
- What rewards they actually chase  
- What unsticks them when blocked  
- What makes them quit (overload, vagueness, shame, visibility)

**Mentor** is the trusted confidant who delivers intake, nudges, and reflection in a voice matched to that profile.

**Public frame:** “Find your class” (RPG, identity, fun).  
**Internal frame:** “Estimate motivation profile → assign mentor config.”

**Accuracy bar:** Good enough to pick the right mentor tone and starter assignments; **refine with behavior** after ~2 weeks. Not a permanent clinical diagnosis.

---

## Player journey (where this sits)

```text
Welcome
  → Class sort (~12 questions, 3 min)
  → Meet your Mentor (profile reflection + confirm/override)
  → Intake (conversation default | upload | manual)
  → Review & seed (StarterPack)
  → Onboarding Phase 0–7 (see onboarding.md)
```

Class sort **must precede** intake so the same interview beats use the correct mentor voice pack.

---

## Psychological foundations

Use these as **design inputs**, not medical claims.

| Framework | Authors / lineage | Use in QuestLife |
|-----------|-------------------|------------------|
| **Self-Determination Theory** | Deci & Ryan | Levers: autonomy, competence, relatedness — what mentor emphasizes |
| **Regulatory Focus Theory** | Higgins | Promotion (gains, ideals) vs prevention (security, duties) — framing of quests & nudges |
| **Social motives** | McClelland | Achievement, affiliation, power — praise and pressure that land |
| **Basic values** | Schwartz | What “stepping up” means (achievement, self-direction, security, benevolence…) |
| **RIASEC interests** | Holland | Builder / scholar / expressor / people / leader / organizer — method preference |
| **CliftonStrengths domains** | Gallup (product parallel) | Executing, Influencing, Relationship Building, Strategic Thinking — dual-class intuition |
| **Motivational Interviewing** | Miller & Rollnick | Blockers/resistance beats — ambivalence, not shame |
| **Implementation intentions** | Gollwitzer; Locke & Latham | Turn answers into specific assigned quests |

**Avoid as primary measurement:** fixed Enneagram/Jung types, learning-styles sorting, single self-label questions (“I’m a warrior”).

---

## Archetypes (measurement layer)

Five mentor **archetypes** under the hood. RPG **classes** are presentation skins.

| Archetype | Example RPG classes | Core drive | Mentor emphasis |
|-----------|---------------------|------------|-----------------|
| **Veteran** | Warrior, Fighter | Prove capacity under pressure | Direct accountability, honor, limits |
| **Sage** | Mage, Wizard | Understand and master | Depth, patience, one thread |
| **Master** | Artificer, (craft Rogue) | Build systems, finish, optimize | Bench clarity, process, scope |
| **Guide** | Bard, Ranger, Druid | Meaning, identity, aligned life | Story, values, how the chapter reads |
| **Commander** | Paladin, Leader | Impact, rank, responsibility | Strategy, capacity, campaign map |

**Dual class:** two archetypes score within **15 points** (see scoring). Example: Master primary + Guide secondary → “Artificer / Bard” in UI.

---

## Domain schema (proposed)

### `MotivationProfile`

```typescript
type ArchetypeId = "veteran" | "sage" | "master" | "guide" | "commander";

type LeverId = "autonomy" | "competence" | "relatedness" | "accountability" | "purpose";

type RegulatoryFocus = "promotion" | "prevention" | "mixed";

type ResistancePattern =
  | "undefined_scope"      // too vague → shrink quests
  | "visibility"           // exposure / conflict → alliance framing
  | "competence_fear"        // not ready → private log, smaller steps
  | "administrative_drag"    // boring but necessary → Keep Management tone
  | "emotional_load";        // gentler commission language

interface ArchetypeScores {
  veteran: number;   // 0–100 normalized
  sage: number;
  master: number;
  guide: number;
  commander: number;
}

interface LeverScores {
  autonomy: number;
  competence: number;
  relatedness: number;
  accountability: number;
  purpose: number;
}

interface MotivationProfile {
  archetypes: ArchetypeScores;
  primary: ArchetypeId;
  secondary: ArchetypeId | null;
  levers: LeverScores;
  topLever: LeverId;
  regulatoryFocus: RegulatoryFocus;
  resistancePattern: ResistancePattern | null;
  /** 0–1; low = show wider confirm UI */
  confidence: number;
  /** Player-facing RPG labels derived from primary + secondary */
  displayClass: string; // e.g. "Artificer / Bard"
}
```

### `PlayerClass` (presentation)

```typescript
interface PlayerClass {
  id: string;              // e.g. "artificer", "bard_artificer"
  label: string;           // "Artificer / Bard"
  primaryArchetype: ArchetypeId;
  secondaryArchetype: ArchetypeId | null;
  blurb: string;           // One line for character header / identity
}
```

### `Mentor`

```typescript
interface MentorVoiceRules {
  /** Short bullets for AI/copy generation */
  tone: string[];          // e.g. "practical", "respects craft", "no fluff"
  avoid: string[];         // e.g. "mystic vagueness", "drill-sergeant shame"
  praiseStyle: string;     // e.g. "names the finished thing"
  pushbackStyle: string;   // e.g. "overload → cut scope"
}

interface MentorBeatTemplates {
  /** Keys match intake beats; values are template strings with {placeholders} */
  arrival: string;
  campaigns: string;
  thisWeek: string;
  hazards: string;
  unclaimed: string;
  daily: string;
  longMarch: string;
  close: string;
}

interface Mentor {
  id: string;
  name: string;            // e.g. "Edda Forgehand"
  title: string;           // e.g. "Master of the Guild Bench"
  archetype: ArchetypeId;
  setting: string;         // e.g. "workshop", "training_yard", "tower_study"
  voice: MentorVoiceRules;
  beats: MentorBeatTemplates;
  /** Optional flavor when secondary archetype is present */
  secondaryFlavor?: Partial<MentorBeatTemplates>;
}
```

### `MentorAssignment`

```typescript
interface MentorAssignment {
  mentorId: string;
  profile: MotivationProfile;
  /** Player confirmed or overrode */
  confirmedAt: string;     // ISO timestamp
  overridden: boolean;
  manualArchetype?: ArchetypeId; // if player picked mentor directly
}
```

**Persistence key (proposed):** `questlife.profile.v1` alongside `questlife.state.v1`.

---

## Class sort — question bank (v1)

**Format rules:**

- 12 questions, ~3 minutes  
- **Forced choice** (one option per question) — ipsative scoring  
- No question mentions RPG class names  
- Mentor intro frames it: *“Before I speak to you properly, I need to know what kind of fighter you already are.”*

---

### Q1 — Overload impulse (primary archetype signal)

*When you're overloaded, which impulse is **strongest**?*

| Option | Archetype | Points |
|--------|-----------|--------|
| A. Cut scope until the system is workable again | Master | +3 Master |
| B. Push through — you'll rest later | Veteran | +3 Veteran |
| C. Reconnect to why it matters; talk it through | Guide | +3 Guide |
| D. Step back until you see the whole pattern | Sage | +3 Sage |
| E. Reprioritize: decide what drops for everyone | Commander | +3 Commander |

---

### Q2 — Free day (RIASEC-style)

*You finally have a free day with no obligations. You're **most satisfied** if you:*

| Option | Archetype | Points |
|--------|-----------|--------|
| A. Finish something concrete you've been building | Master | +2 Master |
| B. Train, move, or tackle one hard physical/challenge task | Veteran | +2 Veteran |
| C. Go deep on a subject that fascinates you | Sage | +2 Sage |
| D. Make or share something expressive (write, perform, create) | Guide | +2 Guide |
| E. Advance a project that increases your influence or position | Commander | +2 Commander |

---

### Q3 — Unstick lever (top lever)

*When you've been stuck for a week, what **most often** breaks the logjam?*

| Option | Lever | Points |
|--------|-------|--------|
| A. Someone I respect expecting an update | accountability | +3 accountability |
| B. A clearer plan or smaller first step | competence | +3 competence |
| C. Remembering who this is for | purpose | +3 purpose |
| D. Understanding the problem deeply enough | competence | +2 competence, +1 autonomy |
| E. A real deadline or consequence | accountability | +2 accountability, +1 prevention |
| F. Permission to do it my way | autonomy | +3 autonomy |
| G. A conversation with someone who gets it | relatedness | +3 relatedness |

---

### Q4 — Regulatory focus (praise)

*Which praise would hit **harder** right now?*

| Option | Regulatory focus | Points |
|--------|------------------|--------|
| A. "That opened a door you didn't have before." | promotion | +3 promotion |
| B. "You prevented a disaster nobody else saw." | prevention | +3 prevention |
| C. Both land equally | mixed | +2 promotion, +2 prevention |

---

### Q5 — “Step up” definition (values → archetype)

*Stepping up to the next level, for you, **mostly** means:*

| Option | Archetype / note | Points |
|--------|------------------|--------|
| A. More impact and influence | Commander | +3 Commander |
| B. More craft — finished, excellent work | Master | +3 Master |
| C. More depth and real expertise | Sage | +3 Sage |
| D. Living more as the person you mean to be | Guide | +3 Guide |
| E. Proven capacity when the pressure is on | Veteran | +3 Veteran |

---

### Q6 — Resistance pattern

*The tasks you **avoid** usually feel like:*

| Option | Resistance pattern | Points |
|--------|-------------------|--------|
| A. Might expose that I'm not ready | competence_fear | pattern tag |
| B. Too messy or undefined to start | undefined_scope | pattern tag; +1 Master |
| C. Conflict, visibility, or judgment | visibility | pattern tag; +1 Guide |
| D. Boring but necessary | administrative_drag | pattern tag; +1 Master |
| E. Emotionally loaded | emotional_load | pattern tag; +1 Guide |

---

### Q7 — Preferred mentor energy

*You'd rather a mentor who:*

| Option | Archetype lean | Points |
|--------|----------------|--------|
| A. Challenges you directly and keeps the line short | Veteran | +2 Veteran |
| B. Helps you see the deeper pattern | Sage | +2 Sage |
| C. Organizes the bench and cuts scope | Master | +2 Master |
| D. Connects work to who you're becoming | Guide | +2 Guide |
| E. Thinks in campaigns and capacity | Commander | +2 Commander |

---

### Q8 — Feedback style

*Feedback lands best when it's:*

| Option | Voice calibration | Use |
|--------|-------------------|-----|
| A. Blunt and brief | Veteran voice | `voice.tone` |
| B. Precise and thoughtful | Sage voice | |
| C. Practical and actionable | Master voice | |
| D. Warm and meaning-focused | Guide voice | |
| E. Big-picture and strategic | Commander voice | |

*(Maps to mentor `voice` config; tie-breaker only — +1 to matching archetype.)*

---

### Q9 — Risk posture (promotion / prevention balance)

*Right now you'd rather:*

| Option | Regulatory focus | Points |
|--------|------------------|--------|
| A. Make a bold move on something that could level you up | promotion | +2 promotion |
| B. Secure what's already working before adding more | prevention | +2 prevention |
| C. Balance both equally | mixed | +1 each |

---

### Q10 — Energy source (discipline design hint)

*Your best weeks usually have:*

| Option | Hint for StarterPack | Points |
|--------|---------------------|--------|
| A. A consistent morning ritual | → check discipline, HP | +1 Master |
| B. Long uninterrupted deep work | → fewer assigned quests | +1 Sage |
| C. Meaningful time with key people | → Alliances-weighted epics | +1 Guide, +1 relatedness |
| D. Visible output shipped | → Crafting / Guild quests | +1 Master, +1 competence |
| E. Clear wins on hard commitments | → accountability framing | +1 Veteran |

*(Stored in profile meta for intake; light archetype points.)*

---

### Q11 — Confirming trade-off (second archetype signal)

*When two projects compete, you usually choose:*

| Option | Archetype | Points |
|--------|-----------|--------|
| A. The one you can **finish** properly | Master | +2 Master |
| B. The one with the **hardest** standard | Veteran | +2 Veteran |
| C. The one that **teaches** you most | Sage | +2 Sage |
| D. The one that **matters** to your story | Guide | +2 Guide |
| E. The one that **moves the needle** on your goals | Commander | +2 Commander |

---

### Q12 — Self-check (not scored; UI only)

*Display computed result. No points.*

**Copy:**  
“We read you as **{displayClass}** — {oneSentenceReflection}. Does this feel right?”

- **Yes** → lock profile, assign mentor  
- **Adjust** → pick primary archetype / mentor from 5 cards (override)  
- **Not sure** → use result but flag `confidence *= 0.7`

---

## Scoring rubric

### Archetype totals

1. Sum points per archetype from Q1, Q2, Q5, Q7, Q8 (+1), Q10 (+1), Q11.  
2. Normalize to 0–100: `(score / maxPossible) * 100` per archetype.  
3. **Primary** = highest. **Secondary** = second highest if within **15 points** of primary; else `null`.

### Dual-class display labels

| Primary | Secondary | Display class (example) |
|---------|-----------|------------------------|
| Master | Guide | Artificer / Bard |
| Master | null | Artificer |
| Veteran | Commander | Warrior / Paladin |
| Sage | Master | Mage / Artificer |
| Guide | Sage | Bard / Mage |
| Commander | Veteran | Paladin / Warrior |

*(Full mapping table lives in `src/domain/class.ts` when implemented — keep presentation separate from archetype ids.)*

### Lever totals

Sum Q3 (+ Q10 relatedness if applicable). Highest = `topLever`.

### Regulatory focus

Sum promotion vs prevention from Q4, Q9.  
- promotion ≥ prevention + 3 → `promotion`  
- prevention ≥ promotion + 3 → `prevention`  
- else → `mixed`

### Confidence

```text
base = (primaryScore - secondaryScore) / primaryScore   // separation
if secondary null: base = min(1, primaryScore / 100)
if Q12 adjusted manually: confidence = 1.0, overridden = true
if Q12 "not sure": confidence *= 0.7
clamp 0.4–1.0
```

Low confidence → wider confirm UI; offer mentor picker.

### Resistance pattern

Single tag from Q6. Drives mentor **pushback** templates and intake tone for “unclaimed bounties” beat.

---

## Mentor matching

### Base rule

```text
mentorId = MENTORS[profile.primary].id
if profile.secondary:
  apply MENTORS[profile.primary].secondaryFlavor[profile.secondary]
apply regulatoryFocus overlay (promotion vs prevention phrasing)
apply topLever overlay (emphasis in beats)
apply resistancePattern overlay (unclaimed + hazards beats)
```

### Mentor roster (v1 — one per archetype)

| Archetype | Mentor name | Title | Setting |
|-----------|-------------|-------|---------|
| Veteran | **Kael** | Weaponmaster Emeritus | Training yard |
| Sage | **Lyra** | Keeper of the Inner Library | Tower study |
| Master | **Edda Forgehand** | Guild Benchmaster | Workshop |
| Guide | **Soren Ashwind** | Wandering Laureate | Roadside fire |
| Commander | **Marshal Venn** | Strategist of the War Table | War room |

Player-facing: always **“Your Mentor”** + name; archetype can stay hidden.

### Sample beat templates — Master (Edda)

| Beat | Template |
|------|----------|
| arrival | “Your bench works. I've seen what you've built. Tell me what you're building toward **next**.” |
| campaigns | “Name the **systems** worth finishing — not tasks yet, **campaigns**.” |
| thisWeek | “Three projects on the bench. **No more.** Which three?” |
| hazards | “What's clogging the workshop — time, tools, or unclear scope?” |
| unclaimed | “What won't you put on the schematic though it counts? **No judgment.** Encumbrance is real.” |
| daily | “What **maintenance ritual** keeps the machine true?” |
| longMarch | “Anything that only pays off after **consecutive days**?” |
| close | “Here's your opening loadout. **Edit the schematic** — then we work.” |

### Secondary flavor — Master + Guide (Artificer / Bard)

Append or swap lines on **campaigns** and **close**:

- campaigns: “…and **how do you want this chapter to read** when it's done?”  
- close: “…the log should match the **legend you're actually living**.”

### Regulatory focus overlays

| Focus | Phrasing shift |
|-------|----------------|
| **promotion** | “claim”, “next rank”, “open the door”, “level up” |
| **prevention** | “hold the line”, “protect what you've built”, “don't drop the ball” |
| **mixed** | blend both sparingly |

### Lever overlays (mentor emphasis)

| Top lever | Mentor behavior |
|-----------|-----------------|
| **accountability** | Name deadlines; shorter assigned list; expect check-ins in copy |
| **competence** | Smallest first step; Side quests; celebrate completion |
| **autonomy** | Offer choices; avoid prescriptive “must” |
| **relatedness** | Alliances category; “who this is for” |
| **purpose** | Epic descriptions in player's words; meaning-first |

### Resistance overlays (unclaimed beat)

| Pattern | Mentor line direction |
|---------|----------------------|
| competence_fear | Shrink quest; “research” not “perform”; private log |
| undefined_scope | “We break it until the first step is obvious.” |
| visibility | Alliance framing; “low-stakes” commission language |
| administrative_drag | Keep Management; no epic poetry; matter-of-fact |
| emotional_load | Gentler verbs; no “failure”; “when you're ready” |

---

## Confirm screen (Q12)

**Show:**

1. Display class string (e.g. **Artificer / Bard**)  
2. Mentor portrait / silhouette + name + title  
3. **Reflection** (generated from profile, one sentence):  
   - *“You're a builder who cares how the story lands. I'll keep your bench clear and your campaigns honest.”*  
4. Three actions: **That's me** | **Choose differently** | **Not sure**

**Choose differently:** 5 mentor cards (archetype summary, not stats). Sets `overridden: true`, `manualArchetype`, `confidence: 1`.

**Not sure:** accept computed mentor, `confidence *= 0.7`, offer change in Settings later.

---

## Behavioral recalibration (post–week 2)

Re-score or suggest mentor change when app behavior **contradicts** profile:

| Signal | Inference | Suggested action |
|--------|-----------|----------------|
| Many quests created, few completed | Fantasy Commander/Guide > execution Master | Suggest Master-leaning mentor or fewer assignments |
| Only check disciplines, no quests | Conscientious Maintainer | More Master/Veteran push on commissions |
| High completion, avoids disciplines | Quest sprinter | Veteran accountability on daily rituals |
| All Alliances / Lore, no Keep Management | Guide-heavy | Mentor already likely Guide; add admin Side quest |

**UX:** subtle prompt, not forced: *“Your deeds read more Sage than Warrior — want your Mentor to adjust?”*

Recalibration updates `MotivationProfile.behavioralNotes` only until player confirms.

---

## What we do **not** show the player

- Raw archetype scores (0–100)  
- Lever bar charts in v1  
- “Your Enneagram type is…”  
- Clinical or HR language  

---

## Implementation checklist

- [ ] `src/domain/motivation.ts` — `MotivationProfile`, scoring functions  
- [ ] `src/domain/class.ts` — display labels, dual-class map  
- [ ] `src/domain/mentor.ts` — `Mentor` roster + beat templates + overlays  
- [ ] `src/data/classSortQuestions.ts` — question bank  
- [ ] `src/components/onboarding/ClassSort.tsx` — 12-step flow  
- [ ] `src/components/onboarding/MeetYourMentor.tsx` — confirm / override  
- [ ] Persist `questlife.profile.v1`  
- [ ] Wire `CharacterHeader.characterClass` from `displayClass`  
- [ ] Intake conversation consumes `MentorAssignment` (separate spec)  
- [ ] Settings: “Change mentor / class”  
- [ ] Week-2 recalibration hook (optional v1.1)

---

## Open questions

- [ ] Allow **skip class sort** for returning users → default mentor + change in Settings?  
- [ ] **AI-generated reflection** on Q12 vs static template per primary/secondary pair?  
- [ ] **Avatar** per mentor or single silhouette system-wide in v1?  
- [ ] Should **secondary archetype** affect gameplay (XP, stats) or **voice only**?  
  - **Recommendation:** voice only in v1; mechanics stay class-agnostic.

---

## Cross-references

| Doc | Relationship |
|-----|--------------|
| [`onboarding.md`](./onboarding.md) | Starts **after** StarterPack seed; Phase 0 assumes class + mentor already chosen |
| Intake flows (TBD) | Same beats for all paths; copy from `Mentor.beats` |
| `src/domain/player.ts` | Level/XP unchanged by class in v1 |

---

*Last updated: class sorting & mentor matching spec codified from product design session.*
