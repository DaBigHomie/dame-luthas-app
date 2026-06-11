import "server-only";

import * as cheerio from "cheerio";

import type { DiagramSkill, GalleryItem } from "@/shared/types/portfolio-widgets";

export function parseGalleryItems(html: string): GalleryItem[] {
  const $ = cheerio.load(html);
  const items: GalleryItem[] = [];
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

export function parseDiagramSkills(html: string): DiagramSkill[] {
  const $ = cheerio.load(html);
  const skills: DiagramSkill[] = [];

  $(".skill-element, .digram-line-box .skill-element").each((_, el) => {
    const label = $(el).find(".diagram-skill-title").first().text().trim();
    const amountText = $(el).find(".diagram-skill-amount").first().text().trim();
    const percent = Number.parseInt(amountText.replace(/[^\d]/g, ""), 10);
    if (!label || Number.isNaN(percent)) return;
    skills.push({ label, percent });
  });

  return skills;
}

export function stripExtractedPortfolioSections(html: string): string {
  const $ = cheerio.load(html);
  $(
    ".gem-gallery-grid, .gallery-preloader-wrapper, .digram-line-box, .diagram-item, .gem-testimonials, .thegem-testimonials, .preloader, .portfolio-filters, .portfolio-top-panel",
  ).remove();
  $("h1").first().remove();
  const body = $("body").length ? $("body").html() : $.root().html();
  return (body ?? "").trim();
}

export function parsePortfolioBody(html: string): {
  gallery: GalleryItem[];
  skills: DiagramSkill[];
  strippedHtml: string;
} {
  if (!html) {
    return { gallery: [], skills: [], strippedHtml: "" };
  }
  const gallery = parseGalleryItems(html);
  const skills = parseDiagramSkills(html);
  const strippedHtml = stripExtractedPortfolioSections(html);
  return { gallery, skills, strippedHtml };
}
