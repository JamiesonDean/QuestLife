#!/usr/bin/env node
/**
 * Check a live deployed URL for owner-only strings in JS assets.
 * Usage: node scripts/check-live.mjs https://your-site.pages.dev
 */
const BANNED = [
  "bahn-mi",
  "Jamieson",
  "dating profile",
  "Find Life Partner",
  "Vietnamese Porchetta",
];

const url = process.argv[2];
if (!url) {
  console.error("Usage: node scripts/check-live.mjs <site-url>");
  process.exit(1);
}

const base = url.replace(/\/$/, "");

const html = await fetch(base + "/").then((r) => r.text());
const jsMatch = html.match(/assets\/index-[\w-]+\.js/);
if (!jsMatch) {
  console.error("Could not find index-*.js in page HTML. Is this a QuestLife deploy?");
  process.exit(1);
}

const jsUrl = base + "/" + jsMatch[0];
const js = await fetch(jsUrl).then((r) => r.text());

console.log("Checking:", jsUrl);
let failed = false;
for (const needle of BANNED) {
  if (js.includes(needle)) {
    console.error("FAIL — found:", needle);
    failed = true;
  }
}

if (failed) {
  console.error("\nThis deploy still contains private data. Fix build settings and redeploy.");
  process.exit(1);
}

console.log("PASS — no private quest strings in the live JavaScript bundle.");
if (!html.includes("Public demo")) {
  console.warn("Note: demo banner not in HTML (may be rendered by React — check the page visually).");
}
