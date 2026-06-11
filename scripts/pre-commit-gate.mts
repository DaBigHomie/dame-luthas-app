#!/usr/bin/env npx tsx
/**
 * Dame Luthas pre-commit quality gate (MALFIG G5 subset).
 * Invoked from .githooks/pre-commit
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

function run(cmd: string, label: string): void {
  console.log(`\n→ ${label}`);
  try {
    execSync(cmd, { cwd: ROOT, stdio: "inherit" });
  } catch {
    console.error(`\nFAILED: ${label}`);
    process.exit(1);
  }
}

const staged = execSync("git diff --cached --name-only", { encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

const touchesTs =
  staged.some((f) => f.endsWith(".ts") || f.endsWith(".tsx")) ||
  staged.some((f) => f.startsWith("src/") || f.startsWith("scripts/"));

if (!touchesTs) {
  console.log("Pre-commit gate: no TS changes — skip build gates");
  process.exit(0);
}

run("npx tsc --noEmit", "TypeScript");
run("npm run lint", "ESLint");

const parserChanged = staged.some((f) =>
  f.includes("parse-custom-menus") || f.includes("parse-widget-walk"),
);
if (parserChanged) {
  run("npm run wp:verify-custom-menus", "Custom menu walk");
}

const registryChanged = staged.some((f) => f.includes("widget-registry.ts"));
const auditPath = join(ROOT, "data/audit/source-audit.json");
if (registryChanged && existsSync(auditPath)) {
  run("npm run wp:verify-widget-census", "Widget census");
}

const touchesAssets =
  staged.some((f) => f.startsWith("public/assets/")) ||
  staged.some((f) => f.startsWith("src/content/")) ||
  staged.some((f) => f.startsWith("src/widgets/"));
if (touchesAssets && existsSync(join(ROOT, "data/extracted/converted-assets.json"))) {
  run("npm run assets:verify-bindings", "Asset bindings");
}

console.log("\nPre-commit gate passed.");
