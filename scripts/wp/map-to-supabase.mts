#!/usr/bin/env npx tsx
/**
 * Map extracted WP JSON → Supabase seed bundle.
 *
 * Usage:
 *   npx tsx scripts/wp/map-to-supabase.mts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { HEADLESS_CONFIG } from "./config";
import type {
  SupabaseSeedBundle,
  WpContentNode,
  WpMediaItem,
  WpMenu,
} from "./lib/types";

function readJson<T>(file: string): T {
  const path = join(HEADLESS_CONFIG.paths.outputDir, file);
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function mapContentNode(
  node: WpContentNode,
  type: string,
): Record<string, unknown> {
  return {
    wp_id: node.databaseId ?? node.id,
    slug: node.slug,
    title: node.title,
    content: node.content ?? "",
    excerpt: node.excerpt ?? "",
    status: node.status ?? "publish",
    published_at: node.date ?? null,
    featured_image_url: node.featuredImage?.node.sourceUrl ?? null,
    featured_image_alt: node.featuredImage?.node.altText ?? "",
    type,
    uri: node.uri ?? null,
  };
}

function main(): void {
  console.log("🗂️  Mapping extracted content → Supabase seed bundle\n");

  const pages = readJson<WpContentNode[]>("pages.json");
  const posts = readJson<WpContentNode[]>("posts.json");
  const portfolio = readJson<WpContentNode[]>("portfolio.json");
  const services = readJson<WpContentNode[]>("services.json");
  const caseStudies = readJson<WpContentNode[]>("case-studies.json");
  const menus = readJson<WpMenu[]>("menus.json");
  const media = readJson<WpMediaItem[]>("media.json");

  const bundle: SupabaseSeedBundle = {
    generatedAt: new Date().toISOString(),
    portfolio_items: portfolio.map((item) => mapContentNode(item, "portfolio")),
    case_studies: caseStudies.map((item) =>
      mapContentNode(item, "case_study"),
    ),
    services: services.map((item) => mapContentNode(item, "service")),
    pages: pages.map((item) => mapContentNode(item, "page")),
    posts: posts.map((item) => mapContentNode(item, "post")),
    menus,
    media,
  };

  const outPath = join(HEADLESS_CONFIG.paths.outputDir, "supabase-seed.json");
  writeFileSync(outPath, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");

  console.log("✅ Seed bundle written");
  console.log(`   ${outPath}`);
  console.log("\n📊 Records:");
  console.log(`   portfolio_items: ${bundle.portfolio_items.length}`);
  console.log(`   case_studies:    ${bundle.case_studies.length}`);
  console.log(`   services:        ${bundle.services.length}`);
  console.log(`   pages:           ${bundle.pages.length}`);
  console.log(`   posts:           ${bundle.posts.length}`);
  console.log(`   menus:           ${bundle.menus.length}`);
  console.log(`   media:           ${bundle.media.length}`);
}

main();
