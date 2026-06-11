import * as cheerio from "cheerio";

import { parseCustomMenus } from "./parse-custom-menus";
import { parseHero } from "./parse-hero";
import { parseAllServiceCards, parseServiceCards } from "./parse-service-cards";
import { parseClients } from "./parse-clients";
import { parseTestimonials } from "./parse-testimonials";
import { parseRotatingPhrases } from "./parse-rotating-text";
import { parseSections } from "./parse-sections";
import type { ParsedHomepage } from "./types";

export function parseHomepageHtml(html: string, options?: { allServices?: boolean }): ParsedHomepage {
  const $ = cheerio.load(html);
  const services = options?.allServices ? parseAllServiceCards($) : parseServiceCards($);
  const customMenus = parseCustomMenus($);
  const clients = parseClients($);
  const testimonials = parseTestimonials($);
  const rotatingPhrases = parseRotatingPhrases($);
  const sections = parseSections($);
  const hero = parseHero($);

  const assetUrls = new Set<string>();
  for (const column of services) {
    assetUrls.add(column.image);
  }
  for (const logo of clients) {
    assetUrls.add(logo.src);
  }
  $("img[src*='wp-content/uploads']").each((_, img) => {
    const src = $(img).attr("src");
    if (src?.includes("quote-dark") || src?.includes("circle-dark")) {
      const match = src.match(/\/wp-content\/uploads\/(.+)$/i);
      if (match) assetUrls.add(`/wp-content/uploads/${match[1]}`);
    }
  });

  return {
    hero,
    customMenus,
    services,
    clients,
    testimonials,
    rotatingPhrases,
    sections,
    assetUrls: [...assetUrls].filter(Boolean),
  };
}
