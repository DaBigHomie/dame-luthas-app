import type { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";

import type { ServiceCardColumn } from "../../../../src/content/types";
import { cleanText, normalizeUploadUrl, slugify } from "./normalize-url";

function parseMenuItems($: CheerioAPI, ul: Element) {
  return $(ul)
    .find("li a")
    .map((_, anchor) => {
      const label =
        cleanText($(anchor).find(".text").text()) ||
        cleanText($(anchor).text());
      const description = cleanText($(anchor).find(".label").text()) || undefined;
      return {
        label,
        href: $(anchor).attr("href") ?? "#",
        description,
      };
    })
    .get()
    .filter((item) => item.label.length > 0);
}

/** First services slide: AI, WordPress, Microsoft Cloud (3 columns). */
export function parseServiceCards($: CheerioAPI): ServiceCardColumn[] {
  const slideRoot = $('img[src*="home-03"]').first().closest(".e-con.e-parent");
  const menus = slideRoot.find("ul.nav-menu-custom");
  const columns: ServiceCardColumn[] = [];

  menus.each((index, ul) => {
    const items = parseMenuItems($, ul);
    if (items.length === 0) return;

    const container = $(ul).closest(".e-con");
    const image =
      normalizeUploadUrl(
        slideRoot.find('img[src*="home-0"]').eq(index).attr("src") ??
          container.find('img[src*="home-0"]').first().attr("src"),
      ) ?? "/wp-content/uploads/2025/02/home-03.webp";

    const title = items[0]?.label ?? `Service ${index + 1}`;
    columns.push({
      id: slugify(title),
      title,
      image,
      items,
    });
  });

  return columns;
}

/** All unique service menus (carousel / extended parity). */
export function parseAllServiceCards($: CheerioAPI): ServiceCardColumn[] {
  const seen = new Set<string>();
  const columns: ServiceCardColumn[] = [];

  $("ul.nav-menu-custom").each((_, ul) => {
    const items = parseMenuItems($, ul);
    const key = items.map((item) => item.label).join("|");
    if (!key || seen.has(key)) return;
    seen.add(key);

    const parent = $(ul).closest(".e-con.e-parent");
    const image =
      normalizeUploadUrl(parent.find('img[src*="home-0"]').first().attr("src")) ??
      "/wp-content/uploads/2025/02/home-04.webp";
    const title = items[0]?.label ?? `service-${columns.length}`;

    columns.push({
      id: slugify(title),
      title,
      image,
      items,
    });
  });

  return columns;
}
