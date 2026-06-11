/** Shared visual parity checklist — used by CLI audit and optional e2e imports. */

export const PARITY_URLS = {
  next: process.env.NEXT_PARITY_URL ?? "http://localhost:3000/",
  wp: process.env.WP_PARITY_URL ?? "http://dameluthas.local/",
} as const;

export interface SectionMarker {
  id: string;
  label: string;
  /** Substrings matched against body textContent (animation-safe). */
  needles: readonly string[];
  /** Optional DOM anchors for order + presence when text varies (migrated vs fallback). */
  selectors?: readonly string[];
}

/** Homepage sections in required DOM order. */
export const SECTION_MARKERS: readonly SectionMarker[] = [
  {
    id: "hero",
    label: "Hero",
    needles: ["build together", "dame luthas", "hi, i'm"],
    selectors: ["main h1", "h1.thegem-heading"],
  },
  {
    id: "un-advisor",
    label: "UN Advisor band",
    needles: ["trusted united nations advisor"],
  },
  {
    id: "manifesto",
    label: "Intro / Manifesto",
    needles: ["break the mold"],
  },
  {
    id: "big-heading",
    label: "Big rotating heading",
    needles: [
      "impactful digital experiences",
      "redefine brand identities",
    ],
    selectors: [".dl-typography-big-heading", "h2.thegem-heading"],
  },
  {
    id: "services-01",
    label: "Services 01/03",
    needles: ["don't get left behind", "01/03"],
  },
  {
    id: "services-02",
    label: "Services 02/03",
    needles: ["non profits & design", "02/03"],
  },
  {
    id: "services-03",
    label: "Services 03/03",
    needles: ["back to work & build your dream", "03/03"],
  },
  {
    id: "portfolio",
    label: "Selected Work",
    needles: ["selected work"],
  },
  {
    id: "clients",
    label: "Clients marquee",
    needles: ["feedback / our valued clients", "valued clients"],
  },
  {
    id: "testimonials",
    label: "Testimonials",
    needles: ["maria sanchez"],
  },
  {
    id: "contact",
    label: "Contact form",
    needles: ["i'd love to hear from you", "thanks for your time"],
  },
];

export const HERO_BREAKPOINTS = [
  { width: 1800, label: "desktop", expectedPx: 100, tolerancePx: 10 },
  { width: 1024, label: "tablet", expectedPx: 50, tolerancePx: 8 },
  { width: 767, label: "mobile", expectedPx: 40, tolerancePx: 8 },
] as const;

export const EXPECTED_BODY_BG = "rgb(15, 15, 15)";
export const EXPECTED_HERO_WEIGHT = "800";
export const EXPECTED_HERO_TRANSFORM = "uppercase";

export type CheckStatus = "pass" | "fail" | "skip" | "warn";

export interface CheckResult {
  id: string;
  label: string;
  status: CheckStatus;
  expected?: string;
  actual?: string;
  detail?: string;
}

export interface SiteAudit {
  url: string;
  reachable: boolean;
  error?: string;
  checks: CheckResult[];
  heroByBreakpoint: Array<{
    width: number;
    fontSizePx: number | null;
    fontWeight: string | null;
    textTransform: string | null;
  }>;
  sectionOrder: Array<{
    id: string;
    label: string;
    found: boolean;
    index: number;
  }>;
}

export interface ParityReport {
  generatedAt: string;
  next: SiteAudit;
  wp: SiteAudit;
  comparisons: CheckResult[];
  summary: { pass: number; fail: number; warn: number; skip: number };
}

export function parsePx(value: string | null | undefined): number | null {
  if (!value) return null;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

export function summarize(checks: CheckResult[]): {
  pass: number;
  fail: number;
  warn: number;
  skip: number;
} {
  return checks.reduce(
    (acc, c) => {
      acc[c.status] += 1;
      return acc;
    },
    { pass: 0, fail: 0, warn: 0, skip: 0 },
  );
}
