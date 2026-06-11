import type {
  ClientLogo,
  ContentSection,
  RotatingPhrase,
  ServiceCardColumn,
  Testimonial,
} from "../../../../src/content/types";

import type { ParsedCustomMenu } from "./parse-custom-menus";
import type { ParsedHero } from "./parse-hero";

export interface ParsedHomepage {
  hero: ParsedHero | null;
  customMenus: ParsedCustomMenu[];
  services: ServiceCardColumn[];
  clients: ClientLogo[];
  testimonials: Testimonial[];
  rotatingPhrases: RotatingPhrase[];
  sections: ContentSection[];
  assetUrls: string[];
}
