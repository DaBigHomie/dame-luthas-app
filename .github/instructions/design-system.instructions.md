---
applyTo: "src/shared/design/**,src/shared/ui/**,**/*.css,**/*.tsx,**/*.ts"
---

# Design System — "Luthas Enterprise"

> Replaces the former "Royal Nightlife" spec (which was wrong for this project).
> Full rationale + per-page direction: `docs/design/DESIGN-SYSTEM-RECOMMENDATION.md`.

## Theme Identity
- **Subject**: professional portfolio for Dame Luthas — Technology Leader & AI Strategist. Tone: credible, senior, enterprise-grade, AI-forward. NOT nightlife/neon/creative-agency.
- **Brand references** (Dame's other projects, palette source): showcase.damieus.app, damieus.com (verified against `damieus-com-migration/src/index.css`).
- **SSOT**: `src/app/globals.css` `:root` (HSL channels) — mirrored in `src/shared/design/tokens.ts`.
- **Canonical site**: https://dameluthas.damieus.app

## Token Reference (HSL channels; wrap in `hsl()`)

| Token | `--var` / Tailwind | Value | Usage |
|-------|--------------------|-------|-------|
| Background | `--background` / `bg-background` | `222 47% 6%` | Page canvas (deep navy) |
| Surface | `--surface` / `bg-surface` | `222 47% 8%` | Cards |
| Elevated | `--elevated` / `bg-elevated` | `222 47% 10%` | Dropdowns, modals, inputs |
| Foreground | `--foreground` / `text-foreground` | `0 0% 100%` | Primary text |
| Muted | `--muted-foreground` / `text-muted-foreground` | `222 14% 70%` | Secondary text |
| Border | `--border` / `border-border` | `222 18% 46%` | Interactive outlines (≥3:1) |
| Border subtle | `--border-subtle` | `222 30% 18%` | Decorative dividers only |
| **Primary** | `--primary` / `bg-primary` `text-primary` | `217 91% 60%` | CTAs, links, focus, stat numbers |
| Primary fg | `--primary-foreground` / `text-primary-foreground` | `222 47% 6%` | **Dark** text on primary fills |
| Primary hover | `--primary-hover` / `bg-primary-hover` | `217 91% 55%` | Press/hover |
| Accent (cyan) | `--accent` / `text-accent` | `187 100% 42%` | Sparing data/highlight |
| Success / Warning / Error / Info | `--success`/`--warning`/`--error`/`--info` | see globals.css | Status only |

## Rules
- ALWAYS use the semantic Tailwind tokens (`bg-surface`, `text-muted-foreground`, `border-border`, `text-primary`) or `hsl(var(--token))` — NEVER raw hex in components.
- NEVER use white-text-on-`primary` at body sizes (fails AA). Text/icons on a primary fill use `text-primary-foreground` (dark).
- One decisive accent: `primary` (electric blue). Use `accent` (cyan) sparingly (≤1 per view). NEVER reintroduce lavender `#8f93f1`, mint, yellow, or the white footer bar.
- ALWAYS keep the dark canvas; cards = surface + 1px `border-border`, not heavy shadows.
- Focus: a solid `outline: 2px solid hsl(var(--ring))` is provided globally on interactive elements — do not remove it.
- ALWAYS respect `prefers-reduced-motion` (existing motion already does).
- NEVER hardcode hex; NEVER use `px-[21px]` (use `px-6`).

## Typography
| Role | Font | Class / token |
|------|------|---------------|
| Display / H1 | Outfit 800 UPPERCASE | `.dl-typography-hero-h1`, `.dl-typography-big-heading` |
| Headings | Outfit 600–700 | `font-sans` |
| Body | Outfit 400 | `font-sans` |
| Pull-quotes | Cardo (serif) | `font-serif` (only sanctioned Cardo use) |

## Component standards
```tsx
// ✅ semantic tokens
<div className="bg-surface text-foreground border border-border">
<button className="bg-primary text-primary-foreground hover:bg-primary-hover">

// ❌ raw hex / removed brand colors
<div style={{ background: "#8f93f1" }} />            // lavender — removed
<div className="bg-[var(--dl-footer-yellow)]" />     // yellow — removed
```

## Migration status (see rec doc §7)
Done: palette swap (globals.css + thegem/tokens.css), tokens.ts/design-tokens.ts reconciled, ContactFormBlock/Fields + forms.css, Hero white card removed, CtaBand + footer bar darkened.
Deferred (feature work): `cn()` util, `Stat`/`PullQuote` components, content/service stratification, full tokenization of remaining `text-zinc-*`/`border-white/10` utilities, motion-liability removal (rotating circle, 3D filter flip), hero stat-strip.
