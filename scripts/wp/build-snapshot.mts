#!/usr/bin/env npx tsx
/**
 * Fast headless pilot bootstrap — parse SQL dump directly (no MySQL, no WP restore).
 *
 * Usage:
 *   npx tsx scripts/wp/build-snapshot.mts
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { HEADLESS_CONFIG } from "./config";
import {
  extractWpPostsFromDump,
  isPilotContent,
  type WpPostRow,
} from "./lib/sql-dump-parser";

function toContentItem(row: WpPostRow) {
  return {
    id: row.id,
    slug: row.postName,
    title: row.postTitle,
    content: row.postContent,
    excerpt: row.postExcerpt,
    postType: row.postType,
    status: row.postStatus,
    date: row.postDate,
    uri: `/${row.postType === "thegem_pf_item" ? "portfolio" : ""}/${row.postName}`.replace("//", "/"),
    featuredImageUrl: extractFeaturedImage(row.postContent),
  };
}

function extractFeaturedImage(html: string): string | null {
  const match = html.match(/src=["']([^"']+\.(?:jpg|jpeg|png|webp|gif))["']/i);
  return match?.[1] ?? null;
}

function main(): void {
  console.log("⚡ Building headless snapshot from SQL dump (no MySQL)\n");

  const dumpPath = HEADLESS_CONFIG.paths.dbDump;
  const sql = readFileSync(dumpPath, "utf8");
  const allRows = extractWpPostsFromDump(sql);
  const curated = allRows.filter(isPilotContent);

  const pages = curated
    .filter((row) => row.postType === "page")
    .map(toContentItem);
  const portfolio = curated
    .filter((row) => row.postType === "thegem_pf_item")
    .map(toContentItem);
  const posts = curated
    .filter((row) => row.postType === "post")
    .map(toContentItem);

  const snapshot = {
    generatedAt: new Date().toISOString(),
    source: dumpPath,
    site: {
      title: "Dame Luthas",
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    },
    pages,
    portfolio,
    posts,
  };

  const outDir = join(process.cwd(), "data/snapshot");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "snapshot.json");
  writeFileSync(outPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

  console.log(`✅ Snapshot written: ${outPath}`);
  console.log(`   pages:     ${pages.length}`);
  console.log(`   portfolio: ${portfolio.length}`);
  console.log(`   posts:     ${posts.length}`);
  console.log("\n   Run: npm run dev");
}

main();
