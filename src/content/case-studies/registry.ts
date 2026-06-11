import { testimonials } from "@/content/testimonials";
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
    sections: [{ type: "testimonials", items: amazonTestimonials }, contactCta],
  },
  "gatorade-embraces-generative-ai-powered-bottle-design": {
    slug: "gatorade-embraces-generative-ai-powered-bottle-design",
    client: "Gatorade",
    sectors: ["Consumer Products", "Generative AI", "E-Commerce"],
    sections: [contactCta],
  },
  "united-nations-cloud-migration-fobos": {
    slug: "united-nations-cloud-migration-fobos",
    client: "United Nations",
    sectors: ["Public Sector", "Cloud Transformation", "Solution Architecture"],
    sections: [{ type: "testimonials", items: unTestimonials }, contactCta],
  },
};

export function getStructuredCaseStudy(
  slug: string,
): StructuredCaseStudy | undefined {
  return structuredCaseStudies[slug];
}
