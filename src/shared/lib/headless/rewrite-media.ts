import { HEADLESS_CONFIG } from "./config";
import {
  extractUploadRel,
  loadAssetUrlMap,
} from "@/shared/lib/assets/load-manifest";

/**
 * Rewrite legacy WP upload URLs to converted FSD assets (/assets/{domain}/).
 * Uses converted-assets.json when present; falls back to /assets/site/ prefix.
 */
export function rewriteWpMediaUrls(html: string): string {
  const map = loadAssetUrlMap();

  let output = html;
  for (const host of HEADLESS_CONFIG.legacyHosts) {
    const patterns = [
      new RegExp(`https?://${host.replace(/\./g, "\\.")}/wp-content/uploads/`, "gi"),
      new RegExp(`${host.replace(/\./g, "\\.")}/wp-content/uploads/`, "gi"),
    ];
    for (const pattern of patterns) {
      output = output.replace(pattern, (match) => {
        const rel = extractUploadRel(match);
        if (rel && map.has(rel)) return map.get(rel)!;
        return "/assets/site/";
      });
    }
  }

  output = output.replace(
    /(?:\/wp-content\/uploads\/|\/api\/wp-media\/|\/wp-migrated\/)([^"'<>?#]+)/gi,
    (_full, rel: string) => {
      const normalized = rel.replace(/\\/g, "/").replace(/\/$/, "").trim();
      const hit = map.get(normalized);
      if (hit) return hit;
      return `/assets/site/${normalized}`;
    },
  );

  return output;
}

/** @deprecated Use rewriteWpMediaUrls — pilot wp-content proxy removed. */
export function rewritePilotHtml(html: string): string {
  return rewriteWpMediaUrls(html);
}
