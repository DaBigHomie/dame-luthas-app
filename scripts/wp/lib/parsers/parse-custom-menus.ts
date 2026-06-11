import type { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";

import type { ServiceMenuItem } from "../../../../src/content/types";
import { cleanText, normalizeUploadUrl, slugify } from "./normalize-url";

export interface ParsedCustomMenu {
  widgetId: string;
  title: string;
  eyebrow?: string;
  rotating: string[];
  items: ServiceMenuItem[];
  image?: string;
  imagePosition?: "left" | "right";
}

function parseMenuItems($: CheerioAPI, ul: Element): ServiceMenuItem[] {
  return $(ul)
    .find("li")
    .map((_, li) => {
      const anchor = $(li).find("a").first();
      const label =
        cleanText(anchor.find(".text").text()) ||
        cleanText($(li).find(".text").text()) ||
        cleanText(anchor.text());
      const badge = cleanText(anchor.find(".label").text()) || undefined;
      if (!label) return null;
      return {
        label,
        href: anchor.attr("href") ?? "#",
        badge,
      };
    })
    .get()
    .filter((item) => item !== null && item.label.length > 0) as ServiceMenuItem[];
}

function parseHeadingsBeforeMenu($: CheerioAPI, menuEl: Element) {
  const container = $(menuEl).closest(".e-con").first();
  const eyebrowParts: string[] = [];
  let title = "";
  const rotating: string[] = [];

  container.find(".thegem-animated-heading").each((_, heading) => {
    if (!isBeforeInDom($, heading, menuEl)) return;

    const $h = $(heading);
    const rotatingTexts = $h
      .find(".thegem-heading-rotating-text")
      .map((__, span) => cleanText($(span).text()))
      .get()
      .filter(Boolean);
    if (rotatingTexts.length) {
      rotating.push(...rotatingTexts);
      return;
    }

    const text = cleanText($h.find(".thegem-heading").text() || $h.text());
    if (!text || /^\d+\s*\/\s*\d+$/.test(text.replace(/\s/g, ""))) return;
    if (/^services$/i.test(text)) return;

    const isH4 = $h.find(".title-h4").length > 0 || $h.hasClass("title-h4");
    if (isH4 || text.length < 40) {
      eyebrowParts.push(text);
    } else if (!title) {
      title = text;
    }
  });

  const eyebrow = eyebrowParts.at(-1);
  if (!title && eyebrow) {
    title = eyebrow;
  }

  return { title, eyebrow: eyebrowParts.length > 1 ? eyebrow : eyebrow, rotating };
}

function isBeforeInDom($: CheerioAPI, a: Element, b: Element): boolean {
  const all = $("*").toArray();
  return all.indexOf(a) < all.indexOf(b);
}

function findStyledImageForMenu(
  $: CheerioAPI,
  menuEl: Element,
): { image?: string; imagePosition?: "left" | "right" } {
  const row = $(menuEl).closest(".e-con.e-parent, .e-con.e-child").first();
  const styled = row
    .find('[data-widget_type="thegem-styledimage.default"]')
    .filter((_, imgWidget) => {
      const imgRow = $(imgWidget).closest(".e-con").get(0);
      const menuRow = row.get(0);
      return imgRow === menuRow || $(imgWidget).closest(".e-con.e-child").get(0) === menuRow?.parent;
    })
    .first();

  if (!styled.length) {
    const prevImg = row
      .prevAll('[data-widget_type="thegem-styledimage.default"]')
      .first();
    if (prevImg.length) {
      return extractStyledImage($, prevImg.get(0)!);
    }
    const parent = row.parent().closest(".e-con");
    const siblingImg = parent
      .find('[data-widget_type="thegem-styledimage.default"]')
      .first();
    if (siblingImg.length) {
      return extractStyledImage($, siblingImg.get(0)!);
    }
    return {};
  }

  return extractStyledImage($, styled.get(0)!);
}

function extractStyledImage($: CheerioAPI, widget: Element) {
  const settings = $(widget).attr("data-settings") ?? "";
  const position = settings.includes('"right"') ? "right" : "left";
  const src =
    normalizeUploadUrl($(widget).find("img").first().attr("src")) ??
    normalizeUploadUrl(
      (settings.match(/"url":"([^"]+)"/)?.[1] ?? "").replace(/\\\//g, "/"),
    );
  return {
    image: src ?? undefined,
    imagePosition: position as "left" | "right",
  };
}

/** Walk all `thegem-custom-menu` widgets in DOM order with heading context. */
export function parseCustomMenus($: CheerioAPI): ParsedCustomMenu[] {
  const menus: ParsedCustomMenu[] = [];

  findCustomMenuWidgets($).forEach((widget) => {
    const $w = $(widget);
    const ul = $w.find("ul.nav-menu-custom").get(0);
    if (!ul) return;

    const items = parseMenuItems($, ul);
    if (!items.length) return;

    const { title, eyebrow, rotating } = parseHeadingsBeforeMenu($, widget);
    const { image, imagePosition } = findStyledImageForMenu($, widget);
    const resolvedTitle = title || items[0]?.label || "Services";

    menus.push({
      widgetId: $w.attr("data-id") ?? slugify(resolvedTitle),
      title: resolvedTitle,
      eyebrow,
      rotating,
      items,
      image,
      imagePosition,
    });
  });

  return menus;
}

function findCustomMenuWidgets($: CheerioAPI): Element[] {
  return $('[data-widget_type="thegem-custom-menu.default"]').toArray();
}

export function countCustomMenuWidgets($: CheerioAPI): number {
  return findCustomMenuWidgets($).length;
}
