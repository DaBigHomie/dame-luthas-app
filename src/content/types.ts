export interface ServiceMenuItem {
  label: string;
  href?: string;
  badge?: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  rotating: string[];
  items: ServiceMenuItem[];
}

export interface ServiceBlock {
  id: string;
  slide: "01/03" | "02/03" | "03/03";
  heading: string;
  image: string;
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
