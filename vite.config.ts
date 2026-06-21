import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Owner data lives in ./private/ (gitignored — never pushed).
 * Public builds use empty catalogs + stubs only.
 */
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isOwnerBuild =
    command === "serve"
      ? (process.env.VITE_APP_MODE ?? env.VITE_APP_MODE ?? "owner") === "owner"
      : process.env.VITE_BUILD_OWNER === "true";

  const appMode = isOwnerBuild ? "owner" : "public";

  return {
    plugins: [react()],
    base: process.env.VITE_BASE_PATH ?? env.VITE_BASE_PATH ?? "/",
    define: {
      "import.meta.env.VITE_APP_MODE": JSON.stringify(appMode),
    },
    resolve: {
      alias: {
        "@questlife/catalog": path.resolve(
          __dirname,
          isOwnerBuild ? "private/catalog.ts" : "src/catalog/public.ts",
        ),
        "@questlife/ownerRegistry": path.resolve(
          __dirname,
          isOwnerBuild ? "private/registryOwner.ts" : "src/owner/registryOwner.stub.ts",
        ),
        "@questlife/epicIcons": path.resolve(
          __dirname,
          isOwnerBuild ? "private/epicIconConfigs.ts" : "src/assets/epicIconConfigs.public.ts",
        ),
        "@questlife/playerAvatar": path.resolve(
          __dirname,
          isOwnerBuild ? "private/playerAvatar.ts" : "src/assets/playerAvatar.public.ts",
        ),
      },
    },
  };
});
