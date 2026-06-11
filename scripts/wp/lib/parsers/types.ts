import type {
  ClientLogo,
  ContentSection,
  RotatingPhrase,
  ServiceCardColumn,
  Testimonial,
} from "../../../../src/content/types";

export interface ParsedHomepage {
  services: ServiceCardColumn[];
  clients: ClientLogo[];
  testimonials: Testimonial[];
  rotatingPhrases: RotatingPhrase[];
  sections: ContentSection[];
  assetUrls: string[];
}
