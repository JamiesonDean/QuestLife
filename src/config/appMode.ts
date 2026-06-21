/**
 * App mode — set at build time via VITE_APP_MODE.
 *
 * - **owner** — local private instance (data in gitignored `private/`). Not deployed.
 * - **public** — shared demo: Morgan + mentor intake only, session-only storage.
 *
 * Local dev: create `.env.local` with `VITE_APP_MODE=owner` (do not commit).
 */
export type AppMode = "owner" | "public";

export const APP_MODE: AppMode =
  import.meta.env.VITE_APP_MODE === "owner" ? "owner" : "public";

export const IS_OWNER_MODE = APP_MODE === "owner";

/** Public demo resets on reload; owner persists to localStorage. */
export const SESSION_ONLY_STORAGE = !IS_OWNER_MODE;
