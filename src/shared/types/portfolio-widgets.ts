export interface GalleryItem {
  thumbSrc: string;
  fullSrc: string;
  alt: string;
}

export interface DiagramSkill {
  label: string;
  percent: number;
}

export interface PortfolioNavLink {
  slug: string;
  title: string;
  href: string;
}

export interface IconListItem {
  icon?: "pin" | "phone" | "mail" | "headphones";
  label?: string;
  text: string;
  href?: string;
}
