#!/usr/bin/env npx tsx
/**
 * Copy WP upload assets referenced by codegen → public/wp-migrated/
 *
 * Usage:
 *   npm run wp:copy-assets
 *   npm run wp:copy-assets -- --dry-run
 */

import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";

import { HEADLESS_CONFIG, REPO_ROOT } from "./config";

const dryRun = process.argv.includes("--dry-run");
const manifestPath = join(HEADLESS_CONFIG.paths.outputDir, "asset-manifest.json");
const publicRoot = join(REPO_ROOT, "public/wp-migrated");
const errors: Array<{ url: string; error: string }> = [];

function wpBaseUrl(): string {
  if (process.env.WP_ASSET_BASE_URL) return process.env.WP_ASSET_BASE_URL.replace(/\/$/, "");
  return "http://dameluthas.local";
}

function localUploadsRoot(): string | null {
  const publicPath = HEADLESS_CONFIG.paths.localWpPublic;
  if (!publicPath) return null;
  return join(publicPath, "wp-content/uploads");
}

function toPublicPath(uploadPath: string): string {
  const rel = uploadPath.replace(/^\/wp-content\/uploads\//, "");
  return join(publicRoot, rel);
}

function toPublicUrl(uploadPath: string): string {
  const rel = uploadPath.replace(/^\/wp-content\/uploads\//, "");
  return `/wp-migrated/${rel}`;
}

async function copyFromLocal(uploadPath: string, dest: string): Promise<boolean> {
  const localRoot = localUploadsRoot();
  if (!localRoot) return false;
  const rel = uploadPath.replace(/^\/wp-content\/uploads\//, "");
  const source = join(localRoot, rel);
  if (!existsSync(source)) return false;
  mkdirSync(dirname(dest), { recursive: true });
  const data = readFileSync(source);
  writeFileSync(dest, data);
  return true;
}

async function copyFromRemote(uploadPath: string, dest: string): Promise<void> {
  const url = `${wpBaseUrl()}${uploadPath}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  mkdirSync(dirname(dest), { recursive: true });
  if (response.body) {
    await pipeline(response.body as unknown as NodeJS.ReadableStream, createWriteStream(dest));
  } else {
    const buf = Buffer.from(await response.arrayBuffer());
    writeFileSync(dest, buf);
  }
}

async function main(): Promise<void> {
  if (!existsSync(manifestPath)) {
    throw new Error(`Missing ${manifestPath} — run wp:extract-content first`);
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as { urls: string[] };
  const urlMap: Record<string, string> = {};
  let copied = 0;
  let skipped = 0;

  for (const uploadPath of manifest.urls) {
    const dest = toPublicPath(uploadPath);
    const publicUrl = toPublicUrl(uploadPath);
    urlMap[uploadPath] = publicUrl;

    if (existsSync(dest)) {
      skipped += 1;
      continue;
    }

    if (dryRun) {
      console.log(`[dry-run] would copy ${uploadPath} → ${dest}`);
      continue;
    }

    try {
      const fromLocal = await copyFromLocal(uploadPath, dest);
      if (!fromLocal) {
        await copyFromRemote(uploadPath, dest);
      }
      copied += 1;
      console.log(`✓ ${uploadPath}`);
    } catch (error) {
      errors.push({
        url: uploadPath,
        error: error instanceof Error ? error.message : String(error),
      });
      console.warn(`✗ ${uploadPath}: ${errors.at(-1)?.error}`);
    }
  }

  if (!dryRun) {
    writeFileSync(
      join(HEADLESS_CONFIG.paths.outputDir, "asset-url-map.json"),
      `${JSON.stringify(urlMap, null, 2)}\n`,
      "utf8",
    );
    writeFileSync(
      join(HEADLESS_CONFIG.paths.outputDir, "asset-errors.json"),
      `${JSON.stringify(errors, null, 2)}\n`,
      "utf8",
    );

    // Rewrite src/content paths to /wp-migrated/
    rewriteContentPaths();
  }

  console.log(`\nDone: ${copied} copied, ${skipped} skipped, ${errors.length} errors`);
}

function rewriteContentPaths(): void {
  const contentDir = join(REPO_ROOT, "src/content");
  const files = ["services.ts", "clients.ts", "sections.ts", "testimonials.ts"];
  for (const file of files) {
    const path = join(contentDir, file);
    if (!existsSync(path)) continue;
    const body = readFileSync(path, "utf8").replaceAll(
      "/wp-content/uploads/",
      "/wp-migrated/",
    );
    writeFileSync(path, body, "utf8");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
