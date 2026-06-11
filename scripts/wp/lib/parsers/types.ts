import type {
  ClientLogo,
  ContentSection,
  RotatingPhrase,
  ServiceCardColumn,
  Testimonial,
} from "../../../../src/content/types";

import type { ParsedHero } from "./parse-hero";

export interface ParsedHomepage {
  hero: ParsedHero | null;
  services: ServiceCardColumn[];
  clients: ClientLogo[];
  testimonials: Testimonial[];
  rotatingPhrases: RotatingPhrase[];
  sections: ContentSection[];
  assetUrls: string[];
}
