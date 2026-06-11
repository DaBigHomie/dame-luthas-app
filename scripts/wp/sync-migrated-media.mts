#!/usr/bin/env npx tsx
/**
 * Copy WP upload files referenced in migrated content + codegen → public/wp-migrated/
 *
 *   npm run wp:sync-media
 *   npm run wp:sync-media -- --dry-run
 */
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";

import { HEADLESS_CONFIG, REPO_ROOT } from "./config";
import { loadLocalWpPublicPathEnv } from "./lib/load-local-wp-env";

loadLocalWpPublicPathEnv();

const dryRun = process.argv.includes("--dry-run");
const publicRoot = join(REPO_ROOT, "public/wp-migrated");
const UPLOAD_PATH_RE = /\/wp-content\/uploads\/([^\s"'<>\\]+)/gi;
const API_MEDIA_RE = /\/api\/wp-media\/([^\s"'<>\\]+)/gi;

function localUploadsRoot(): string | null {
  const publicPath = HEADLESS_CONFIG.paths.localWpPublic;
  if (!publicPath) return null;
  return join(publicPath, "wp-content/uploads");
}

function collectUploadPathsFromText(text: string): Set<string> {
  const paths = new Set<string>();
  for (const match of text.matchAll(UPLOAD_PATH_RE)) {
    const rel = match[1]?.replace(/\\\//g, "/");
    if (rel) paths.add(`/wp-content/uploads/${rel}`);
  }
  for (const match of text.matchAll(API_MEDIA_RE)) {
    const rel = match[1]?.replace(/\\\//g, "/");
    if (rel) paths.add(`/wp-content/uploads/${rel}`);
  }
  return paths;
}

function collectFromRepo(): Set<string> {
  const paths = new Set<string>();

  const migrated = join(REPO_ROOT, "data/migrated/content.json");
  if (existsSync(migrated)) {
    for (const p of collectUploadPathsFromText(readFileSync(migrated, "utf8"))) {
      paths.add(p);
    }
  }

  const manifest = join(HEADLESS_CONFIG.paths.outputDir, "asset-manifest.json");
  if (existsSync(manifest)) {
    const data = JSON.parse(readFileSync(manifest, "utf8")) as { urls?: string[] };
    for (const url of data.urls ?? []) paths.add(url);
  }

  const contentDir = join(REPO_ROOT, "src/content");
  if (existsSync(contentDir)) {
    for (const file of readdirSync(contentDir)) {
      if (!file.endsWith(".ts")) continue;
      for (const p of collectUploadPathsFromText(
        readFileSync(join(contentDir, file), "utf8"),
      )) {
        paths.add(p);
      }
    }
  }

  return paths;
}

function toDest(uploadPath: string): string {
  const rel = uploadPath.replace(/^\/wp-content\/uploads\//, "");
  return join(publicRoot, rel);
}

async function copyFromLocal(uploadPath: string, dest: string): Promise<boolean> {
  const localRoot = localUploadsRoot();
  if (!localRoot) return false;
  const rel = uploadPath.replace(/^\/wp-content\/uploads\//, "");
  const source = join(localRoot, rel);
  if (!existsSync(source)) return false;
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, readFileSync(source));
  return true;
}

async function copyFromRemote(uploadPath: string, dest: string): Promise<void> {
  const base =
    process.env.WP_ASSET_BASE_URL?.replace(/\/$/, "") ?? "http://dameluthas.local";
  const response = await fetch(`${base}${uploadPath}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  mkdirSync(dirname(dest), { recursive: true });
  if (response.body) {
    await pipeline(
      response.body as unknown as NodeJS.ReadableStream,
      createWriteStream(dest),
    );
  } else {
    writeFileSync(dest, Buffer.from(await response.arrayBuffer()));
  }
}

async function main(): Promise<void> {
  const paths = collectFromRepo();
  console.log(`Found ${paths.size} unique upload path(s) in repo content\n`);

  let copied = 0;
  let skipped = 0;
  const errors: Array<{ path: string; error: string }> = [];

  for (const uploadPath of [...paths].sort()) {
    const dest = toDest(uploadPath);
    if (existsSync(dest)) {
      skipped += 1;
      continue;
    }

    if (dryRun) {
      console.log(`[dry-run] ${uploadPath} → ${dest}`);
      continue;
    }

    try {
      const fromLocal = await copyFromLocal(uploadPath, dest);
      if (!fromLocal) await copyFromRemote(uploadPath, dest);
      copied += 1;
      console.log(`✓ ${uploadPath}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push({ path: uploadPath, error: message });
      console.warn(`✗ ${uploadPath}: ${message}`);
    }
  }

  if (!dryRun) {
    writeFileSync(
      join(HEADLESS_CONFIG.paths.outputDir, "sync-media-errors.json"),
      `${JSON.stringify(errors, null, 2)}\n`,
    );
  }

  console.log(`\nDone: ${copied} copied, ${skipped} skipped, ${errors.length} errors`);
  if (errors.length) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
