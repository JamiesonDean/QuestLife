import { inferQuestCategory } from "./inferQuestCategory.ts";
import { parseStorylineTasks } from "./parseStorylineTasks.ts";
import { createQuest, type Quest } from "./quest.ts";

export interface StorylineQuestContext {
  storylineDescription?: string;
}

/** Parse a free-text task list into main-track quests linked to a Storyline. */
export function createQuestsForStoryline(
  tasksText: string,
  storylineName: string,
  existingIds: Set<string>,
  context: StorylineQuestContext = {},
): Quest[] {
  const parsed = parseStorylineTasks(tasksText);
  const quests: Quest[] = [];
  const ids = new Set(existingIds);

  for (const task of parsed) {
    try {
      const quest = createQuest(
        {
          title: task.title,
          scale: task.scale,
          track: "main",
          category: inferQuestCategory(task.title, {
            storylineTitle: storylineName,
            storylineDescription: context.storylineDescription,
          }),
          unlockLevel: task.unlockLevel,
          xp: task.xp,
          epic: storylineName,
        },
        ids,
      );
      quests.push(quest);
      ids.add(quest.id);
    } catch {
      // skip duplicate or invalid titles
    }
  }

  return quests;
}
