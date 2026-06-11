export interface ServiceMenuItem {
  label: string;
  href: string;
  description?: string;
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
