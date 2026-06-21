/**
 * An Epic is a named campaign that groups related quests across tiers. Quests
 * opt in by setting `quest.epic` to the epic's `name` string.
 */
export interface Epic {
  /** Must match `Quest.epic` exactly. */
  name: string;
  /** One-line flavour description shown on the Epic Card. */
  description: string;
}

/** Trim and validate fields; throws if name is empty or duplicate. */
export function createEpic(
  name: string,
  description: string,
  existingNames: Set<string>,
): Epic {
  const trimmedName = name.trim();
  const trimmedDescription = description.trim();

  if (!trimmedName) {
    throw new Error("Epic name is required.");
  }

  if (existingNames.has(trimmedName.toLowerCase())) {
    throw new Error("An epic with this name already exists.");
  }

  return { name: trimmedName, description: trimmedDescription };
}
