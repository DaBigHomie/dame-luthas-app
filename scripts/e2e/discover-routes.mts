#!/usr/bin/env npx tsx
/**
 * Layer 1 — Discover public Next.js routes for E2E manifest.
 *
 *   npm run discover:routes
 *
 * Sources:
 *   - App Router static segments under src/app
 *   - data/migrated/content.json pages + portfolio slugs
 *   - scripts/wp/verify-public-routes matrix (redirects)
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

import type { RouteInfo, RouteManifest } from "../../e2e/fixtures/types";

const ROOT = process.cwd();
const APP_DIR = join(ROOT, "src/app");
const OUTPUT = join(ROOT, "reports/route-manifest.json");
const MIGRATED = join(ROOT, "data/migrated/content.json");

function walkAppRoutes(dir: string, segments: string[] = []): string[] {
  if (!existsSync(dir)) return [];

  const routes: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;

    if (entry.startsWith("(") && entry.endsWith(")")) {
      routes.push(...walkAppRoutes(full, segments));
      continue;
    }

    const nextSegments = [...segments, entry];
    const pageFile = join(full, "page.tsx");
    if (existsSync(pageFile)) {
      const routePath =
        "/" +
        nextSegments
          .filter((s) => !s.startsWith("["))
          .join("/")
          .replace(/\/+/g, "/");
      if (routePath !== "/") routes.push(routePath.replace(/\/$/, "") || "/");
      if (nextSegments.some((s) => s.startsWith("["))) {
        // dynamic segment — expanded below from migrated content
      }
    }
    routes.push(...walkAppRoutes(full, nextSegments));
  }
  return routes;
}

function loadMigratedRoutes(): string[] {
  if (!existsSync(MIGRATED)) return [];

  const data = JSON.parse(readFileSync(MIGRATED, "utf8")) as {
    pages?: Array<{ slug: string }>;
    portfolio?: Array<{ slug: string; href: string }>;
  };

  const paths = new Set<string>();

  for (const page of data.pages ?? []) {
    if (page.slug === "home") continue;
    paths.add(`/${page.slug}`);
  }

  paths.add("/portfolio");
  for (const item of data.portfolio ?? []) {
    paths.add(item.href.replace(/\/$/, "") || `/portfolio/${item.slug}`);
  }

  // WP /pf/* redirect parity
  for (const item of data.portfolio ?? []) {
    paths.add(`/pf/${item.slug}`);
  }

  return [...paths];
}

function categorize(path: string): RouteInfo["category"] {
  if (path === "/") return "homepage";
  if (path.startsWith("/portfolio") || path.startsWith("/pf/")) return "portfolio";
  return "content";
}

function labelFor(path: string): string {
  if (path === "/") return "Home";
  return path
    .replace(/^\//, "")
    .split("/")
    .map((s) => s.replace(/-/g, " "))
    .join(" / ");
}

function buildManifest(): RouteManifest {
  const discovered = new Set<string>(["/", ...walkAppRoutes(APP_DIR), ...loadMigratedRoutes()]);

  const routes: RouteInfo[] = [...discovered]
    .filter(Boolean)
    .sort()
    .map((path) => {
      const normalized = path === "/" ? "/" : path.replace(/\/$/, "");
      const critical =
        normalized === "/" ||
        ["/contact", "/about", "/case-studies", "/portfolio"].includes(normalized) ||
        normalized.startsWith("/portfolio/");

      return {
        path: normalized,
        name: labelFor(normalized),
        category: categorize(normalized),
        expectH1: normalized !== "/" && normalized !== "/portfolio",
        tags: critical ? ["@critical"] : ["@extended"],
      };
    });

  return {
    version: "1.0",
    generatedAt: new Date().toISOString(),
    routeCount: routes.length,
    routes,
  };
}

function main(): void {
  mkdirSync(join(ROOT, "reports"), { recursive: true });
  const manifest = buildManifest();
  writeFileSync(OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Wrote ${relative(ROOT, OUTPUT)} (${manifest.routeCount} routes)`);
  for (const route of manifest.routes.filter((r) => r.tags.includes("@critical"))) {
    console.log(`  @critical ${route.path}`);
  }
}

main();
