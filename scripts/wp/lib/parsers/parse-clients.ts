import type { CheerioAPI } from "cheerio";

import type { ClientLogo } from "../../../../src/content/types";
import { cleanText, normalizeUploadUrl } from "./normalize-url";

export function parseClients($: CheerioAPI): ClientLogo[] {
  const seen = new Set<string>();
  const logos: ClientLogo[] = [];

  $(".gem-client img, .elementor-widget-thegem-clients img").each((_, img) => {
    const src = normalizeUploadUrl($(img).attr("src"));
    if (!src || src.includes("quote-dark")) return;
    if (seen.has(src)) return;
    seen.add(src);

    const name =
      cleanText($(img).attr("alt") ?? "") ||
      `Client ${logos.length + 1}`;
    const link = $(img).closest("a").attr("href");

    logos.push({
      name,
      src,
      href: link && link !== "#" ? link : undefined,
    });
  });

  return logos;
}
