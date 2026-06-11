#!/usr/bin/env npx tsx
/** Copy portfolio hero webm from local WP uploads → public/assets/portfolio/. */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { HEADLESS_CONFIG, REPO_ROOT } from "../wp/config";
import { loadLocalWpPublicPathEnv } from "../wp/lib/load-local-wp-env";

loadLocalWpPublicPathEnv();

const OUT = join(REPO_ROOT, "public/assets/portfolio/portfolio-hero-recording.webm");
const UPLOADS = HEADLESS_CONFIG.paths.localWpPublic
  ? join(HEADLESS_CONFIG.paths.localWpPublic, "wp-content/uploads/2025/06")
  : null;

function findWebm(): string | null {
  if (!UPLOADS || !existsSync(UPLOADS)) return null;
  for (const file of readdirSync(UPLOADS)) {
    if (/Screen-Recording.*\.webm$/i.test(file)) {
      return join(UPLOADS, file);
    }
  }
  return null;
}

const src = findWebm();
if (!src) {
  console.error("Portfolio webm not found in local WP uploads");
  process.exit(1);
}

mkdirSync(join(REPO_ROOT, "public/assets/portfolio"), { recursive: true });
copyFileSync(src, OUT);
console.log(`✓ ${src} → ${OUT}`);
