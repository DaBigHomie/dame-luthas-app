import type { CheerioAPI } from "cheerio";

import type { ContentSection } from "../../../../src/content/types";
import { cleanText } from "./normalize-url";

function findHeadingText($: CheerioAPI, pattern: RegExp): string | null {
  let match: string | null = null;
  $(".thegem-heading, h2, h3").each((_, el) => {
    const text = cleanText($(el).text());
    if (pattern.test(text)) {
      match = text;
      return false;
    }
    return undefined;
  });
  return match;
}

export function parseSections($: CheerioAPI): ContentSection[] {
  const sections: ContentSection[] = [];

  const partnerIntro = findHeadingText(
    $,
    /partner with organizations to solve complex technology/i,
  );
  if (partnerIntro) {
    sections.push({
      id: "partner-intro",
      kind: "partner-intro",
      title: partnerIntro,
    });
  }

  const advisor = findHeadingText(
    $,
    /trusted United Nations advisor/i,
  );
  if (advisor) {
    sections.push({
      id: "un-advisor",
      kind: "advisor",
      title: advisor,
    });
  }

  const manifesto = findHeadingText(
    $,
    /create impactful digital experiences/i,
  );
  if (manifesto) {
    sections.push({
      id: "brand-manifesto",
      kind: "manifesto",
      title: manifesto,
    });
  }

  const ctaHeading = findHeadingText($, /^START WORKING WITH ME$/i);
  const ctaBody = findHeadingText(
    $,
    /technology-related challenges hindering your growth/i,
  );
  if (ctaHeading) {
    const contactHref =
      $('a[href*="/contact"]').first().attr("href") ?? "/contact";
    sections.push({
      id: "cta-band",
      kind: "cta-band",
      title: ctaHeading,
      bodyText: ctaBody ?? undefined,
      cta: { label: "Let's talk", href: contactHref.replace(/https?:\/\/[^/]+/, "") },
    });
  }

  return sections;
}
