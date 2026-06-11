import type { Testimonial } from "@/content/types";

import type { DiagramSkill, GalleryItem } from "./portfolio-widgets";

export type CaseStudySection =
  | { type: "prose"; html: string }
  | { type: "gallery"; items: GalleryItem[] }
  | { type: "skills"; items: DiagramSkill[] }
  | { type: "testimonials"; items: readonly Testimonial[] }
  | { type: "cta"; label: string; href: string };

export interface StructuredCaseStudy {
  slug: string;
  client: string;
  sectors: string[];
  year?: string;
  sections: CaseStudySection[];
}

export interface ResolvedCaseStudy {
  client?: string;
  sectors: string[];
  year?: string;
  gallery: GalleryItem[];
  skills: DiagramSkill[];
  proseHtml: string;
  testimonials: readonly Testimonial[];
  cta?: { label: string; href: string };
}
