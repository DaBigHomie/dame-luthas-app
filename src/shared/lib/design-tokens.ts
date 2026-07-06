/**
 * @deprecated TheGem-era token file. Superseded by the "Luthas Enterprise" system.
 * Canonical SSOT is now src/shared/design/tokens.ts (mirroring src/app/globals.css).
 * Values below are corrected to the new palette so this file is not a liability; it has
 * no importers and is safe to delete. See docs/design/DESIGN-SYSTEM-RECOMMENDATION.md.
 */

export const colors = {
  background: "#080c16", // hsl(222 47% 6%)
  surface: "#0b111e", // hsl(222 47% 8%)
  elevated: "#0e1525", // hsl(222 47% 10%)
  text: "#FFFFFF",
  textMuted: "#a8aebd", // hsl(222 14% 70%)
  accent: "#3b82f6", // primary — hsl(217 91% 60%)
  accentHover: "#2f74e6", // hsl(217 91% 55%)
  cyan: "#00bdd6", // accent — hsl(187 100% 42%)
  border: "#606d8a", // hsl(222 18% 46%)
  buttonText: "#080c16", // primary-foreground (dark on primary)
} as const;

export const fonts = {
  sans: '"Outfit", system-ui, sans-serif',
  serif: '"Cardo", Georgia, serif',
  weights: { regular: 400, medium: 500, semibold: 600, bold: 800 },
} as const;

export const radius = { button: "0.75rem", pill: "9999px" } as const;

export const layout = {
  containerMax: "1170px",
  sectionPaddingX: "1.5rem", // was 21px magic number
  sectionPaddingY: "5rem 1.5rem",
} as const;

export const breakpoints = { mobile: 767, tablet: 1024, tabletExtra: 1200 } as const;

export const typography = {
  heroH1: {
    fontSize: "clamp(40px, 6.5vw, 96px)",
    lineHeight: 1.05,
    fontWeight: 800,
    textTransform: "uppercase" as const,
  },
  bigHeading: {
    fontSize: "clamp(36px, 4.6vw, 64px)",
    lineHeight: 1.12,
    fontWeight: 800,
    textTransform: "uppercase" as const,
  },
  category: {
    fontSize: "24px",
    lineHeight: "34px",
    fontWeight: 600,
  },
  heroBody: {
    fontSize: "clamp(18px, 1.6vw, 24px)",
    lineHeight: 1.42,
    fontWeight: 500,
  },
  navLink: {
    fontSize: "clamp(16px, 1.4vw, 24px)",
    lineHeight: "34px",
    fontWeight: 500,
    textTransform: "uppercase" as const,
  },
  button: {
    fontSize: "19px",
    lineHeight: "50px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
  },
  body: {
    fontSize: "17px",
    lineHeight: "25px",
    fontWeight: 400,
  },
} as const;
