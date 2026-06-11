export interface SocialLink {
  network: string;
  href: string;
  label?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceMenuItem {
  label: string;
  href?: string;
  badge?: string;
  description?: string;
}

export type StyledImagePosition = "left" | "right";

export interface ServiceCategory {
  id: string;
  title: string;
  /** Per-category styled image (thegem-styledimage widget). */
  image: string;
  imagePosition: StyledImagePosition;
  /** Optional h4 eyebrow above the animated category title. */
  eyebrow?: string;
  rotating: string[];
  items: ServiceMenuItem[];
}

export interface ServiceBlock {
  id: string;
  slide: "01/03" | "02/03" | "03/03";
  heading: string;
  categories: ServiceCategory[];
  ctaText: string;
}

export interface TextBands {
  unAdvisorBand: string;
  manifesto: { eyebrow: string; body: string };
  bigHeading: string;
  servicesCtas: {
    sections01and02: string;
    section03: string;
  };
}

export interface ServiceCardColumn {
  id: string;
  title: string;
  image: string;
  items: ServiceMenuItem[];
}

export interface ClientLogo {
  name: string;
  src: string;
  href?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  image?: string;
}

export interface RotatingPhrase {
  text: string;
}

export interface ContentSection {
  id: string;
  kind: "advisor" | "manifesto" | "partner-intro" | "cta-band";
  eyebrow?: string;
  title?: string;
  bodyText?: string;
  image?: string;
  cta?: { label: string; href: string };
}

export interface HomepageContentMeta {
  generatedAt: string;
  sourcePageId: number;
}
