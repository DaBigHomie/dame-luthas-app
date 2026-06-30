import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(__dirname, "../..");

function resolveLocalWpPublicPath(): string | null {
  if (process.env.LOCAL_WP_PUBLIC_PATH) {
    return process.env.LOCAL_WP_PUBLIC_PATH;
  }

  const configPath = resolve(__dirname, "local-wp.config.json");
  if (!existsSync(configPath)) return null;

  try {
    const config = JSON.parse(readFileSync(configPath, "utf8")) as {
      publicPath?: string;
    };
    return config.publicPath ?? null;
  } catch {
    return null;
  }
}

const LOCAL_WP_PUBLIC = resolveLocalWpPublicPath();

export const HEADLESS_CONFIG = {
  site: {
    name: "Dame Luthas",
    wpDomain: "dameluthas.com",
    devDomain: "dameluthas.damieus.app",
    theme: "The Gem",
    pageBuilder: "Elementor",
  },
  graphql: {
    endpoint:
      process.env.WP_HEADLESS_GRAPHQL_URL ??
      "http://dameluthas.local/graphql",
    pageSize: 100,
  },
  paths: {
    tempDir: resolve(REPO_ROOT, "temp"),
    outputDir: resolve(REPO_ROOT, "data/extracted"),
    uploadsDir: resolve(REPO_ROOT, "temp/uploads"),
    pluginsDir: resolve(REPO_ROOT, "temp/plugins"),
    themesDir: resolve(REPO_ROOT, "temp/themes"),
    localWpPublic: LOCAL_WP_PUBLIC,
    localWpContent: LOCAL_WP_PUBLIC ? resolve(LOCAL_WP_PUBLIC, "wp-content") : null,
    dbDump: resolve(
      REPO_ROOT,
      "temp/backup_2025-12-19-0819_Dame_Luthas_Consulting_25b66197fd2c-db",
    ),
    dbDumpGz: resolve(
      REPO_ROOT,
      "temp/backup_2025-12-19-0819_Dame_Luthas_Consulting_25b66197fd2c-db.gz",
    ),
  },
  /** UpdraftPlus archives — extracted on demand by prepare-backup */
  archives: [
    {
      zip: "backup_2025-12-19-0819_Dame_Luthas_Consulting_25b66197fd2c-plugins.zip",
      targetDir: "plugins",
    },
    {
      zip: "backup_2025-12-19-0819_Dame_Luthas_Consulting_25b66197fd2c-themes.zip",
      targetDir: "themes",
    },
    {
      zip: "backup_2025-12-19-0819_Dame_Luthas_Consulting_25b66197fd2c-uploads.zip",
      targetDir: "uploads",
    },
  ],
  /** WPGraphQL root fields to probe (The Gem portfolio CPT + standard types) */
  contentQueries: [
    { key: "pages", graphqlField: "pages", label: "Pages", fallbacks: [] as string[] },
    { key: "posts", graphqlField: "posts", label: "Posts", fallbacks: [] as string[] },
    {
      key: "portfolio",
      graphqlField: "thegemPfItems",
      label: "Portfolio (thegem_pf_item)",
      fallbacks: ["portfolioItems", "pfItems"],
    },
    {
      key: "templates",
      graphqlField: "thegemTemplates",
      label: "The Gem templates (thegem_templates)",
      fallbacks: [] as string[],
    },
    {
      key: "titles",
      graphqlField: "thegemTitles",
      label: "The Gem headers (thegem_title)",
      fallbacks: [] as string[],
    },
    {
      key: "footers",
      graphqlField: "thegemFooters",
      label: "The Gem footers (thegem_footer)",
      fallbacks: [] as string[],
    },
    {
      key: "services",
      graphqlField: "services",
      label: "Services CPT",
      fallbacks: [] as string[],
    },
    { key: "menus", graphqlField: "menus", label: "Menus", fallbacks: [] as string[] },
    { key: "media", graphqlField: "mediaItems", label: "Media", fallbacks: [] as string[] },
  ],
  routeMapping: {
    portfolio: "/portfolio",
    caseStudies: "/case-studies",
    services: "/services",
    about: "/about",
    contact: "/contact",
  },
  requiredPlugins: ["wp-graphql", "wpgraphql-acf"],
} as const;

export type ContentKey = (typeof HEADLESS_CONFIG.contentQueries)[number]["key"];
