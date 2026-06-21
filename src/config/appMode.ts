/**
 * App mode — set at build time via VITE_APP_MODE.
 *
 * - **owner** — local private instance (data in gitignored `private/`). Not deployed.
 * - **public** — shared demo for friends: Jules + mentor intake, persists in localStorage.
 *
 * Local dev: create `.env.local` with `VITE_APP_MODE=owner` (do not commit).
 */
export type AppMode = "owner" | "public";

export const APP_MODE: AppMode =
  import.meta.env.VITE_APP_MODE === "owner" ? "owner" : "public";

export const IS_OWNER_MODE = APP_MODE === "owner";

/** Persist character saves in localStorage (public + owner). */
export const SESSION_ONLY_STORAGE = false;
