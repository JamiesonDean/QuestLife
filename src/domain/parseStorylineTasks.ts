import type { Scale } from "./quest.ts";

export interface ParsedStorylineTask {
  title: string;
  scale: Scale;
  unlockLevel: number;
  xp: number;
}

const LIST_PREFIX =
  /^\s*(?:[-*•●◦▪▫–—]|\d+[\.)]|[a-z][\.)])\s+/i;

const SMALL_TASK =
  /\b(write down|list|note|ask|email|call|schedule|book|research|read|find|pick|choose|draft|outline|plan|set up|sign up|download|organize|sort|clean|tidy|check|review|reflect|journal|track|measure|10 min|15 min|quick|small|first step)\b/i;

const LARGE_TASK =
  /\b(build|create|launch|deliver|ship|complete|finish|implement|design|develop|produce|publish|present|submit|run|lead|host|negotiate|sign|close|hire|move|relocate|graduate|promot|certif|pass|achieve|accomplish|establish|transform)\b/i;

const OUTCOME_TASK =
  /\b(finally|ultimate|end goal|final|outcome|result|get promoted|become|land the|win the|reach|attain|fulfil|fulfill)\b/i;

/** Strip bullets, numbering, and checkbox markers from a task line. */
export function cleanStorylineTaskLine(raw: string): string {
  let line = raw.trim();
  while (LIST_PREFIX.test(line)) {
    line = line.replace(LIST_PREFIX, "").trim();
  }
  return line
    .replace(/\s*[\(\—–-]\s*(light|moderate|heavy|legendary|easy|hard|minor|major|boss)\s*\)?\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupeKey(title: string): string {
  return title.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
}

/** First letter upper-case; rest unchanged so acronyms and phrasing stay intact. */
export function toSentenceCaseTitle(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function maybeSplitCommaList(line: string): string[] {
  if (!line.includes(",")) return [line];
  const parts = line.split(",").map(cleanStorylineTaskLine).filter(Boolean);
  if (parts.length < 2) return [line];
  const avgLen = parts.reduce((sum, part) => sum + part.length, 0) / parts.length;
  if (avgLen > 90) return [line];
  return parts;
}

function splitNumberedBlock(text: string): string[] | null {
  const matches = [...text.matchAll(/(?:^|\s)(\d+[\.)])\s+/g)];
  if (matches.length < 2) return null;

  const parts = text
    .split(/(?:^|\s)\d+[\.)]\s+/)
    .map(cleanStorylineTaskLine)
    .filter(Boolean);

  return parts.length >= 2 ? parts : null;
}

function splitSingleBlock(text: string): string[] {
  const numbered = splitNumberedBlock(text);
  if (numbered) return numbered;

  if (text.includes(";")) {
    const parts = text.split(";").map(cleanStorylineTaskLine).filter(Boolean);
    if (parts.length > 1) return parts;
  }

  if (text.includes(",")) {
    const parts = text.split(",").map(cleanStorylineTaskLine).filter(Boolean);
    if (parts.length > 1) return parts;
  }

  if (/\s+and then\s+/i.test(text)) {
    const parts = text.split(/\s+and then\s+/i).map(cleanStorylineTaskLine).filter(Boolean);
    if (parts.length > 1) return parts;
  }

  if (/\s+then\s+/i.test(text)) {
    const parts = text.split(/\s+then\s+/i).map(cleanStorylineTaskLine).filter(Boolean);
    if (parts.length > 1) return parts;
  }

  if (/\s+and\s+/i.test(text)) {
    const parts = text.split(/\s+and\s+/i).map(cleanStorylineTaskLine).filter(Boolean);
    if (parts.length > 1 && parts.every((part) => part.length <= 80)) return parts;
  }

  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(cleanStorylineTaskLine)
    .filter((part) => part.length >= 8);
  if (sentences.length > 1) return sentences;

  const cleaned = cleanStorylineTaskLine(text);
  return cleaned ? [cleaned] : [];
}

/** Split free-text task input into individual task titles. */
export function splitStorylineTasks(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const lines = trimmed
    .split(/\n+/)
    .flatMap((line) => maybeSplitCommaList(cleanStorylineTaskLine(line)))
    .map(cleanStorylineTaskLine)
    .filter(Boolean);

  const rawParts = lines.length > 1 ? lines : splitSingleBlock(trimmed);

  const seen = new Set<string>();
  const tasks: string[] = [];
  for (const part of rawParts) {
    const title = cleanStorylineTaskLine(part);
    if (!title || title.length < 2) continue;
    const key = dedupeKey(title);
    if (seen.has(key)) continue;
    seen.add(key);
    tasks.push(title);
  }

  return tasks;
}

function inferTaskWeight(title: string): "small" | "medium" | "large" {
  if (SMALL_TASK.test(title)) return "small";
  if (LARGE_TASK.test(title) || OUTCOME_TASK.test(title)) return "large";
  if (title.length <= 36) return "small";
  if (title.length >= 64) return "large";
  return "medium";
}

function profileForTask(
  title: string,
  index: number,
  total: number,
): Pick<ParsedStorylineTask, "scale" | "unlockLevel" | "xp"> {
  const isLast = index === total - 1;
  const isFirst = index === 0;
  const progress = total <= 1 ? 1 : index / (total - 1);
  const weight = inferTaskWeight(title);

  if (total === 1) {
    return { scale: "boss", unlockLevel: 5, xp: 100 };
  }

  if (isLast || OUTCOME_TASK.test(title)) {
    return {
      scale: "boss",
      unlockLevel: Math.min(10, 4 + Math.floor(total / 2)),
      xp: 100,
    };
  }

  if (isFirst || progress <= 0.3) {
    return {
      scale: "minor",
      unlockLevel: 1 + Math.min(2, index),
      xp: weight === "small" ? 10 : 15,
    };
  }

  if (progress >= 0.65 || weight === "large") {
    return {
      scale: "major",
      unlockLevel: Math.min(8, 3 + Math.floor(progress * 5)),
      xp: 50,
    };
  }

  if (weight === "small") {
    return {
      scale: "minor",
      unlockLevel: 2 + Math.floor(progress * 3),
      xp: 25,
    };
  }

  return {
    scale: "major",
    unlockLevel: 3 + Math.floor(progress * 4),
    xp: 40,
  };
}

/** Parse task prose and assign quest scale, unlock level, and XP for each item. */
export function parseStorylineTasks(text: string): ParsedStorylineTask[] {
  const titles = splitStorylineTasks(text);
  return titles.map((title, index) => ({
    title: toSentenceCaseTitle(title),
    ...profileForTask(title, index, titles.length),
  }));
}
