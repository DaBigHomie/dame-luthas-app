#!/usr/bin/env npx tsx
/**
 * Validate converted assets match component bindings (FSD content → public/assets).
 *
 *   npm run assets:verify-bindings
 *
 * Fails when:
 * - src/content or src/widgets reference /wp-migrated, /wp-content, /api/wp-media
 * - /assets/* paths in source do not exist on disk
 * - converted-assets.json records missing files or domain/component mismatch
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { REPO_ROOT } from "../wp/config";
import {
  MODULE_ASSET_BINDINGS,
  PUBLIC_ASSETS_ROOT,
  type AssetDomain,
} from "./lib/asset-domains";
import { collectLegacyAssetRefs } from "./lib/collect-asset-refs";

const MANIFEST_PATH = join(REPO_ROOT, "data/extracted/converted-assets.json");

const LEGACY_RE = /\/(?:wp-migrated|wp-content\/uploads|api\/wp-media)\//;
const ASSET_RE = /\/assets\/([\w-]+)\/([^\s"'\\<>]+)/g;

interface ManifestRecord {
  uploadRel: string;
  publicPath: string;
  domain: AssetDomain;
  component: string;
  source: string;
}

function scanLegacyPaths(): string[] {
  const violations: string[] = [];
  const dirs = [
    join(REPO_ROOT, "src/content"),
    join(REPO_ROOT, "src/widgets"),
    join(REPO_ROOT, "src/features"),
    join(REPO_ROOT, "src/entities"),
  ];

  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    for (const file of walkDir(dir)) {
      if (!/\.(tsx?|jsx?)$/.test(file)) continue;
      const rel = file.replace(REPO_ROOT, ".");
      const body = readFileSync(file, "utf8");
      if (LEGACY_RE.test(body)) {
        violations.push(rel);
      }
    }
  }
  return violations;
}

function walkDir(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fp = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkDir(fp));
    else out.push(fp);
  }
  return out;
}

function scanAssetPaths(): Array<{ file: string; publicPath: string }> {
  const refs: Array<{ file: string; publicPath: string }> = [];
  const dirs = [
    join(REPO_ROOT, "src/content"),
    join(REPO_ROOT, "src/widgets"),
  ];

  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    for (const file of walkDir(dir)) {
      if (!/\.(tsx?)$/.test(file)) continue;
      const body = readFileSync(file, "utf8");
      for (const match of body.matchAll(ASSET_RE)) {
        refs.push({
          file: file.replace(REPO_ROOT, "."),
          publicPath: `/assets/${match[1]}/${match[2]}`,
        });
      }
    }
  }
  return refs;
}

function loadManifest(): { records: ManifestRecord[]; valid: boolean } {
  if (!existsSync(MANIFEST_PATH)) return { records: [], valid: false };
  try {
    const data = JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as {
      records?: ManifestRecord[];
    };
    const records = data.records ?? [];
    return { records, valid: records.length > 0 };
  } catch {
    return { records: [], valid: false };
  }
}

function main(): void {
  let failed = false;

  console.log("=== Asset binding verification ===\n");

  const legacy = scanLegacyPaths();
  if (legacy.length) {
    failed = true;
    console.error("Legacy WP media paths in src/ (use /assets/ only):");
    for (const f of legacy) console.error(`  ✗ ${f}`);
    console.error("");
  } else {
    console.log("✓ No legacy /wp-migrated|/wp-content|/api/wp-media in src/");
  }

  const assetRefs = scanAssetPaths();
  const missingOnDisk: string[] = [];
  for (const { file, publicPath } of assetRefs) {
    const disk = join(REPO_ROOT, "public", publicPath);
    if (!existsSync(disk)) {
      missingOnDisk.push(`${publicPath} (referenced in ${file})`);
    }
  }

  if (missingOnDisk.length) {
    failed = true;
    console.error("\nMissing /assets/ files on disk:");
    for (const m of missingOnDisk) console.error(`  ✗ ${m}`);
  } else {
    console.log(`✓ All ${assetRefs.length} /assets/ reference(s) exist on disk`);
  }

  const { records: manifest, valid: manifestValid } = loadManifest();
  if (!manifestValid) {
    console.warn("\n⚠ No converted-assets.json records — run: npm run assets:convert");
    failed = true;
  } else {
    let manifestMissing = 0;
    for (const rec of manifest) {
      const disk = join(REPO_ROOT, "public", rec.publicPath);
      if (!existsSync(disk)) {
        manifestMissing++;
        console.error(`  ✗ manifest record missing file: ${rec.publicPath}`);
      }
    }
    if (manifestMissing) {
      failed = true;
    } else {
      console.log(`✓ Manifest ${manifest.length} record(s) all on disk`);
    }
  }

  const refs = collectLegacyAssetRefs(REPO_ROOT);
  const manifestByUpload = new Map(manifest.map((r) => [r.uploadRel, r]));

  const unconverted: string[] = [];
  const legacyHtmlWarnings: string[] = [];
  for (const ref of refs) {
    const rec = manifestByUpload.get(ref.uploadRel);
    if (!rec) {
      if (ref.source.includes("content.json")) {
        legacyHtmlWarnings.push(`${ref.uploadRel} (${ref.component})`);
      } else {
        unconverted.push(`${ref.uploadRel} (${ref.component} via ${ref.source})`);
      }
      continue;
    }
    if (rec.domain !== ref.domain || rec.component !== ref.component) {
      failed = true;
      console.error(
        `  ✗ binding mismatch ${ref.uploadRel}: manifest ${rec.domain}/${rec.component} vs expected ${ref.domain}/${ref.component}`,
      );
    }
  }

  if (legacyHtmlWarnings.length) {
    console.warn("\nLegacy refs in migrated HTML (native pages will replace):");
    for (const u of legacyHtmlWarnings.slice(0, 10)) console.warn(`  ⚠ ${u}`);
  }

  if (unconverted.length) {
    failed = true;
    console.error("\nReferenced uploads not in manifest (run assets:convert):");
    for (const u of unconverted.slice(0, 20)) console.error(`  ✗ ${u}`);
    if (unconverted.length > 20) {
      console.error(`  … and ${unconverted.length - 20} more`);
    }
  } else if (manifest.length) {
    console.log(`✓ All ${refs.length} collected ref(s) covered by manifest`);
  }

  for (const binding of MODULE_ASSET_BINDINGS) {
    const modPath = join(REPO_ROOT, "src/content", binding.module);
    if (!existsSync(modPath)) continue;
    const body = readFileSync(modPath, "utf8");
    const domainHits = [...body.matchAll(ASSET_RE)].filter(
      (m) => m[1] === binding.domain,
    );
    if (domainHits.length === 0 && binding.module !== "hero-fallback.ts") {
      console.warn(
        `⚠ ${binding.module} has no /assets/${binding.domain}/ paths (component: ${binding.component})`,
      );
    }
  }

  const assetsRoot = join(REPO_ROOT, PUBLIC_ASSETS_ROOT);
  if (!existsSync(assetsRoot)) {
    failed = true;
    console.error(`\n✗ ${PUBLIC_ASSETS_ROOT}/ does not exist`);
  }

  console.log("");
  if (failed) {
    console.error("Asset binding verification FAILED");
    process.exit(1);
  }
  console.log("Asset binding verification PASSED");
}

main();
