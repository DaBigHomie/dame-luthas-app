import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface ConvertedAssetManifest {
  generatedAt: string;
  records: Array<{
    uploadRel: string;
    publicPath: string;
    domain: string;
    component: string;
  }>;
}

let cachedMap: Map<string, string> | null = null;

/** Build uploadRel → publicPath map from converted-assets.json (server/build only). */
export function loadAssetUrlMap(cwd = process.cwd()): Map<string, string> {
  if (cachedMap) return cachedMap;

  const manifestPath = join(cwd, "data/extracted/converted-assets.json");
  const map = new Map<string, string>();

  if (existsSync(manifestPath)) {
    try {
      const data = JSON.parse(readFileSync(manifestPath, "utf8")) as ConvertedAssetManifest;
      for (const rec of data.records ?? []) {
        map.set(rec.uploadRel, rec.publicPath);
        map.set(rec.uploadRel.replace(/\\/g, "/"), rec.publicPath);
      }
    } catch {
      /* ignore */
    }
  }

  cachedMap = map;
  return map;
}

export function extractUploadRel(url: string): string | null {
  const match = url.match(
    /(?:\/wp-content\/uploads\/|\/wp-migrated\/|\/api\/wp-media\/)([^\s"'?#]+)/i,
  );
  if (!match?.[1]) return null;
  return match[1].replace(/\\/g, "/").replace(/\/$/, "");
}

/** Resolve a legacy WP media URL to converted /assets/ path when manifest exists. */
export function rewriteMediaUrlWithManifest(url: string, cwd = process.cwd()): string {
  const rel = extractUploadRel(url);
  if (rel) {
    const map = loadAssetUrlMap(cwd);
    const hit = map.get(rel);
    if (hit) return hit;
  }
  return url;
}
