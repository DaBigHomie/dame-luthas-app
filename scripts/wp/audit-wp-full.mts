#!/usr/bin/env npx tsx
/**
 * Phase 1b — Full-site WP source audit (homepage + contact + case-studies + portfolio singles).
 *
 *   npm run wp:audit-full
 *   npm run wp:audit-full -- http://dameluthas.local/
 *
 * Writes merged widget census to data/audit/source-audit.json (compatible with wp:verify-widget-census).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

import { REPO_ROOT, HEADLESS_CONFIG } from "./config";
import { auditWidgetTypes, WIDGET_REGISTRY } from "./lib/widget-registry";

const OUT_DIR = join(REPO_ROOT, "data/audit");
const JSON_OUT = join(OUT_DIR, "source-audit.json");
const MD_OUT = join(OUT_DIR, "source-audit.md");

const siteArg = process.argv.find((a) => a.startsWith("http"));
const SITE_BASE = (siteArg ?? process.env.WP_AUDIT_URL ?? "http://dameluthas.local/").replace(
  /\/?$/,
  "/",
);

const graphqlUrl =
  process.env.WP_HEADLESS_GRAPHQL_URL ?? HEADLESS_CONFIG.graphql.endpoint;

/** Public WP paths in migration scope (Phase 1b matrix). */
export const FULL_SITE_AUDIT_PATHS = [
  { id: "homepage", path: "/" },
  { id: "contact", path: "/contact/" },
  { id: "case-studies", path: "/case-studies/" },
  {
    id: "portfolio-un",
    path: "/pf/united-nations-cloud-migration-fobos/",
  },
  {
    id: "portfolio-amazon",
    path: "/pf/amazon-labor-union-digital-transformation/",
  },
  {
    id: "portfolio-gatorade",
    path: "/pf/gatorade-embraces-generative-ai-powered-bottle-design/",
  },
] as const;

interface PageAudit {
  path: string;
  url: string;
  status: number;
  widgetTypes: Record<string, number>;
  elementCounts: Record<string, number>;
  h1: string;
}

interface FullSourceAudit {
  auditedAt: string;
  siteUrl: string;
  graphqlUrl: string;
  pagesAudited: string[];
  pageBreakdown: Record<string, PageAudit>;
  plugins: string[];
  themes: string[];
  widgetTypes: Record<string, number>;
  elementCounts: Record<string, number>;
  thegemWidgets: string[];
  coreWidgets: string[];
  contentTypes: string[] | string;
  widgetCensus: ReturnType<typeof auditWidgetTypes>;
}

async function fetchContentTypes(): Promise<string[] | string> {
  try {
    const res = await fetch(graphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{ contentTypes(first: 50) { nodes { name graphqlSingleName } } }`,
      }),
    });
    if (!res.ok) return `GraphQL HTTP ${res.status}`;
    const json = (await res.json()) as {
      data?: { contentTypes?: { nodes?: Array<{ graphqlSingleName: string }> } };
      errors?: unknown[];
    };
    if (json.errors?.length) return "GraphQL errors";
    return (
      json.data?.contentTypes?.nodes?.map((n) => n.graphqlSingleName).sort() ?? []
    );
  } catch (e) {
    return e instanceof Error ? e.message : "GraphQL not reachable";
  }
}

function mergeCounts(
  target: Record<string, number>,
  source: Record<string, number>,
): void {
  for (const [key, count] of Object.entries(source)) {
    target[key] = (target[key] ?? 0) + count;
  }
}

function renderMarkdown(audit: FullSourceAudit): string {
  const lines: string[] = [
    "# WP full-site source audit",
    "",
    `Site: ${audit.siteUrl}`,
    `Generated: ${audit.auditedAt}`,
    "",
    "## Pages audited",
    "",
    ...audit.pagesAudited.map((p) => `- ${p}`),
    "",
    "## Merged widget types",
    "",
    "| Widget | Count | Registry | Component |",
    "|--------|------:|----------|-----------|",
  ];

  for (const [widget, count] of Object.entries(audit.widgetTypes).sort(
    (a, b) => b[1] - a[1],
  )) {
    const entry = WIDGET_REGISTRY[widget];
    const reg = entry ? "mapped" : "**UNMAPPED**";
    const comp = entry?.component ?? (entry ? "skip" : "—");
    lines.push(`| \`${widget}\` | ${count} | ${reg} | ${comp} |`);
  }

  lines.push("", "## Per-page widget counts", "");
  for (const [id, page] of Object.entries(audit.pageBreakdown)) {
    lines.push(`### ${id} (${page.path})`, "");
    const entries = Object.entries(page.widgetTypes).sort((a, b) => b[1] - a[1]);
    if (!entries.length) {
      lines.push("_No widgets found._", "");
      continue;
    }
    for (const [w, c] of entries) {
      lines.push(`- \`${w}\` ×${c}`);
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

async function auditPage(
  page: import("playwright").Page,
  path: string,
): Promise<PageAudit> {
  const url = `${SITE_BASE.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  let status = 0;
  let dom = {
    widgetTypes: {} as Record<string, number>,
    elementCounts: {} as Record<string, number>,
    h1: "",
  };

  try {
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    status = response?.status() ?? 0;
    dom = await page.evaluate(() => {
      const widgetTypes: Record<string, number> = {};
      document.querySelectorAll("[data-widget_type]").forEach((el) => {
        const w = el.getAttribute("data-widget_type");
        if (w) widgetTypes[w] = (widgetTypes[w] ?? 0) + 1;
      });

      const elementCounts: Record<string, number> = {};
      document.querySelectorAll("[data-element_type]").forEach((el) => {
        const t = el.getAttribute("data-element_type");
        if (t) elementCounts[t] = (elementCounts[t] ?? 0) + 1;
      });

      const h1 = document.querySelector("h1")?.textContent?.trim() ?? "";
      return { widgetTypes, elementCounts, h1 };
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`    ERROR ${message}`);
    status = 0;
  }

  return { path, url, status, ...dom };
}

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Full-site audit — ${SITE_BASE}\n`);
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const pageBreakdown: Record<string, PageAudit> = {};
  const mergedWidgets: Record<string, number> = {};
  const mergedElements: Record<string, number> = {};
  const plugins = new Set<string>();
  const themes = new Set<string>();

  for (const entry of FULL_SITE_AUDIT_PATHS) {
    console.log(`  Auditing ${entry.path} ...`);
    const tab = await browser.newPage();
    const result = await auditPage(tab, entry.path);
    await tab.close();
    pageBreakdown[entry.id] = result;
    mergeCounts(mergedWidgets, result.widgetTypes);
    mergeCounts(mergedElements, result.elementCounts);

    if (result.status >= 400) {
      console.warn(`    WARN HTTP ${result.status}`);
    } else {
      const widgetCount = Object.keys(result.widgetTypes).length;
      console.log(`    OK — ${widgetCount} widget type(s), h1="${result.h1.slice(0, 40)}"`);
    }
  }

  // Plugin/theme stack from homepage
  const stackPage = await browser.newPage();
  try {
    await stackPage.goto(SITE_BASE, { waitUntil: "domcontentloaded", timeout: 60_000 });
    const stack = await stackPage.evaluate(() => {
    const plugins = new Set<string>();
    const themes = new Set<string>();
    document.querySelectorAll("link[href], script[src]").forEach((el) => {
      const u =
        (el as HTMLLinkElement).href || (el as HTMLScriptElement).src || "";
      const pluginMatch = u.match(/\/wp-content\/plugins\/([^/]+)\//);
      if (pluginMatch) plugins.add(pluginMatch[1]);
      const themeMatch = u.match(/\/wp-content\/themes\/([^/]+)\//);
      if (themeMatch) themes.add(themeMatch[1]);
    });
    return { plugins: [...plugins].sort(), themes: [...themes].sort() };
    });
    stack.plugins.forEach((p) => plugins.add(p));
    stack.themes.forEach((t) => themes.add(t));
  } catch (error) {
    console.warn(
      `  WARN could not load homepage for plugin stack: ${
        error instanceof Error ? error.message : error
      }`,
    );
  } finally {
    await stackPage.close();
  }

  await page.close();

  await browser.close();

  const contentTypes = await fetchContentTypes();
  const widgetCensus = auditWidgetTypes(mergedWidgets);

  const audit: FullSourceAudit = {
    auditedAt: new Date().toISOString(),
    siteUrl: SITE_BASE,
    graphqlUrl,
    pagesAudited: FULL_SITE_AUDIT_PATHS.map((p) => p.path),
    pageBreakdown,
    plugins: [...plugins].sort(),
    themes: [...themes].sort(),
    widgetTypes: mergedWidgets,
    elementCounts: mergedElements,
    thegemWidgets: Object.keys(mergedWidgets)
      .filter((w) => w.startsWith("thegem-"))
      .sort(),
    coreWidgets: Object.keys(mergedWidgets)
      .filter((w) => !w.startsWith("thegem-"))
      .sort(),
    contentTypes,
    widgetCensus,
  };

  writeFileSync(JSON_OUT, `${JSON.stringify(audit, null, 2)}\n`);
  writeFileSync(MD_OUT, renderMarkdown(audit));

  console.log(`\nWrote ${JSON_OUT}`);
  console.log(`Wrote ${MD_OUT}\n`);

  if (widgetCensus.unmapped.length) {
    console.error("Unmapped widget types:");
    for (const w of widgetCensus.unmapped) {
      console.error(`  ${w} ×${mergedWidgets[w] ?? 0}`);
    }
    process.exit(1);
  }

  console.log("Full-site audit PASS — all widget types mapped.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
