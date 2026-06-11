#!/usr/bin/env npx tsx
/**
 * Capture reference screenshots from live local WP.
 *
 * Usage:
 *   npx tsx scripts/wp/capture-screenshots.mts
 *   WP_BASE_URL=http://dameluthas.local npx tsx scripts/wp/capture-screenshots.mts
 */

import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const BASE_URL = process.env.WP_BASE_URL ?? "http://dameluthas.local";
const OUT_DIR = join(process.cwd(), "data/screenshots/wp-reference");

const ROUTES = [
  { name: "home", path: "/" },
  { name: "portfolio", path: "/case-studies" },
  { name: "contact", path: "/contact" },
  { name: "about", path: "/about" },
  {
    name: "portfolio-un",
    path: "/pf/united-nations-cloud-migration-fobos/",
  },
];

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log(`📸 Capturing ${BASE_URL} → ${OUT_DIR}\n`);

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route.path}`;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(1500);
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
  console.log(`\nDone. Screenshots in ${OUT_DIR}`);
}

main().catch((error) => {
  console.error("❌ Screenshot capture failed:", error);
  process.exit(1);
});
