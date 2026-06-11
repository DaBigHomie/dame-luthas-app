/**
 * FSD-aligned public asset domains (served from public/assets/{domain}/).
 * app → widgets → features → entities → shared — static files live under public/, typed here.
 */
export const ASSET_DOMAINS = [
  "clients",
  "services",
  "portfolio",
  "site",
  "pages",
] as const;

export type AssetDomain = (typeof ASSET_DOMAINS)[number];

/** Maps content module → domain + primary React consumer (for binding validation). */
export const MODULE_ASSET_BINDINGS: Array<{
  module: string;
  component: string;
  domain: AssetDomain;
}> = [
  { module: "clients.ts", component: "ClientsMarquee", domain: "clients" },
  { module: "services.ts", component: "ServiceCard", domain: "services" },
  { module: "service-blocks.ts", component: "ServiceBlockSection", domain: "services" },
  { module: "hero-fallback.ts", component: "Hero", domain: "site" },
  { module: "testimonials.ts", component: "TestimonialsCarousel", domain: "site" },
  { module: "ContactFormBlock.tsx", component: "ContactFormBlock", domain: "site" },
  { module: "portfolio-media.ts", component: "PortfolioGrid", domain: "portfolio" },
];

export const PUBLIC_ASSETS_ROOT = "public/assets";

export function assetPublicUrl(domain: AssetDomain, filename: string): string {
  return `/assets/${domain}/${filename}`;
}
