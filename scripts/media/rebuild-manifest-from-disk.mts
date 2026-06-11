#!/usr/bin/env npx tsx
/**
 * Rebuild converted-assets.json from public/assets/ when manifest was lost or partial.
 */
import { existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { REPO_ROOT } from "../wp/config";
import {
  ASSET_DOMAINS,
  MODULE_ASSET_BINDINGS,
  type AssetDomain,
} from "./lib/asset-domains";

const MANIFEST_PATH = join(REPO_ROOT, "data/extracted/converted-assets.json");
const ASSETS_ROOT = join(REPO_ROOT, "public/assets");

function walkAssets(): Array<{ domain: AssetDomain; filename: string; bytes: number }> {
  const out: Array<{ domain: AssetDomain; filename: string; bytes: number }> = [];
  for (const domain of ASSET_DOMAINS) {
    const dir = join(ASSETS_ROOT, domain);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir)) {
      const fp = join(dir, file);
      if (!statSync(fp).isFile()) continue;
      out.push({ domain, filename: file, bytes: statSync(fp).size });
    }
  }
  return out;
}

function inferComponent(domain: AssetDomain): string {
  const binding = MODULE_ASSET_BINDINGS.find((b) => b.domain === domain);
  if (binding) return binding.component;
  if (domain === "portfolio") return "PortfolioGrid";
  return "Unknown";
}

function main(): void {
  const files = walkAssets();
  const records = files.map(({ domain, filename, bytes }) => ({
    uploadRel: filename,
    publicPath: `/assets/${domain}/${filename}`,
    domain,
    component: inferComponent(domain),
    source: "rebuild-manifest-from-disk",
    sha256: "",
    bytesBefore: bytes,
    bytesAfter: bytes,
    width: 0,
    height: 0,
  }));

  writeFileSync(
    MANIFEST_PATH,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        bindings: MODULE_ASSET_BINDINGS,
        records,
        errors: [],
        rebuiltFromDisk: true,
      },
      null,
      2,
    )}\n`,
  );

  console.log(`Rebuilt manifest with ${records.length} record(s) → ${MANIFEST_PATH}`);
}

main();
