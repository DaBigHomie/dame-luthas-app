#!/usr/bin/env npx tsx
/**
 * Ensures data/migrated/content.json exists before `next build`.
 * - Uses committed content.json in CI / Vercel Git builds
 * - Runs wp:migrate when a local snapshot is present (dev machines)
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const contentPath = path.join(process.cwd(), "data/migrated/content.json");
const snapshotPath = path.join(process.cwd(), "data/snapshot/snapshot.json");

function fail(message: string): never {
  console.error(`ensure-migrated-content: ${message}`);
  process.exit(1);
}

if (existsSync(contentPath)) {
  console.log("ensure-migrated-content: content.json present");
  process.exit(0);
}

if (existsSync(snapshotPath)) {
  console.log("ensure-migrated-content: migrating from data/snapshot/snapshot.json");
  const result = spawnSync("npx", ["tsx", "scripts/wp/migrate-content.mts"], {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  if (result.status !== 0) {
    fail("wp:migrate failed");
  }
  if (!existsSync(contentPath)) {
    fail("migrate completed but content.json missing");
  }
  process.exit(0);
}

fail(
  "Missing data/migrated/content.json. Run `npm run wp:migrate` locally and commit the file.",
);
