/**
 * Banned substrings that must not appear in a public production bundle.
 * Run after `npm run build:public`.
 */
const BANNED = [
  "bahn-mi",
  "Jamieson",
  "jamieson",
  "dating profile",
  "Find Life Partner",
  "Fix Teeth",
  "cat play session",
  "rent increases",
  "Build Wealth",
  "Enter Leadership",
  "Vietnamese Porchetta",
];

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

function walk(dir) {
  const hits = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      hits.push(...walk(full));
    } else if (/\.(js|css|html|json)$/i.test(entry.name)) {
      const text = fs.readFileSync(full, "utf8");
      for (const needle of BANNED) {
        if (text.includes(needle)) {
          hits.push({ file: path.relative(distDir, full), needle });
        }
      }
    }
  }
  return hits;
}

if (!fs.existsSync(distDir)) {
  console.error("dist/ not found — run npm run build:public first.");
  process.exit(1);
}

const violations = walk(distDir);

if (violations.length > 0) {
  console.error("Public bundle contains owner-only data:\n");
  for (const { file, needle } of violations) {
    console.error(`  • "${needle}" in ${file}`);
  }
  process.exit(1);
}

console.log("Public bundle audit passed — no owner-only strings found.");
