import type { CheerioAPI } from "cheerio";

import type { Testimonial } from "../../../../src/content/types";
import { cleanText } from "./normalize-url";

export function parseTestimonials($: CheerioAPI): Testimonial[] {
  const items: Testimonial[] = [];
  const seen = new Set<string>();

  $(".gem-testimonial-item").each((_, el) => {
    const quote = cleanText(
      $(el)
        .find(".post-content.styled-subtitle, .thegem-te-loop-post-content .post-content")
        .first()
        .text(),
    );
    const author = cleanText(
      $(el).find(".thegem-te-post-title span, .post-title span").first().text(),
    );
    const role = cleanText($(el).find(".item-value .meta, .custom-fields-item .meta").first().text());

    if (!quote || !author) return;
    const key = `${author}|${quote.slice(0, 40)}`;
    if (seen.has(key)) return;
    seen.add(key);

    items.push({
      quote,
      author,
      role: role || undefined,
    });
  });

  return items;
}
