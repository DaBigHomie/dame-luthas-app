#!/usr/bin/env npx tsx
/**
 * Phase 6 — Widget census verification.
 * Diff source audit widget counts against widget-registry coverage.
 *
 *   npm run wp:verify-widget-census
 *
 * Requires: data/audit/source-audit.json (run wp:audit-source first)
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { REPO_ROOT } from "./config";
import {
  auditWidgetTypes,
  WIDGET_REGISTRY,
  type WidgetCensusResult,
} from "./lib/widget-registry";

const AUDIT_PATH = join(REPO_ROOT, "data/audit/source-audit.json");

interface SourceAuditFile {
  siteUrl: string;
  auditedAt: string;
  widgetTypes: Record<string, number>;
  widgetCensus?: WidgetCensusResult;
  pagesAudited?: string[];
}

function main(): void {
  if (!existsSync(AUDIT_PATH)) {
    console.error(
      `Missing ${AUDIT_PATH}\nRun: npm run wp:audit-source -- http://your-site.local/`,
    );
    process.exit(1);
  }

  const audit = JSON.parse(readFileSync(AUDIT_PATH, "utf8")) as SourceAuditFile;
  const census = auditWidgetTypes(audit.widgetTypes);

  console.log(`\nWidget census — ${audit.siteUrl}`);
  console.log(`Audit from: ${audit.auditedAt}\n`);

  console.log("Mapped (component assigned):");
  for (const row of census.mapped.sort((a, b) => b.count - a.count)) {
    console.log(`  ${row.widgetType} ×${row.count} → ${row.component}`);
  }

  console.log("\nExplicit skips (component: null):");
  for (const row of census.skipped) {
    const count = audit.widgetTypes[row.widgetType] ?? 0;
    console.log(`  ${row.widgetType} ×${count}${row.note ? ` — ${row.note}` : ""}`);
  }

  if (census.unmapped.length) {
    console.log("\nGAPS — unmapped widget types:");
    for (const g of census.gaps) {
      console.log(`  ${g.widgetType} ×${g.count} — ${g.reason}`);
    }
    process.exit(1);
  }

  // Orphan registry entries (documented handlers never seen on this site)
  const seen = new Set(Object.keys(audit.widgetTypes));
  const orphans = Object.keys(WIDGET_REGISTRY).filter((k) => !seen.has(k));
  if (orphans.length) {
    const scope =
      Array.isArray(audit.pagesAudited) && audit.pagesAudited.length > 1
        ? "full-site audit"
        : "homepage-only audit";
    console.log(`\nRegistry entries not present on ${scope} (informational):`);
    for (const o of orphans) {
      console.log(`  ${o}`);
    }
  }

  console.log("\nCensus PASS — every widget type on source page has a registry entry.");
}

main();
