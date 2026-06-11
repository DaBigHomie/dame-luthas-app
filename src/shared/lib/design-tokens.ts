/**
 * Measured WP/TheGem design tokens — SSOT for migrated theme.
 * See docs/architecture/HOMEPAGE-GRAPHQL-CODEGEN-TSA.md
 */

export const colors = {
  background: "#0F0F0F",
  surface: "#181818",
  text: "#FFFFFF",
  textMuted: "rgba(255, 255, 255, 0.7)",
  accent: "#8F93F1",
  accentHover: "#3C3950",
  yellow: "#F7DF3D",
  lavender: "#CECEE8",
  buttonDark: "#2B2B2B",
  buttonDarkText: "#FFFFFF",
} as const;

export const fonts = {
  sans: '"Outfit", system-ui, sans-serif',
  serif: '"Cardo", Georgia, serif',
  weights: { regular: 400, medium: 500, semibold: 600, bold: 800 },
} as const;

export const radius = { button: "25px", pill: "50px" } as const;

export const layout = {
  containerMax: "1170px",
  sectionPaddingX: "21px",
  sectionPaddingY: "80px 21px 70px",
} as const;

export const breakpoints = { mobile: 767, tablet: 1024, tabletExtra: 1200 } as const;

export const typography = {
  heroH1: {
    fontSize: "clamp(40px, 6.5vw, 100px)",
    lineHeight: 1.1,
    fontWeight: 800,
    textTransform: "uppercase" as const,
  },
  bigHeading: {
    fontSize: "clamp(36px, 4.6vw, 70px)",
    lineHeight: 1.14,
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
