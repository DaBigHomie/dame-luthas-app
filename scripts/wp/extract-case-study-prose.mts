#!/usr/bin/env npx tsx
/**
 * Extract stripped portfolio prose from content.json into native TS modules.
 * Usage: npx tsx scripts/wp/extract-case-study-prose.mts [slug...]
 */
import * as cheerio from "cheerio";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const DEFAULT_SLUGS = [
  "amazon-labor-union-digital-transformation",
  "gatorade-embraces-generative-ai-powered-bottle-design",
  "united-nations-cloud-migration-fobos",
];

const SLUGS = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_SLUGS;

interface PortfolioItem {
  slug: string;
  excerpt?: string;
  bodyHtml: string;
}

function decodeHtmlEntities(value: string): string {
  return cheerio.load(`<p>${value}</p>`, null, false).text();
}

function parseGalleryItems(html: string) {
  const $ = cheerio.load(html);
  const items: { thumbSrc: string; fullSrc: string; alt: string }[] = [];
  const seen = new Set<string>();
  $(".gallery-item, .gem-gallery-grid .gallery-set li").each((_, el) => {
    const $el = $(el);
    const fullSrc =
      $el.find("a.gallery-item-link").attr("href") ??
      $el.find('a[href*="/assets/"]').first().attr("href") ??
      "";
    const thumbSrc =
      $el.find("img").attr("src") ??
      $el.find("source").attr("srcset")?.split(" ")[0] ??
      fullSrc;
    const alt = $el.find("img").attr("alt") ?? "";
    const key = fullSrc || thumbSrc;
    if (!key || seen.has(key)) return;
    seen.add(key);
    items.push({ thumbSrc, fullSrc: fullSrc || thumbSrc, alt });
  });
  return items;
}

function parseDiagramSkills(html: string) {
  const $ = cheerio.load(html);
  const skills: { label: string; percent: number }[] = [];
  $(".skill-element, .digram-line-box .skill-element").each((_, el) => {
    const label = $(el).find(".diagram-skill-title").first().text().trim();
    const amountText = $(el).find(".diagram-skill-amount").first().text().trim();
    const percent = Number.parseInt(amountText.replace(/[^\d]/g, ""), 10);
    if (!label || Number.isNaN(percent)) return;
    skills.push({ label, percent });
  });
  return skills;
}

function stripExtractedPortfolioSections(html: string): string {
  const $ = cheerio.load(html);
  $(
    ".gem-gallery-grid, .gallery-preloader-wrapper, .digram-line-box, .diagram-item, .gem-testimonials, .thegem-testimonials, .preloader, .portfolio-filters, .portfolio-top-panel, .thegem-animated-heading, [data-widget_type=\"image.default\"]",
  ).remove();
  $('p:has(span.highlight:contains("…"))').remove();
  $('p:has(span.highlight)').each((_, el) => {
    const text = $(el).text().trim();
    if (text === "…" || text === "...") $(el).remove();
  });
  $("h1").first().remove();
  const body = $("body").length ? $("body").html() : $.root().html();
  return (body ?? "")
    .replace(/<p>\s*<span class="highlight">(?:&#8230;|…|\.\.\.)<\/span>\s*<\/p>/gi, "")
    .trim();
}

function slugToFileBase(slug: string): string {
  if (slug.includes("amazon")) return "amazon-labor";
  if (slug.includes("gatorade")) return "gatorade";
  if (slug.includes("united-nations")) return "united-nations";
  return slug.split("-").slice(0, 2).join("-");
}

function exportNames(slug: string): {
  prose: string;
  gallery: string;
  skills: string;
} {
  if (slug.includes("amazon")) {
    return {
      prose: "amazonLaborProseHtml",
      gallery: "amazonLaborGallery",
      skills: "amazonLaborSkills",
    };
  }
  if (slug.includes("gatorade")) {
    return {
      prose: "gatoradeProseHtml",
      gallery: "gatoradeGallery",
      skills: "gatoradeSkills",
    };
  }
  return {
    prose: "unitedNationsProseHtml",
    gallery: "unitedNationsGallery",
    skills: "unitedNationsSkills",
  };
}

function resolveProseHtml(item: PortfolioItem): string {
  let proseHtml = stripExtractedPortfolioSections(item.bodyHtml);
  const textOnly = cheerio.load(proseHtml).text().replace(/\s+/g, " ").trim();
  if (textOnly.length < 120 && item.excerpt) {
    const intro = decodeHtmlEntities(item.excerpt);
    proseHtml = `<div class="case-study-intro"><p>${intro}</p></div>`;
  }
  return proseHtml;
}

const data = JSON.parse(
  readFileSync(join(process.cwd(), "data/migrated/content.json"), "utf8"),
) as { portfolio: PortfolioItem[] };

const outDir = join(process.cwd(), "src/content/case-studies/prose");
mkdirSync(outDir, { recursive: true });

for (const slug of SLUGS) {
  const item = data.portfolio.find((p) => p.slug === slug);
  if (!item) {
    console.error(`Missing portfolio slug: ${slug}`);
    process.exit(1);
  }
  const gallery = parseGalleryItems(item.bodyHtml);
  const skills = parseDiagramSkills(item.bodyHtml);
  const proseHtml = resolveProseHtml(item);
  const shortName = slugToFileBase(slug);
  const names = exportNames(slug);
  const outPath = join(outDir, `${shortName}.ts`);
  const body = `/** Auto-extracted from data/migrated/content.json — regenerate via scripts/wp/extract-case-study-prose.mts */
export const ${names.prose} = ${JSON.stringify(proseHtml)};

export const ${names.gallery} = ${JSON.stringify(gallery, null, 2)} as const;

export const ${names.skills} = ${JSON.stringify(skills, null, 2)} as const;
`;
  writeFileSync(outPath, body);
  console.log(
    `Wrote ${outPath} (prose ${proseHtml.length} chars, gallery ${gallery.length}, skills ${skills.length})`,
  );
}
