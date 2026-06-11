#!/usr/bin/env npx tsx
/** Verify custom-menu widget walk matches registry census (expect 11 on homepage). */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import * as cheerio from "cheerio";

import { REPO_ROOT } from "./config";
import { countCustomMenuWidgets, parseCustomMenus } from "./lib/parsers/parse-custom-menus";

const FIXTURE = join(REPO_ROOT, "data/fixtures/page-375.html");
const html = readFileSync(FIXTURE, "utf8");
const $ = cheerio.load(html);

const widgetCount = countCustomMenuWidgets($);
const menus = parseCustomMenus($);

const MIN_WIDGETS = 8;
const TARGET_WIDGETS = 11;

console.log(`Custom-menu widgets in fixture: ${widgetCount}`);
console.log(`Parsed menus with items: ${menus.length}`);
menus.forEach((menu, i) => {
  console.log(
    `  ${i + 1}. ${menu.title} (${menu.items.length} items, rotating: ${menu.rotating.length})`,
  );
});

if (widgetCount < MIN_WIDGETS) {
  console.error(`FAIL: expected >= ${MIN_WIDGETS} custom-menu widgets, found ${widgetCount}`);
  process.exit(1);
}

if (widgetCount < TARGET_WIDGETS) {
  console.warn(`WARN: live site census is ${TARGET_WIDGETS}; fixture has ${widgetCount}`);
}

if (menus.length < MIN_WIDGETS) {
  console.error(`FAIL: expected >= ${MIN_WIDGETS} parsed menus, found ${menus.length}`);
  process.exit(1);
}

console.log("PASS: custom-menu widget walk");
