#!/usr/bin/env npx tsx
/**
 * Extract homepage sections from WPGraphQL page 375 → src/content/*.ts
 *
 * Usage:
 *   npm run wp:extract-content
 *   npm run wp:extract-content -- --dry-run
 *   npm run wp:extract-content -- --fixture
 *   npm run wp:extract-content -- --page-id=375 --all-services
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { HEADLESS_CONFIG, REPO_ROOT } from "./config";
import { emitContentModules } from "./lib/emit-content";
import { GraphQLClient } from "./lib/graphql-client";
import { parseHomepageHtml } from "./lib/parsers/parse-homepage";

const dryRun = process.argv.includes("--dry-run");
const useFixture = process.argv.includes("--fixture");
const allServices = process.argv.includes("--all-services");
const pageIdArg = process.argv.find((a) => a.startsWith("--page-id="));
const pageId = pageIdArg ? Number(pageIdArg.split("=")[1]) : 375;

const FIXTURE_PATH = join(REPO_ROOT, "data/fixtures/page-375.html");
const EXTRACTED_DIR = HEADLESS_CONFIG.paths.outputDir;

async function loadHomepageHtml(): Promise<string> {
  if (useFixture || !process.env.WP_HEADLESS_GRAPHQL_URL) {
    if (!existsSync(FIXTURE_PATH)) {
      const pagesPath = join(EXTRACTED_DIR, "pages.json");
      if (existsSync(pagesPath)) {
        const pages = JSON.parse(readFileSync(pagesPath, "utf8")) as Array<{
          databaseId: number;
          content?: string;
        }>;
        const page = pages.find((p) => p.databaseId === pageId);
        if (page?.content) {
          mkdirSync(join(REPO_ROOT, "data/fixtures"), { recursive: true });
          writeFileSync(FIXTURE_PATH, page.content, "utf8");
          return page.content;
        }
      }
      throw new Error(
        `Fixture missing: ${FIXTURE_PATH}. Run wp:extract-live or set WP_HEADLESS_GRAPHQL_URL.`,
      );
    }
    return readFileSync(FIXTURE_PATH, "utf8");
  }

  const client = new GraphQLClient(HEADLESS_CONFIG.graphql.endpoint);
  const data = await client.query<{
    page: { content: string | null };
  }>(`{
    page(id: ${pageId}, idType: DATABASE_ID) {
      content(format: RENDERED)
    }
  }`);

  const html = data.page.content;
  if (!html) throw new Error(`Page ${pageId} returned empty content`);
  mkdirSync(join(REPO_ROOT, "data/fixtures"), { recursive: true });
  writeFileSync(FIXTURE_PATH, html, "utf8");
  return html;
}

async function main(): Promise<void> {
  console.log(`Extracting homepage content (page ${pageId})…\n`);

  const html = await loadHomepageHtml();
  const parsed = parseHomepageHtml(html, { allServices });

  const report = {
    generatedAt: new Date().toISOString(),
    sourcePageId: pageId,
    counts: {
      services: parsed.services.length,
      clients: parsed.clients.length,
      testimonials: parsed.testimonials.length,
      rotatingPhrases: parsed.rotatingPhrases.length,
      sections: parsed.sections.length,
      assets: parsed.assetUrls.length,
    },
    warnings: [] as string[],
  };

  if (parsed.services.length === 0) {
    report.warnings.push("No service cards parsed — check .nav-menu-custom selectors");
  }
  if (parsed.clients.length === 0) {
    report.warnings.push("No client logos parsed — check .gem-client selectors");
  }
  if (parsed.testimonials.length === 0) {
    report.warnings.push("No testimonials parsed — check .gem-testimonial-item selectors");
  }

  mkdirSync(EXTRACTED_DIR, { recursive: true });
  writeFileSync(
    join(EXTRACTED_DIR, "asset-manifest.json"),
    `${JSON.stringify({ urls: parsed.assetUrls }, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    join(EXTRACTED_DIR, "extract-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8",
  );

  console.log("Parsed:", report.counts);
  if (report.warnings.length) {
    console.warn("Warnings:", report.warnings.join("; "));
  }

  if (dryRun) {
    console.log("\n[dry-run] Skipping src/content emit");
    return;
  }

  emitContentModules(REPO_ROOT, parsed, pageId);
  console.log("\nWrote src/content/*.ts");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
