#!/usr/bin/env npx tsx
/**
 * Capture Next.js migrated pages for visual QA vs WP reference shots.
 *
 * Usage:
 *   npx tsx scripts/wp/capture-next-screenshots.mts
 *   NEXT_BASE_URL=http://localhost:3000 npx tsx scripts/wp/capture-next-screenshots.mts
 */

import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const BASE_URL = process.env.NEXT_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = join(process.cwd(), "data/screenshots/next-reference");

const ROUTES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "contact", path: "/contact" },
  { name: "portfolio", path: "/portfolio" },
  { name: "case-studies", path: "/case-studies" },
];

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  console.log(`📸 Capturing Next.js ${BASE_URL} → ${OUT_DIR}\n`);

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route.path}`;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(1000);
      const file = join(OUT_DIR, `${route.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`✅ ${route.name}: ${url}`);
    } catch (error) {
      console.warn(
        `⚠️  ${route.name}: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  await browser.close();
  console.log(`\nDone. Compare with data/screenshots/wp-reference/`);
}

main().catch((error) => {
  console.error("❌ Next screenshot capture failed:", error);
  process.exit(1);
});
