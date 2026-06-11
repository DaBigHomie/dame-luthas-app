import { HEADLESS_CONFIG } from "./config";
import { rewriteWpAssetUrls } from "./rewrite-wp-urls";

/** Rewrite legacy WP upload URLs to the local media proxy route. */
export function rewriteWpMediaUrls(html: string): string {
  let output = html;
  for (const host of HEADLESS_CONFIG.legacyHosts) {
    const patterns = [
      new RegExp(`https?://${host.replace(/\./g, "\\.")}/wp-content/uploads/`, "gi"),
      new RegExp(`${host.replace(/\./g, "\\.")}/wp-content/uploads/`, "gi"),
    ];
    for (const pattern of patterns) {
      output = output.replace(pattern, "/api/wp-media/");
    }
  }
  return output;
}

/** Rewrite media + theme/plugin asset URLs for pilot HTML rendering. */
export function rewritePilotHtml(html: string): string {
  return rewriteWpMediaUrls(rewriteWpAssetUrls(html));
}
