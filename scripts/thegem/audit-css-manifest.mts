#!/usr/bin/env npx tsx
/**
 * Audit The Gem CSS remix manifest vs local pilot stylesheets.
 */
import { loadLocalWpPublicPathEnv } from "../wp/lib/load-local-wp-env";

loadLocalWpPublicPathEnv();

import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  HOMEPAGE_ACTIVE_ANIMATIONS,
  HOMEPAGE_ANIMATION_WIDGET_COUNTS,
} from "@/features/thegem-remix/model/homepage-inventory";
import {
  THEGEM_REMIX_MANIFEST,
  getRemixProgress,
} from "@/features/thegem-remix/model/manifest";

function localWpContentRoot(): string | null {
  const publicPath = process.env.LOCAL_WP_PUBLIC_PATH?.trim();
  if (!publicPath) return null;
  return join(publicPath, "wp-content");
}

function pilotStylesheetExists(pilotPath: string): boolean {
  const root = localWpContentRoot();
  if (!root) return false;
  return existsSync(join(root, pilotPath));
}

const pilot = new Set(
  THEGEM_REMIX_MANIFEST.filter((e) => pilotStylesheetExists(e.pilotPath)).map(
    (e) => e.pilotPath,
  ),
);
const progress = getRemixProgress();

console.log("The Gem CSS Remix Manifest Audit\n");
console.log(`Manifest entries: ${progress.total}`);
console.log(
  `Status — pending: ${progress.pending} | in_progress: ${progress.inProgress} | remixed: ${progress.remixed} | verified: ${progress.verified}`,
);

const missingPilot = THEGEM_REMIX_MANIFEST.filter((e) => !pilot.has(e.pilotPath));
const availablePilot = THEGEM_REMIX_MANIFEST.filter((e) => pilot.has(e.pilotPath));

console.log(`\nPilot files present locally: ${availablePilot.length}/${progress.total}`);
if (missingPilot.length) {
  console.log("\nMissing pilot paths (sync local-wp or adjust manifest):");
  for (const entry of missingPilot) {
    console.log(`  [${entry.id}] ${entry.pilotPath}`);
  }
}

const byLayer = new Map<string, number>();
for (const entry of THEGEM_REMIX_MANIFEST) {
  byLayer.set(entry.layer, (byLayer.get(entry.layer) ?? 0) + 1);
}

console.log("\nBy layer:");
for (const [layer, count] of [...byLayer.entries()].sort()) {
  console.log(`  ${layer}: ${count}`);
}

console.log("\nIn progress (assigned widgets):");
for (const entry of THEGEM_REMIX_MANIFEST.filter((e) => e.status === "in_progress")) {
  console.log(`  [${entry.id}] ${entry.remixPath} → ${entry.widgets.join(", ") || "—"}`);
}

console.log(`\nTotal pilot CSS available (full tree): ${pilot.size}`);

console.log("\nHomepage animation priority (dameluthas.local audit):");
for (const anim of HOMEPAGE_ACTIVE_ANIMATIONS) {
  console.log(
    `  ${anim.name}: ${anim.elementCount} elements → ${anim.widgets.join(", ") || "—"}`,
  );
}
console.log(
  `\nWidget counts: ${HOMEPAGE_ANIMATION_WIDGET_COUNTS.animatedHeadings} animated headings, ${HOMEPAGE_ANIMATION_WIDGET_COUNTS.animatedButtons} animated buttons`,
);
