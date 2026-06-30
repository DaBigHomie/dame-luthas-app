import { testimonials } from "@/content/testimonials";
import {
  amazonLaborGallery,
  amazonLaborProseHtml,
} from "@/content/case-studies/prose/amazon-labor";
import {
  gatoradeProseHtml,
} from "@/content/case-studies/prose/gatorade";
import {
  unitedNationsGallery,
  unitedNationsProseHtml,
  unitedNationsSkills,
} from "@/content/case-studies/prose/united-nations";
import type { StructuredCaseStudy } from "@/shared/types/case-study";

const amazonTestimonials = testimonials.filter((item) =>
  ["Maria Sanchez", "Jamal Washington"].includes(item.author),
);

const unTestimonials = testimonials.filter((item) =>
  ["Kenji Tanaka", "Dr. Alistair Finch"].includes(item.author),
);

const contactCta = {
  type: "cta" as const,
  label: "Discuss a similar project",
  href: "/contact",
};

/** Native case-study sections — replaces bodyHtml parsing over time. */
export const structuredCaseStudies: Record<string, StructuredCaseStudy> = {
  "amazon-labor-union-digital-transformation": {
    slug: "amazon-labor-union-digital-transformation",
    client: "Amazon Labor Union",
    sectors: ["Labor Organizing", "Digital Transformation"],
    nativeContent: true,
    sections: [
      { type: "prose", html: amazonLaborProseHtml },
      { type: "gallery", items: [...amazonLaborGallery] },
      { type: "testimonials", items: amazonTestimonials },
      contactCta,
    ],
  },
  "gatorade-embraces-generative-ai-powered-bottle-design": {
    slug: "gatorade-embraces-generative-ai-powered-bottle-design",
    client: "Gatorade",
    sectors: ["Consumer Products", "Generative AI", "E-Commerce"],
    nativeContent: true,
    sections: [
      { type: "prose", html: gatoradeProseHtml },
      contactCta,
    ],
  },
  "united-nations-cloud-migration-fobos": {
    slug: "united-nations-cloud-migration-fobos",
    client: "United Nations",
    sectors: ["Public Sector", "Cloud Transformation", "Solution Architecture"],
    nativeContent: true,
    sections: [
      { type: "prose", html: unitedNationsProseHtml },
      { type: "gallery", items: [...unitedNationsGallery] },
      { type: "skills", items: [...unitedNationsSkills] },
      { type: "testimonials", items: unTestimonials },
      contactCta,
    ],
  },
};

export function getStructuredCaseStudy(
  slug: string,
): StructuredCaseStudy | undefined {
  return structuredCaseStudies[slug];
}
