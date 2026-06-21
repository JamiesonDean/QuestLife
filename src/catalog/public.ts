import type { Discipline } from "../domain/discipline.ts";
import type { Epic } from "../domain/epic.ts";
import type { Quest } from "../domain/quest.ts";

/** Public demo builds ship empty shared catalogs — characters carry their own data. */
export const DEFAULT_QUESTS: Quest[] = [];
export const INITIAL_ASSIGNED_IDS: string[] = [];
export const DISCIPLINES: Discipline[] = [];
export const DEFAULT_EPICS: Epic[] = [];
