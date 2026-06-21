import type { Difficulty } from "./difficulty.ts";
import type { IntakeRatedItem } from "./intake.ts";

const DIFFICULTY_MARKERS: { pattern: RegExp; difficulty: Difficulty }[] = [
  { pattern: /\b(legendary|life.?changing|years?|enormous)\b/i, difficulty: "legendary" },
  { pattern: /\b(heavy|hard|big|major|daunting|brutal|difficult)\b/i, difficulty: "heavy" },
  { pattern: /\b(quick|small|easy|light|minor|simple|trivial)\b/i, difficulty: "light" },
];

/** Strip leading list markers and parenthetical difficulty hints. */
function cleanItemTitle(raw: string): string {
  return raw
    .replace(/^[-•*]\s*/, "")
    .replace(/\s*[\(\—–-]\s*(light|moderate|heavy|legendary|easy|hard)\s*\)?\s*$/i, "")
    .trim();
}

export function inferDifficulty(text: string): Difficulty {
  for (const { pattern, difficulty } of DIFFICULTY_MARKERS) {
    if (pattern.test(text)) return difficulty;
  }
  return "moderate";
}

function splitProseList(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const byLine = trimmed
    .split(/\n+/)
    .map(cleanItemTitle)
    .filter(Boolean);

  if (byLine.length > 1) return byLine;

  const single = byLine[0] ?? trimmed;
  if (single.includes(";")) {
    return single.split(";").map(cleanItemTitle).filter(Boolean);
  }
  if (/\s+and\s+/i.test(single)) {
    return single.split(/\s+and\s+/i).map(cleanItemTitle).filter(Boolean);
  }
  if (single.includes(",")) {
    const parts = single.split(",").map(cleanItemTitle).filter(Boolean);
    if (parts.length > 1) return parts;
  }

  return [cleanItemTitle(single)];
}

/** Turn a conversational reply into rated intake items. */
export function parseItemsFromProse(text: string): IntakeRatedItem[] {
  const seen = new Set<string>();
  const items: IntakeRatedItem[] = [];

  for (const part of splitProseList(text)) {
    const title = cleanItemTitle(part);
    if (!title) continue;
    const key = title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ title, difficulty: inferDifficulty(part) });
  }

  return items;
}
