import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

function getWpContentDirs(): {
  plugins: string;
  themes: string;
  uploads: string;
} {
  const localContent = path.join(
    process.cwd(),
    "local-wp/app/public/wp-content",
  );
  if (existsSync(localContent)) {
    return {
      plugins: path.join(localContent, "plugins"),
      themes: path.join(localContent, "themes"),
      uploads: path.join(localContent, "uploads"),
    };
  }
  return {
    plugins: path.join(process.cwd(), "temp/plugins"),
    themes: path.join(process.cwd(), "temp/themes"),
    uploads: path.join(process.cwd(), "temp/uploads"),
  };
}

function wpContentRoots() {
  const dirs = getWpContentDirs();
  return [
    { prefix: "plugins", dir: dirs.plugins },
    { prefix: "themes", dir: dirs.themes },
    { prefix: "uploads", dir: dirs.uploads },
  ] as const;
}

export function resolveWpContentFile(
  segments: string[],
): { filePath: string; rootDir: string } | null {
  if (!segments.length) return null;

  const [bucket, ...rest] = segments;
  const root = wpContentRoots().find((entry) => entry.prefix === bucket);
  if (!root || !rest.length) return null;

  const filePath = path.join(root.dir, ...rest);
  if (!filePath.startsWith(root.dir) || !existsSync(filePath)) {
    return null;
  }

  return { filePath, rootDir: root.dir };
}

export const WP_CONTENT_MIME: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".eot": "application/vnd.ms-fontobject",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".webm": "video/webm",
  ".mp4": "video/mp4",
};

const PILOT_STYLE_SKIP = new Set([
  "themes/thegem-elementor/css/thegem-admin.css",
  "themes/thegem-elementor/css/rtl.css",
  "themes/thegem-elementor/css/rtl-improved.css",
]);

const PILOT_STYLE_PRIORITY = [
  "plugins/elementor/assets/css/frontend.min.css",
  "plugins/thegem-elements-elementor/inc/elementor/assets/css/frontend-legacy.min.css",
  "themes/thegem-elementor/css/thegem-preloader.css",
  "themes/thegem-elementor/css/thegem-reset.css",
  "themes/thegem-elementor/css/thegem-grid.css",
  "themes/thegem-elementor/style.css",
  "themes/thegem-elementor/css/thegem-header.css",
  "themes/thegem-elementor/css/thegem-custom-header.css",
  "themes/thegem-elementor/css/header-custom.css",
  "themes/thegem-elementor/css/thegem-layout-perspective.css",
  "themes/thegem-elementor/css/thegem-widgets.css",
  "themes/thegem-elementor/css/thegem-new-css.css",
  "themes/thegem-elementor/css/thegem-perevazka-css.css",
  "themes/thegem-elementor/css/custom.css",
  "themes/thegem-elementor/css/thegem-hovers.css",
  "themes/thegem-elementor/css/thegem-button.css",
  "themes/thegem-elementor/css/thegem-portfolio.css",
  "themes/thegem-elementor/css/thegem-portfolio-filters-list.css",
  "themes/thegem-elementor/css/thegem-news-grid.css",
  "themes/thegem-elementor/css/thegem-fullpage.css",
  "themes/thegem-elementor/css/icons.css",
  "themes/thegem-elementor/css/icons-elegant.css",
  "themes/thegem-elementor/css/icons-material.css",
  "themes/thegem-elementor/css/icons-fontawesome.css",
  "themes/thegem-elementor/css/icons-thegem-header.css",
  "themes/thegem-elementor/css/icons-arrows.css",
  "themes/thegem-elementor/js/fancyBox/jquery.fancybox.min.css",
  "themes/thegem-elementor/js/owl/owl.carousel.css",
  "themes/thegem-elementor/js/fullpage/fullpage.min.css",
];

function collectCssFiles(
  absoluteDir: string,
  wpContentPrefix: string,
  options?: { skipDirNames?: Set<string> },
): string[] {
  if (!existsSync(absoluteDir)) return [];

  const skipDirs = options?.skipDirNames ?? new Set(["header-preview"]);
  const results: string[] = [];

  function walk(currentDir: string, relParts: string[]): void {
    for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
      const relPath = [...relParts, entry.name].join("/");
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (skipDirs.has(entry.name)) continue;
        walk(fullPath, [...relParts, entry.name]);
        continue;
      }

      if (!entry.name.endsWith(".css")) continue;
      results.push(`${wpContentPrefix}/${relPath}`);
    }
  }

  walk(absoluteDir, []);
  return results;
}

function sortPilotStyles(styles: string[]): string[] {
  const priority = new Map(
    PILOT_STYLE_PRIORITY.map((relPath, index) => [relPath, index]),
  );

  return [...new Set(styles)]
    .filter((relPath) => !PILOT_STYLE_SKIP.has(relPath))
    .filter((relPath) => resolveWpContentFile(relPath.split("/")) !== null)
    .sort((a, b) => {
      const aRank = priority.get(a) ?? 1000;
      const bRank = priority.get(b) ?? 1000;
      if (aRank !== bRank) return aRank - bRank;
      return a.localeCompare(b);
    });
}

/** Full The Gem theme tree from local-wp or temp. */
export function listTheGemThemeStyles(): string[] {
  const themeRoot = path.join(getWpContentDirs().themes, "thegem-elementor");
  const discovered = [
    "themes/thegem-elementor/style.css",
    "themes/thegem-elementor/wishlist.css",
    ...collectCssFiles(path.join(themeRoot, "css"), "themes/thegem-elementor/css"),
    ...collectCssFiles(path.join(themeRoot, "js"), "themes/thegem-elementor/js"),
  ];
  return sortPilotStyles(discovered);
}

/** Site-specific theme overrides exported by The Gem (Customizer). */
export function listTheGemCustomUploadStyles(): string[] {
  const dir = path.join(getWpContentDirs().uploads, "thegem/css");
  return collectCssFiles(dir, "uploads/thegem/css").filter(
    (relPath) => !relPath.endsWith("style-editor.css"),
  );
}

/** The Gem Elements for Elementor plugin styles. */
export function listTheGemPluginStyles(): string[] {
  const pluginRoot = path.join(
    getWpContentDirs().plugins,
    "thegem-elements-elementor",
  );
  return sortPilotStyles(
    collectCssFiles(pluginRoot, "plugins/thegem-elements-elementor"),
  );
}

export function listElementorPostStyles(): string[] {
  const dir = path.join(getWpContentDirs().uploads, "elementor/css");
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((name: string) => name.startsWith("post-") && name.endsWith(".css"))
    .map((name: string) => `uploads/elementor/css/${name}`)
    .filter((relPath) => resolveWpContentFile(relPath.split("/")) !== null);
}

/** Ordered pilot stylesheet manifest: Elementor → theme → custom → plugin widgets → per-page. */
export function listPilotStylesheets(): string[] {
  const merged = [
    ...PILOT_STYLE_PRIORITY,
    ...listTheGemThemeStyles(),
    ...listTheGemCustomUploadStyles(),
    ...listTheGemPluginStyles(),
    ...listElementorPostStyles(),
  ];
  return sortPilotStyles(merged);
}
