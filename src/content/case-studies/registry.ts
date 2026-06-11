import { testimonials } from "@/content/testimonials";
import type { StructuredCaseStudy } from "@/shared/types/case-study";

const amazonTestimonials = testimonials.filter((item) =>
  ["Maria Sanchez", "Jamal Washington"].includes(item.author),
);

/** Native case-study sections — replaces bodyHtml parsing over time. */
export const structuredCaseStudies: Record<string, StructuredCaseStudy> = {
  "amazon-labor-union-digital-transformation": {
    slug: "amazon-labor-union-digital-transformation",
    client: "Amazon Labor Union",
    sectors: ["Labor Organizing", "Digital Transformation"],
    sections: [{ type: "testimonials", items: amazonTestimonials }],
  },
};

export function getStructuredCaseStudy(
  slug: string,
): StructuredCaseStudy | undefined {
  return structuredCaseStudies[slug];
}
