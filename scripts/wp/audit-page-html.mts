#!/usr/bin/env npx tsx
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import * as cheerio from "cheerio";

const pages = JSON.parse(readFileSync("data/extracted/pages.json", "utf8")) as Array<{
  databaseId: number;
  content?: string;
}>;
const page = pages.find((p) => p.databaseId === 375);
if (!page?.content) throw new Error("page 375 missing in data/extracted/pages.json");

mkdirSync("data/fixtures", { recursive: true });
writeFileSync("data/fixtures/page-375.html", page.content);

const $ = cheerio.load(page.content);
const menuSel = ".thegem-menu-custom, .elementor-widget-thegem-custom-menu";
console.log("menu-custom widgets", $(menuSel).length);
$(menuSel).each((i, el) => {
  const title = $(el).find("h3, .thegem-custom-menu-title, .menu-custom-title").first().text().trim();
  const links = $(el)
    .find("a")
    .map((_, a) => $(a).text().trim())
    .get()
    .filter(Boolean);
  console.log(`  [${i}]`, title || "(no title)", "links:", links.slice(0, 5).join(" | "));
});

console.log("client widgets", $(".gem-client, .elementor-widget-thegem-clients").length);
$(".gem-client img, .elementor-widget-thegem-clients img").each((i, img) => {
  console.log(`  logo ${i}`, $(img).attr("alt"), $(img).attr("src")?.slice(-50));
});

console.log("testimonial widgets", $(".gem-testimonials, .elementor-widget-thegem-testimonials").length);
$(".gem-testimonial-item, .testimonials-item").each((i, el) => {
  const quote = $(el).find(".summary, .testimonials-summary, blockquote").first().text().trim();
  const author = $(el).find(".author, .testimonials-author, .name").first().text().trim();
  console.log(`  [${i}]`, author, quote.slice(0, 80));
});

console.log("rotating phrases");
$(".rotating-text, .thegem-heading-rotating").each((i, el) => {
  const texts = $(el)
    .find("span, .thegem-heading-word")
    .map((_, s) => $(s).text().trim())
    .get()
    .filter(Boolean);
  console.log(`  [${i}]`, texts.join(" / "));
});
