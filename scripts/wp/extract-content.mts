#!/usr/bin/env npx tsx
/**
 * Extract WordPress content via WPGraphQL into data/extracted/.
 *
 * Usage:
 *   npx tsx scripts/wp/extract-content.mts
 *   npx tsx scripts/wp/extract-content.mts --dry-run
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { HEADLESS_CONFIG } from "./config";
import { GraphQLClient } from "./lib/graphql-client";
import { extractContentNodes, extractMedia } from "./lib/extract-connection";
import { MENUS_QUERY, POST_EXTRA_FIELDS } from "./lib/queries";
import type { ExtractionSummary, WpContentNode, WpMenu } from "./lib/types";

const dryRun = process.argv.includes("--dry-run");
const TEMPLATE_KEYS = new Set(["templates", "titles", "footers"]);

function writeJson(name: string, data: unknown): void {
  const path = join(HEADLESS_CONFIG.paths.outputDir, name);
  if (dryRun) {
    console.log(`   [dry-run] would write ${path}`);
    return;
  }
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function deriveCaseStudies(posts: WpContentNode[]): WpContentNode[] {
  return posts.filter((post) => {
    const categories = post.categories?.nodes ?? [];
    return categories.some((category) =>
      /case[- ]?stud/i.test(category.slug) ||
      /case[- ]?stud/i.test(category.name),
    );
  });
}

function deriveServices(
  services: WpContentNode[],
  pages: WpContentNode[],
): WpContentNode[] {
  if (services.length > 0) return services;
  return pages.filter((page) => /service/i.test(page.slug));
}

async function main(): Promise<void> {
  const endpoint = HEADLESS_CONFIG.graphql.endpoint;
  console.log(`🚀 Extracting WordPress content\n   ${endpoint}\n`);

  const client = new GraphQLClient(endpoint);
  const resolvedFields: Record<string, string> = {};
  const warnings: string[] = [];
  const output: Record<string, unknown> = {};
  const hasBuilderContent = await client.probeBuilderContent();

  if (!hasBuilderContent) {
    warnings.push(
      "builderContent field unavailable — install wp:install-graphql mu-plugin for Elementor pages",
    );
  }

  mkdirSync(HEADLESS_CONFIG.paths.outputDir, { recursive: true });

  for (const item of HEADLESS_CONFIG.contentQueries) {
    if (item.key === "menus") continue;
    if (item.key === "media") continue;

    const field = await client.resolveField(item.graphqlField, item.fallbacks);

    if (!field) {
      warnings.push(`${item.label} not available in GraphQL`);
      output[item.key] = [];
      continue;
    }

    resolvedFields[item.key] = field;
    const extra =
      item.key === "posts" ? POST_EXTRA_FIELDS : "";

    console.log(`📥 ${item.label} (${field})...`);
    const nodes = await extractContentNodes(client, field, extra, {
      builderContent: hasBuilderContent,
      template: TEMPLATE_KEYS.has(item.key),
    });
    output[item.key] = nodes;
    console.log(`   ✅ ${nodes.length} items`);
  }

  const menusField = await client.resolveField("menus");
  if (menusField) {
    console.log("📥 Menus...");
    const menuData = await client.query<{ menus: { nodes: WpMenu[] } }>(
      MENUS_QUERY,
    );
    output.menus = menuData.menus.nodes;
    resolvedFields.menus = menusField;
    console.log(`   ✅ ${menuData.menus.nodes.length} menus`);
  } else {
    warnings.push("menus not available in GraphQL");
    output.menus = [];
  }

  const mediaField = await client.resolveField("mediaItems");
  if (mediaField) {
    console.log("📥 Media...");
    const media = await extractMedia(client);
    output.media = media;
    resolvedFields.media = mediaField;
    console.log(`   ✅ ${media.length} items`);
  } else {
    warnings.push("mediaItems not available in GraphQL");
    output.media = [];
  }

  const pages = (output.pages as WpContentNode[]) ?? [];
  const posts = (output.posts as WpContentNode[]) ?? [];
  const portfolio = (output.portfolio as WpContentNode[]) ?? [];
  const rawServices = (output.services as WpContentNode[]) ?? [];
  const templates = (output.templates as WpContentNode[]) ?? [];

  output.case_studies = deriveCaseStudies(posts);
  output.services = deriveServices(rawServices, pages);

  const counts: Record<string, number> = {
    pages: pages.length,
    posts: posts.length,
    portfolio: portfolio.length,
    templates: templates.length,
    titles: ((output.titles as WpContentNode[]) ?? []).length,
    footers: ((output.footers as WpContentNode[]) ?? []).length,
    services: (output.services as WpContentNode[]).length,
    case_studies: (output.case_studies as WpContentNode[]).length,
    menus: (output.menus as WpMenu[]).length,
    media: (output.media as unknown[]).length,
  };

  const summary: ExtractionSummary = {
    extractedAt: new Date().toISOString(),
    endpoint,
    counts,
    resolvedFields,
    warnings,
  };

  writeJson("pages.json", pages);
  writeJson("posts.json", posts);
  writeJson("portfolio.json", portfolio);
  writeJson("templates.json", templates);
  writeJson("titles.json", output.titles);
  writeJson("footers.json", output.footers);
  writeJson("services.json", output.services);
  writeJson("case-studies.json", output.case_studies);
  writeJson("menus.json", output.menus);
  writeJson("media.json", output.media);
  writeJson("extraction-summary.json", summary);

  console.log("\n✅ Extraction complete");
  console.log(`📁 Output: ${HEADLESS_CONFIG.paths.outputDir}/`);
  console.log("\n📊 Counts:");
  for (const [key, count] of Object.entries(counts)) {
    console.log(`   ${key}: ${count}`);
  }

  if (warnings.length) {
    console.log("\n⚠️  Warnings:");
    for (const warning of warnings) {
      console.log(`   - ${warning}`);
    }
  }

  console.log("\n   Next: npx tsx scripts/wp/map-to-supabase.mts");
}

main().catch((error) => {
  console.error("❌ Extraction failed:", error);
  process.exit(1);
});
