import "server-only";

import { getStructuredCaseStudy } from "@/content/case-studies/registry";
import type { MigratedPortfolioItem } from "@/shared/lib/migrated/content";
import type { ResolvedCaseStudy } from "@/shared/types/case-study";

import { parsePortfolioBody } from "./parse-portfolio-body";

export function resolveCaseStudy(item: MigratedPortfolioItem): ResolvedCaseStudy {
  const parsed = parsePortfolioBody(item.bodyHtml);
  const structured = getStructuredCaseStudy(item.slug);

  if (!structured) {
    return {
      sectors: [],
      gallery: parsed.gallery,
      skills: parsed.skills,
      proseHtml: parsed.strippedHtml,
      testimonials: [],
    };
  }

  let proseHtml = parsed.strippedHtml;
  let gallery = parsed.gallery;
  let skills = parsed.skills;
  let testimonials: ResolvedCaseStudy["testimonials"] = [];
  let cta: ResolvedCaseStudy["cta"];

  for (const section of structured.sections) {
    switch (section.type) {
      case "prose":
        proseHtml = section.html;
        break;
      case "gallery":
        gallery = section.items;
        break;
      case "skills":
        skills = section.items;
        break;
      case "testimonials":
        testimonials = section.items;
        break;
      case "cta":
        cta = { label: section.label, href: section.href };
        break;
      default:
        break;
    }
  }

  return {
    client: structured.client,
    sectors: structured.sectors,
    year: structured.year,
    gallery,
    skills,
    proseHtml,
    testimonials,
    cta,
  };
}
