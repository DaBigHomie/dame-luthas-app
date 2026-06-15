#!/usr/bin/env npx tsx
/**
 * Seed Supabase tables from data/wp-extract/supabase-seed.json (from wp:map).
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL in env.
 *
 * Usage:
 *   npm run wp:map
 *   npm run db:seed
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { HEADLESS_CONFIG } from "../wp/config";
import type { SupabaseSeedBundle } from "../wp/lib/types";

type ContentRow = Record<string, unknown>;

function loadBundle(): SupabaseSeedBundle {
  const path = join(HEADLESS_CONFIG.paths.outputDir, "supabase-seed.json");
  if (!existsSync(path)) {
    throw new Error(
      `Missing ${path}. Run: npm run wp:extract && npm run wp:map`,
    );
  }
  return JSON.parse(readFileSync(path, "utf8")) as SupabaseSeedBundle;
}

function mapStatus(raw: unknown): "draft" | "publish" | "archived" {
  const s = String(raw ?? "publish").toLowerCase();
  if (s === "draft") return "draft";
  if (s === "archived" || s === "private") return "archived";
  return "publish";
}

function mapPortfolio(row: ContentRow, index: number) {
  return {
    wp_id: row.wp_id ?? null,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    body_html: row.content ?? "",
    href: row.uri ?? `/portfolio/${row.slug}`,
    featured_image_url: row.featured_image_url ?? null,
    featured_image_alt: row.featured_image_alt ?? "",
    status: mapStatus(row.status),
    sort_order: index,
    published_at: row.published_at ?? null,
    metadata: { type: row.type ?? "portfolio" },
  };
}

function mapService(row: ContentRow, index: number) {
  return {
    wp_id: row.wp_id ?? null,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    body_html: row.content ?? "",
    href: row.uri ?? `/services/${row.slug}`,
    featured_image_url: row.featured_image_url ?? null,
    featured_image_alt: row.featured_image_alt ?? "",
    status: mapStatus(row.status),
    sort_order: index,
    published_at: row.published_at ?? null,
    metadata: { type: row.type ?? "service" },
  };
}

function mapPage(row: ContentRow, index: number) {
  return {
    wp_id: row.wp_id ?? null,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    body_html: row.content ?? "",
    href: row.uri ?? `/${row.slug}`,
    featured_image_url: row.featured_image_url ?? null,
    featured_image_alt: row.featured_image_alt ?? "",
    status: mapStatus(row.status),
    menu_order: index,
    published_at: row.published_at ?? null,
  };
}

function mapPost(row: ContentRow) {
  return {
    wp_id: row.wp_id ?? null,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    body_html: row.content ?? "",
    featured_image_url: row.featured_image_url ?? null,
    featured_image_alt: row.featured_image_alt ?? "",
    status: mapStatus(row.status),
    published_at: row.published_at ?? null,
  };
}

async function upsert(
  baseUrl: string,
  serviceKey: string,
  table: string,
  rows: Record<string, unknown>[],
  onConflict: string,
): Promise<void> {
  if (rows.length === 0) return;
  const url = new URL(`${baseUrl}/rest/v1/${table}`);
  url.searchParams.set("on_conflict", onConflict);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: `resolution=merge-duplicates,return=minimal`,
    },
    body: JSON.stringify(rows),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`${table} upsert failed (${response.status}): ${detail}`);
  }
  console.log(`   ${table}: ${rows.length} rows`);
}

async function main(): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!baseUrl || !serviceKey) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before seeding.",
    );
  }

  const bundle = loadBundle();
  console.log("🌱 Seeding Supabase from WP extract bundle\n");

  await upsert(
    baseUrl,
    serviceKey,
    "portfolio_items",
    bundle.portfolio_items.map(mapPortfolio),
    "slug",
  );
  await upsert(
    baseUrl,
    serviceKey,
    "services",
    bundle.services.map(mapService),
    "slug",
  );
  await upsert(
    baseUrl,
    serviceKey,
    "pages",
    bundle.pages.map(mapPage),
    "slug",
  );
  await upsert(
    baseUrl,
    serviceKey,
    "posts",
    bundle.posts.map(mapPost),
    "slug",
  );

  if (bundle.menus.length > 0) {
    const menuRows = bundle.menus.map((menu) => ({
      slug: menu.slug,
      name: menu.name,
      items: menu.menuItems,
    }));
    await upsert(baseUrl, serviceKey, "navigation_menus", menuRows, "slug");
  }

  console.log("\n✅ Seed complete");
  console.log(
    "   case_studies + structured sections: wire via admin or native registry import.",
  );
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
