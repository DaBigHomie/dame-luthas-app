#!/usr/bin/env npx tsx
/**
 * Phase 1 — WP/Elementor source audit (work manifest).
 *
 *   npm run wp:audit-source
 *   npm run wp:audit-source -- http://site-two.local/
 *
 * Outputs:
 *   data/audit/source-audit.json
 *   data/audit/source-audit.md
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
const SITE = siteArg ?? process.env.WP_AUDIT_URL ?? "http://dameluthas.local/";
const graphqlUrl =
  process.env.WP_HEADLESS_GRAPHQL_URL ?? HEADLESS_CONFIG.graphql.endpoint;

interface SourceAudit {
  auditedAt: string;
  siteUrl: string;
  graphqlUrl: string;
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
    if (json.errors?.length) return "GraphQL errors — see source-audit.json";
    return (
      json.data?.contentTypes?.nodes?.map((n) => n.graphqlSingleName).sort() ?? []
    );
  } catch (e) {
    return e instanceof Error ? e.message : "GraphQL not reachable";
  }
}

function renderMarkdown(audit: SourceAudit): string {
  const lines: string[] = [
    "# WP source audit",
    "",
    `Site: ${audit.siteUrl}`,
    `Generated: ${audit.auditedAt}`,
    "",
    "## Plugin stack (from asset URLs)",
    "",
    ...audit.plugins.map((p) => `- ${p}`),
    "",
    "## Themes",
    "",
    ...audit.themes.map((t) => `- ${t}`),
    "",
    "## Widget types (data-widget_type)",
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

  if (audit.widgetCensus.unmapped.length) {
    lines.push("", "## Unmapped widget types (fix before migrate)", "");
    for (const w of audit.widgetCensus.unmapped) {
      const c = audit.widgetTypes[w] ?? 0;
      lines.push(`- \`${w}\` ×${c}`);
    }
  }

  lines.push("", "## Elementor structure", "", "| data-element_type | Count |", "|-------------------|------:|");
  for (const [el, count] of Object.entries(audit.elementCounts).sort(
    (a, b) => b[1] - a[1],
  )) {
    lines.push(`| ${el} | ${count} |`);
  }

  lines.push("", "## Content types (GraphQL)", "");
  if (Array.isArray(audit.contentTypes)) {
    lines.push(audit.contentTypes.map((t) => `- ${t}`).join("\n"));
  } else {
    lines.push(String(audit.contentTypes));
  }

  lines.push("");
  return lines.join("\n");
}

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Auditing ${SITE} ...`);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(SITE, { waitUntil: "networkidle", timeout: 60_000 });

  const domAudit = await page.evaluate(() => {
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

    return {
      plugins: [...plugins].sort(),
      themes: [...themes].sort(),
      widgetTypes,
      elementCounts,
      thegemWidgets: Object.keys(widgetTypes)
        .filter((w) => w.startsWith("thegem-"))
        .sort(),
      coreWidgets: Object.keys(widgetTypes)
        .filter((w) => !w.startsWith("thegem-"))
        .sort(),
    };
  });

  await browser.close();

  const contentTypes = await fetchContentTypes();
  const widgetCensus = auditWidgetTypes(domAudit.widgetTypes);

  const audit: SourceAudit = {
    auditedAt: new Date().toISOString(),
    siteUrl: SITE,
    graphqlUrl,
    ...domAudit,
    contentTypes,
    widgetCensus,
  };

  writeFileSync(JSON_OUT, `${JSON.stringify(audit, null, 2)}\n`);
  writeFileSync(MD_OUT, renderMarkdown(audit));

  console.log(`\nWrote ${JSON_OUT}`);
  console.log(`Wrote ${MD_OUT}\n`);
  console.log("Widget types on page:");
  for (const [w, c] of Object.entries(domAudit.widgetTypes).sort(
    (a, b) => b[1] - a[1],
  )) {
    const flag = widgetCensus.unmapped.includes(w) ? " UNMAPPED" : "";
    console.log(`  ${w} ×${c}${flag}`);
  }

  if (widgetCensus.unmapped.length) {
    console.log(
      `\n${widgetCensus.unmapped.length} unmapped widget type(s) — add to scripts/wp/lib/widget-registry.ts before migrating.`,
    );
    process.exit(1);
  }

  console.log("\nAll widget types mapped in registry.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
