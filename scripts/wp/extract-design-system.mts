#!/usr/bin/env npx tsx
/**
 * Capture computed design tokens from live WP at multiple breakpoints.
 * Run: npm run wp:extract-design-system
 * Requires: local WP at dameluthas.local, Playwright chromium
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

import { REPO_ROOT } from "./config";

const URL = process.env.WP_SITE_URL ?? "http://dameluthas.local/";
const OUT = join(REPO_ROOT, "data/extracted/design-system.json");

const SELECTORS = {
  heroH1: ".thegem-heading",
  heroBody: "p",
  navLink: ".thegem-menu-custom a",
  button: ".gem-button, .elementor-button",
  section: ".e-con.e-parent",
};

const BREAKPOINTS = [1800, 1200, 1024, 767];

async function main(): Promise<void> {
  mkdirSync(join(REPO_ROOT, "data/extracted"), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const tokens: Record<string, unknown> = { byBreakpoint: {} };

  for (const width of BREAKPOINTS) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(URL, { waitUntil: "networkidle" });
    const snapshot = await page.evaluate((sel) => {
      const cs = (el: Element | null) => (el ? getComputedStyle(el) : null);
      const grab = (selector: string) => {
        const el = document.querySelector(selector);
        const s = cs(el);
        if (!s) return null;
        return {
          fontFamily: s.fontFamily.split(",")[0]?.replace(/['"]/g, "") ?? "",
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          lineHeight: s.lineHeight,
          color: s.color,
          background: s.backgroundColor,
        };
      };
      const out: Record<string, unknown> = {};
      for (const [key, selector] of Object.entries(sel)) {
        out[key] = grab(selector as string);
      }
      out.bodyBg = getComputedStyle(document.body).backgroundColor;
      return out;
    }, SELECTORS);

    (tokens.byBreakpoint as Record<number, unknown>)[width] = snapshot;
  }

  writeFileSync(OUT, `${JSON.stringify(tokens, null, 2)}\n`, "utf8");
  await browser.close();
  console.log(`Wrote ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
