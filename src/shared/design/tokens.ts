/**
 * Design Tokens — Dame Luthas ("Luthas Enterprise")
 *
 * TS mirror of the CSS custom properties in src/app/globals.css.
 * SSOT + rationale: docs/design/DESIGN-SYSTEM-RECOMMENDATION.md
 * WCAG verified by scripts/design/audit-contrast.mts (all required checks pass).
 *
 * Values are HSL channel strings, matching globals.css `:root`. Wrap with `hsl()`
 * when used as a color, e.g. `hsl(${tokens.colors.primary.DEFAULT})`.
 */

export const tokens = {
  colors: {
    background: "222 47% 6%",
    surface: "222 47% 8%",
    elevated: "222 47% 10%",
    foreground: "0 0% 100%",
    mutedForeground: "222 14% 70%",
    border: { DEFAULT: "222 18% 46%", subtle: "222 30% 18%" },
    primary: {
      DEFAULT: "217 91% 60%",
      foreground: "222 47% 6%",
      hover: "217 91% 55%",
      soft: "217 50% 16%",
    },
    accent: { DEFAULT: "187 100% 42%", foreground: "222 47% 6%" },
    success: "142 71% 45%",
    warning: "38 92% 50%",
    error: "0 91% 71%",
    info: "199 92% 60%",
    ring: "217 91% 60%",
  },
  typography: {
    fontFamily: {
      sans: "var(--font-outfit), system-ui, sans-serif",
      serif: "var(--font-cardo), Georgia, serif",
    },
  },
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    full: "9999px",
  },
  containerMax: "1170px",
} as const;
