import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import type { AssetDomain } from "./asset-domains";
import { MODULE_ASSET_BINDINGS } from "./asset-domains";

const LEGACY_REF_RE =
  /(?:\/wp-content\/uploads\/|\/wp-migrated\/|\/api\/wp-media\/)([^"'\\<>#?]+)/gi;

export const ASSET_REF_RE = /\/assets\/([\w-]+)\/([^\s"'\\<>#?]+)/g;

const THUMB_RE = /-\d+x\d+\.(jpe?g|png|webp|gif)$/i;
const SCALED_RE = /-scaled\.(jpe?g|png|webp|gif)$/i;
const THEGEM_CROP_RE = /-thegem-product-/i;

function normalizeUploadRel(raw: string): string {
  return raw
    .replace(/\\/g, "/")
    .replace(/\/$/, "")
    .replace(/#.+$/, "")
    .split("?")[0]
    .trim() ?? raw;
}

function hasMediaExtension(rel: string): boolean {
  return /\.(jpe?g|png|webp|gif|svg|webm|mp4|mov|pdf)$/i.test(rel);
}

function isThumbnail(rel: string): boolean {
  const base = rel.split("/").pop() ?? rel;
  return (
    THUMB_RE.test(base) ||
    SCALED_RE.test(base) ||
    THEGEM_CROP_RE.test(base)
  );
}

export interface AssetRef {
  /** Relative WP upload path e.g. 2025/02/home-04.webp */
  uploadRel: string;
  /** Where the ref was found */
  source: string;
  domain: AssetDomain;
  component: string;
}

function inferDomain(
  uploadRel: string,
  sourceFile: string,
  portfolioSlugs: Set<string>,
): { domain: AssetDomain; component: string } {
  const binding = MODULE_ASSET_BINDINGS.find((b) => sourceFile.includes(b.module));
  if (binding) {
    return { domain: binding.domain, component: binding.component };
  }

  if (sourceFile.includes("content.json") || sourceFile.includes("portfolio")) {
    const slugHit = [...portfolioSlugs].find((s) => uploadRel.includes(s));
    if (slugHit || /dl-portfolio|alu-|wto-|undp-/i.test(uploadRel)) {
      return { domain: "portfolio", component: "PortfolioGrid" };
    }
  }

  if (/logo|client|un-logo|who-logo|unicef|msg-logo|glg-logo/i.test(uploadRel)) {
    return { domain: "clients", component: "ClientsMarquee" };
  }

  if (/home-0[345]|service/i.test(uploadRel)) {
    return { domain: "services", component: "ServiceBlockSection" };
  }

  if (/contact|about|team|circle-dark/i.test(uploadRel)) {
    return { domain: "pages", component: "ContactPage" };
  }

  return { domain: "site", component: "Unknown" };
}

function collectPortfolioSlugs(contentJsonPath: string): Set<string> {
  const slugs = new Set<string>();
  if (!existsSync(contentJsonPath)) return slugs;
  try {
    const data = JSON.parse(readFileSync(contentJsonPath, "utf8")) as {
      portfolio?: Array<{ slug?: string }>;
    };
    for (const item of data.portfolio ?? []) {
      if (item.slug) slugs.add(item.slug);
    }
  } catch {
    /* ignore */
  }
  return slugs;
}

function scanText(
  text: string,
  source: string,
  portfolioSlugs: Set<string>,
  out: Map<string, AssetRef>,
): void {
  for (const match of text.matchAll(LEGACY_REF_RE)) {
    const uploadRel = normalizeUploadRel(match[1] ?? "");
    if (!uploadRel || isThumbnail(uploadRel) || !hasMediaExtension(uploadRel)) continue;

    const { domain, component } = inferDomain(uploadRel, source, portfolioSlugs);
    const key = uploadRel;
    if (!out.has(key)) {
      out.set(key, { uploadRel, source, domain, component });
    }
  }
}

export function collectAssetRefs(repoRoot: string): AssetRef[] {
  return collectLegacyAssetRefs(repoRoot);
}

/** Legacy WP paths only — skips already-converted /assets/ URLs. */
export function collectLegacyAssetRefs(repoRoot: string): AssetRef[] {
  const out = new Map<string, AssetRef>();
  const contentJson = join(repoRoot, "data/migrated/content.json");
  const portfolioSlugs = collectPortfolioSlugs(contentJson);

  if (existsSync(contentJson)) {
    scanText(
      readFileSync(contentJson, "utf8"),
      "data/migrated/content.json",
      portfolioSlugs,
      out,
    );
  }

  const contentDir = join(repoRoot, "src/content");
  if (existsSync(contentDir)) {
    for (const file of readdirSync(contentDir)) {
      if (!file.endsWith(".ts")) continue;
      scanText(
        readFileSync(join(contentDir, file), "utf8"),
        `src/content/${file}`,
        portfolioSlugs,
        out,
      );
    }
  }

  const widgetsDir = join(repoRoot, "src/widgets");
  if (existsSync(widgetsDir)) {
    for (const file of readdirSync(widgetsDir)) {
      if (!file.endsWith(".tsx")) continue;
      scanText(
        readFileSync(join(widgetsDir, file), "utf8"),
        `src/widgets/${file}`,
        portfolioSlugs,
        out,
      );
    }
  }

  return [...out.values()].sort((a, b) => a.uploadRel.localeCompare(b.uploadRel));
}
