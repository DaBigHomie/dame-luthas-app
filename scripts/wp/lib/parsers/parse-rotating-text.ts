import type { CheerioAPI } from "cheerio";

import type { RotatingPhrase } from "../../../../src/content/types";
import { cleanText } from "./normalize-url";

export function parseRotatingPhrases($: CheerioAPI): RotatingPhrase[] {
  const phrases: RotatingPhrase[] = [];
  const seen = new Set<string>();

  $(".thegem-heading-rotating, .rotating-text").each((_, el) => {
    $(el)
      .find(".thegem-heading-word, span")
      .each((__, word) => {
        const text = cleanText($(word).text());
        if (!text || seen.has(text)) return;
        seen.add(text);
        phrases.push({ text });
      });
  });

  return phrases;
}
