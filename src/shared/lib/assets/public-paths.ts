/**
 * Typed public asset URL helpers — consumed by widgets/features (FSD shared layer).
 */
import type { AssetDomain } from "./domains";

export type { AssetDomain } from "./domains";
export { ASSET_DOMAINS, MODULE_ASSET_BINDINGS, assetPublicUrl } from "./domains";

export const ASSETS_BASE = "/assets";

export function assetUrl(domain: AssetDomain, filename: string): string {
  return `${ASSETS_BASE}/${domain}/${filename}`;
}

/** Rewrite legacy WP paths to /assets/ when manifest mapping is applied at build time. */
export function isLegacyMediaPath(url: string): boolean {
  return (
    url.includes("/wp-content/uploads/") ||
    url.includes("/wp-migrated/") ||
    url.includes("/api/wp-media/")
  );
}
