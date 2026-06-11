#!/usr/bin/env npx tsx
/**
 * Verify and prepare UpdraftPlus backup artifacts in temp/.
 *
 * Usage:
 *   npx tsx scripts/wp/prepare-backup.mts
 *   npx tsx scripts/wp/prepare-backup.mts --unzip
 */

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { HEADLESS_CONFIG } from "./config";

const flags = new Set(process.argv.slice(2));
const shouldUnzip = flags.has("--unzip");

function ok(message: string): void {
  console.log(`✅ ${message}`);
}

function warn(message: string): void {
  console.warn(`⚠️  ${message}`);
}

function fail(message: string): never {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function dirSizeHint(dir: string): string {
  if (!existsSync(dir)) return "missing";
  const count = readdirSync(dir).length;
  return `${count} entries`;
}

function unzipIfNeeded(zipName: string, targetDirName: string): void {
  const zipPath = join(HEADLESS_CONFIG.paths.tempDir, zipName);
  const targetPath = join(HEADLESS_CONFIG.paths.tempDir, targetDirName);

  if (existsSync(targetPath) && readdirSync(targetPath).length > 0) {
    ok(`${targetDirName}/ already present (${dirSizeHint(targetPath)})`);
    return;
  }

  if (!existsSync(zipPath)) {
    warn(`Archive missing: ${zipName}`);
    return;
  }

  if (!shouldUnzip) {
    warn(`${targetDirName}/ empty — re-run with --unzip to extract ${zipName}`);
    return;
  }

  mkdirSync(targetPath, { recursive: true });
  execSync(`unzip -qo "${zipPath}" -d "${targetPath}"`, { stdio: "inherit" });
  ok(`Extracted ${zipName} → ${targetDirName}/`);
}

function checkPlugins(): void {
  const { pluginsDir, requiredPlugins } = {
    pluginsDir: HEADLESS_CONFIG.paths.pluginsDir,
    requiredPlugins: HEADLESS_CONFIG.requiredPlugins,
  };

  if (!existsSync(pluginsDir)) {
    warn("plugins/ missing — WPGraphQL extraction will fail until restored");
    return;
  }

  for (const plugin of requiredPlugins) {
    const pluginPath = join(pluginsDir, plugin);
    if (existsSync(pluginPath)) {
      ok(`Plugin present: ${plugin}`);
    } else {
      warn(`Required plugin missing: ${plugin}`);
    }
  }
}

function main(): void {
  console.log("📦 Preparing headless WP backup artifacts\n");

  if (!existsSync(HEADLESS_CONFIG.paths.tempDir)) {
    fail(`temp/ not found at ${HEADLESS_CONFIG.paths.tempDir}`);
  }

  ok(`temp/ found`);

  const { dbDump, dbDumpGz } = HEADLESS_CONFIG.paths;
  if (existsSync(dbDump)) {
    const sizeMb = (statSync(dbDump).size / 1024 / 1024).toFixed(1);
    ok(`DB dump present (${sizeMb} MB)`);
  } else if (existsSync(dbDumpGz)) {
    warn("DB dump is gzipped only — import via Local/Flywheel or gunzip first");
  } else {
    warn("DB dump missing — restore WordPress locally before GraphQL extract");
  }

  for (const archive of HEADLESS_CONFIG.archives) {
    unzipIfNeeded(archive.zip, archive.targetDir);
  }

  ok(`uploads/: ${dirSizeHint(HEADLESS_CONFIG.paths.uploadsDir)}`);
  ok(`themes/: ${dirSizeHint(HEADLESS_CONFIG.paths.themesDir)}`);
  checkPlugins();

  console.log("\n📋 Next steps:");
  console.log("  1. Restore WP locally (Local WP / Flywheel) using temp/ db + wp-content");
  console.log("  2. Activate wp-graphql + wpgraphql-acf");
  console.log("  3. Set WP_HEADLESS_GRAPHQL_URL in .env.local (default: dameluthas-com-restore.local)");
  console.log("  4. npx tsx scripts/wp/verify-headless.mts");
  console.log("  5. npx tsx scripts/wp/extract-content.mts");
}

main();
