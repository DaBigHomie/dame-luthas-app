#!/usr/bin/env npx tsx
/**
 * Convert referenced WP uploads → optimized assets in public/assets/{domain}/.
 *
 *   npm run assets:convert
 *   npm run assets:convert -- --dry-run
 *
 * Requires: sharp (devDependency), local WP uploads via LOCAL_WP_PUBLIC_PATH or local-wp.config.json
 * Reference: damieus-workflow-agents/tools/image-processing/wp-media-pipeline.mjs
 */
import {
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { basename, dirname, extname, join } from "node:path";
import { pipeline } from "node:stream/promises";

import { HEADLESS_CONFIG, REPO_ROOT } from "../wp/config";
import { loadLocalWpPublicPathEnv } from "../wp/lib/load-local-wp-env";
import {
  MODULE_ASSET_BINDINGS,
  PUBLIC_ASSETS_ROOT,
  assetPublicUrl,
  type AssetDomain,
} from "./lib/asset-domains";
import { collectAssetRefs } from "./lib/collect-asset-refs";

loadLocalWpPublicPathEnv();

const dryRun = process.argv.includes("--dry-run");
const quality = Number(process.env.ASSET_WEBP_QUALITY ?? "82");
const OUT_ROOT = join(REPO_ROOT, PUBLIC_ASSETS_ROOT);
const MANIFEST_PATH = join(REPO_ROOT, "data/extracted/converted-assets.json");

const SHARP_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".tif", ".tiff"]);
const COPY_EXTS = new Set([".svg", ".webm", ".mp4"]);

export interface ConvertedAssetRecord {
  uploadRel: string;
  publicPath: string;
  domain: AssetDomain;
  component: string;
  source: string;
  sha256: string;
  bytesBefore: number;
  bytesAfter: number;
  width: number;
  height: number;
}

async function sha256File(fp: string): Promise<string> {
  const hash = createHash("sha256");
  await pipeline(createReadStream(fp), hash);
  return hash.digest("hex");
}

function localUploadsRoot(): string | null {
  const publicPath = HEADLESS_CONFIG.paths.localWpPublic;
  if (!publicPath) return null;
  return join(publicPath, "wp-content/uploads");
}

function stableFilename(uploadRel: string, ext: string): string {
  const base = basename(uploadRel, extname(uploadRel));
  const safe = base
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return `${safe}${ext}`;
}

async function loadSharp(): Promise<typeof import("sharp") | null> {
  try {
    const mod = await import("sharp");
    return mod.default;
  } catch {
    console.error(
      "sharp is required — run: npm install --save-dev sharp",
    );
    return null;
  }
}

async function convertOne(
  sharp: typeof import("sharp") | null,
  uploadRel: string,
  domain: AssetDomain,
): Promise<{ destFull: string; publicPath: string; meta: Omit<ConvertedAssetRecord, "uploadRel" | "publicPath" | "domain" | "component" | "source"> }> {
  const uploads = localUploadsRoot();
  if (!uploads) {
    throw new Error("LOCAL_WP_PUBLIC_PATH not configured — cannot read source uploads");
  }

  const srcFull = join(uploads, uploadRel);
  if (!existsSync(srcFull)) {
    throw new Error(`source missing: ${srcFull}`);
  }

  const srcExt = extname(uploadRel).toLowerCase();
  const bytesBefore = readFileSync(srcFull).length;
  const sha256 = await sha256File(srcFull);

  let outExt = ".webp";
  if (COPY_EXTS.has(srcExt)) outExt = srcExt;

  const filename = stableFilename(uploadRel, outExt);
  const destFull = join(OUT_ROOT, domain, filename);
  const publicPath = assetPublicUrl(domain, filename);

  if (dryRun) {
    return {
      destFull,
      publicPath,
      meta: { sha256, bytesBefore, bytesAfter: bytesBefore, width: 0, height: 0 },
    };
  }

  mkdirSync(dirname(destFull), { recursive: true });

  if (COPY_EXTS.has(srcExt) || !SHARP_EXTS.has(srcExt) || !sharp) {
    writeFileSync(destFull, readFileSync(srcFull));
    return {
      destFull,
      publicPath,
      meta: { sha256, bytesBefore, bytesAfter: bytesBefore, width: 0, height: 0 },
    };
  }

  const img = sharp(srcFull);
  const meta = await img.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;

  if (srcExt === ".webp" && bytesBefore < 120_000) {
    writeFileSync(destFull, readFileSync(srcFull));
    return {
      destFull,
      publicPath,
      meta: { sha256, bytesBefore, bytesAfter: bytesBefore, width, height },
    };
  }

  await sharp(srcFull).webp({ quality, effort: 4 }).toFile(destFull);
  const bytesAfter = readFileSync(destFull).length;

  return {
    destFull,
    publicPath,
    meta: { sha256, bytesBefore, bytesAfter, width, height },
  };
}

function rewriteContentPaths(urlMap: Record<string, string>): void {
  const applyMap = (fp: string): void => {
    let body = readFileSync(fp, "utf8");
    let changed = false;

    for (const [uploadRel, publicPath] of Object.entries(urlMap)) {
      const variants = [
        `/wp-content/uploads/${uploadRel}`,
        `/wp-migrated/${uploadRel}`,
        `/api/wp-media/${uploadRel}`,
      ];
      for (const v of variants) {
        if (body.includes(v)) {
          body = body.split(v).join(publicPath);
          changed = true;
        }
      }
    }

    if (changed && !dryRun) {
      writeFileSync(fp, body, "utf8");
      console.log(`  rewrote paths in ${fp.replace(REPO_ROOT, ".")}`);
    }
  };

  const contentJson = join(REPO_ROOT, "data/migrated/content.json");
  if (existsSync(contentJson)) applyMap(contentJson);

  for (const dir of [join(REPO_ROOT, "src/content"), join(REPO_ROOT, "src/widgets")]) {
    if (!existsSync(dir)) continue;
    for (const file of readdirSyncSafe(dir)) {
      if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue;
      applyMap(join(dir, file));
    }
  }
}

function readdirSyncSafe(dir: string): string[] {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
}

async function main(): Promise<void> {
  const refs = collectAssetRefs(REPO_ROOT);
  console.log(`Found ${refs.length} unique original upload(s) to convert\n`);

  if (!refs.length) {
    console.log("Nothing to convert.");
    return;
  }

  const sharp = await loadSharp();
  if (!sharp && !dryRun) process.exit(1);

  const records: ConvertedAssetRecord[] = [];
  const urlMap: Record<string, string> = {};
  const errors: Array<{ uploadRel: string; error: string }> = [];

  for (const ref of refs) {
    try {
      const { publicPath, meta } = await convertOne(sharp, ref.uploadRel, ref.domain);
      urlMap[ref.uploadRel] = publicPath;
      records.push({
        uploadRel: ref.uploadRel,
        publicPath,
        domain: ref.domain,
        component: ref.component,
        source: ref.source,
        ...meta,
      });
      console.log(`${dryRun ? "[dry-run] " : ""}✓ ${ref.uploadRel} → ${publicPath} (${ref.component})`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push({ uploadRel: ref.uploadRel, error: msg });
      console.warn(`✗ ${ref.uploadRel}: ${msg}`);
    }
  }

  if (!dryRun && records.length > 0) {
    mkdirSync(dirname(MANIFEST_PATH), { recursive: true });
    writeFileSync(
      MANIFEST_PATH,
      `${JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          bindings: MODULE_ASSET_BINDINGS,
          records,
          errors,
        },
        null,
        2,
      )}\n`,
    );
    rewriteContentPaths(urlMap);
  }

  console.log(`\nDone: ${records.length} converted, ${errors.length} errors`);
  if (errors.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
