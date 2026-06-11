#!/usr/bin/env npx tsx
/**
 * Point Local WP + repo tooling at the restored Dame Luthas site path.
 *
 * Usage:
 *   npx tsx scripts/wp/sync-local-wp-path.mts
 *   npx tsx scripts/wp/sync-local-wp-path.mts --path "/custom/path/to/app/public"
 *   npx tsx scripts/wp/sync-local-wp-path.mts --sync-content
 */

import { execSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  patchLocalSitesJsonPath,
  siteRootFromPublic,
} from "./lib/local-site";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../..");
const CONFIG_PATH = join(__dirname, "local-wp.config.json");

interface LocalWpConfig {
  siteSlug: string;
  siteDomain: string;
  localSiteId: string;
  publicPath: string;
  legacyPublicPath: string;
  localSshEntryScript: string;
  symlinkPath: string;
  symlinkTarget: string;
  updatedAt: string;
}

const DEFAULT_PUBLIC_PATH =
  "/Users/dame/Unused Repos/wordpress-local/dameluthas-com-restore/app/public";

function loadConfig(): LocalWpConfig {
  return JSON.parse(readFileSync(CONFIG_PATH, "utf8")) as LocalWpConfig;
}

function saveConfig(config: LocalWpConfig): void {
  writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

function parseArgs(): { publicPath?: string; syncContent: boolean } {
  const args = process.argv.slice(2);
  let publicPath: string | undefined;
  let syncContent = false;

  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--path" && args[i + 1]) {
      publicPath = args[i + 1];
      i += 1;
    }
    if (args[i] === "--sync-content") syncContent = true;
  }

  return { publicPath, syncContent };
}

function assertPublicPath(publicPath: string): void {
  if (!existsSync(publicPath)) {
    throw new Error(`WP public path not found: ${publicPath}`);
  }
  if (!existsSync(join(publicPath, "wp-config.php"))) {
    throw new Error(`wp-config.php missing under: ${publicPath}`);
  }
}

function ensureSymlink(config: LocalWpConfig): void {
  const { symlinkPath, symlinkTarget } = config;
  if (!existsSync(symlinkTarget)) {
    console.warn(`⚠️  Symlink target missing: ${symlinkTarget}`);
    return;
  }

  if (existsSync(symlinkPath)) {
    const stat = lstatSync(symlinkPath);
    if (stat.isSymbolicLink()) {
      unlinkSync(symlinkPath);
    } else {
      console.warn(`⚠️  ${symlinkPath} exists and is not a symlink — skipping`);
      return;
    }
  } else {
    mkdirSync(dirname(symlinkPath), { recursive: true });
  }

  symlinkSync(symlinkTarget, symlinkPath);
  console.log(`✅ Symlink: ${symlinkPath} → ${symlinkTarget}`);
}

function ensureLocalRunDirs(siteId: string): void {
  const nginxLogs = join(
    process.env.HOME ?? "",
    "Library/Application Support/Local/run",
    siteId,
    "nginx/logs",
  );
  mkdirSync(nginxLogs, { recursive: true });
  console.log(`✅ Ensured Local nginx logs dir: ${nginxLogs}`);
}

function patchLocalSshEntry(config: LocalWpConfig): void {
  const { localSshEntryScript, publicPath } = config;
  if (!existsSync(localSshEntryScript)) {
    console.warn(`⚠️  Local ssh-entry script missing: ${localSshEntryScript}`);
    return;
  }

  const original = readFileSync(localSshEntryScript, "utf8");
  const cdLine = `cd "${publicPath}"`;
  const patched = original.replace(/^cd ".*"$/m, cdLine);

  if (patched === original) {
    console.warn("⚠️  Local ssh-entry script cd line unchanged (pattern not found)");
    return;
  }

  writeFileSync(localSshEntryScript, patched, "utf8");
  console.log(`✅ Patched Local shell entry: ${localSshEntryScript}`);
  console.log(`   ${cdLine}`);
}

function syncTempContent(publicPath: string): void {
  const wpContent = join(publicPath, "wp-content");
  const tempDir = join(REPO_ROOT, "temp");
  const buckets = ["plugins", "themes", "uploads"] as const;

  for (const bucket of buckets) {
    const source = join(tempDir, bucket);
    const target = join(wpContent, bucket);
    if (!existsSync(source)) {
      console.warn(`⚠️  temp/${bucket}/ missing — skip`);
      continue;
    }
    execSync(`rsync -a --delete "${source}/" "${target}/"`, { stdio: "inherit" });
    console.log(`✅ Synced temp/${bucket}/ → wp-content/${bucket}/`);
  }
}

function main(): void {
  const { publicPath: argPath, syncContent } = parseArgs();
  const config = loadConfig();
  const publicPath = resolve(argPath ?? config.publicPath ?? DEFAULT_PUBLIC_PATH);

  assertPublicPath(publicPath);

  const nextConfig: LocalWpConfig = {
    ...config,
    publicPath,
    legacyPublicPath: config.legacyPublicPath,
    updatedAt: new Date().toISOString(),
  };
  saveConfig(nextConfig);

  console.log("📍 Local WP path configuration");
  console.log(`   public: ${publicPath}`);
  console.log(`   domain: ${nextConfig.siteDomain}`);
  console.log(`   siteId: ${nextConfig.localSiteId}`);

  ensureSymlink(nextConfig);
  ensureLocalRunDirs(nextConfig.localSiteId);
  patchLocalSshEntry(nextConfig);

  const siteRoot = siteRootFromPublic(publicPath);
  if (patchLocalSitesJsonPath(nextConfig.localSiteId, siteRoot)) {
    console.log(`✅ Patched Local sites.json path: ${siteRoot}`);
  } else {
    console.warn("⚠️  Could not patch Local sites.json — update path in Local app if needed");
  }

  if (syncContent) {
    console.log("\n📦 Syncing temp/ backup into local wp-content …");
    syncTempContent(publicPath);
  }

  console.log("\n📋 Next steps:");
  console.log("  1. Start site in Local app (dameluthas-com-restore)");
  console.log("  2. Open Local → Site shell (cfEOO-2XZ) — should cd to public path");
  console.log("  3. npx tsx scripts/wp/verify-headless.mts");
  console.log("  4. HEADLESS_MODE=live npm run dev");
}

main();
