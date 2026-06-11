import type { CheerioAPI } from "cheerio";

import { cleanText } from "./normalize-url";

export interface ParsedHero {
  title: string;
  subtitle: string;
  ctaPrimary: { label: string; href: string };
}

export function parseHero($: CheerioAPI): ParsedHero | null {
  const titleEl = $(".thegem-heading.title-xlarge.letters-slide-up").first();
  const subtitleEl = $(".thegem-heading.styled-subtitle").first();
  const ctaEl = titleEl
    .closest(".e-con, .elementor-widget-wrap")
    .find("a.gem-button")
    .first();

  const title = cleanText(titleEl.text());
  const subtitle = cleanText(subtitleEl.text());
  if (!title) return null;

  const href = ctaEl.attr("href")?.replace(/https?:\/\/[^/]+/, "") ?? "/contact";
  const label = cleanText(ctaEl.find(".gem-text-button").text()) || "Contact Me";

  return {
    title,
    subtitle:
      subtitle ||
      "I partner with organizations to solve complex technology challenges and build digital products that drive measurable growth",
    ctaPrimary: { label, href },
  };
}
