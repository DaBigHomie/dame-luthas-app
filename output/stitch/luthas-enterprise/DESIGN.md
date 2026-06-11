# Stitch Design SSOT — "Luthas Enterprise"

Design source of truth for generating Google Stitch mockups of the **Dame Luthas portfolio**
(https://dameluthas.damieus.app). Derived from `docs/design/DESIGN-SYSTEM-RECOMMENDATION.md`
and the shipped tokens in `src/app/globals.css`. WCAG verified by `scripts/design/audit-contrast.mts`.

> Brand references (Dame's other projects, palette source): showcase.damieus.app, damieus.com.
> This is a **desktop-first responsive web** portfolio — NOT a mobile app, NOT nightlife.

---

## SHARED BLOCKS (inline these into every page prompt)

### BLOCK 1 — BRAND PREAMBLE
BRAND: Dame Luthas — professional portfolio of a **Technology Leader & AI Strategist**. Expertise to convey: global cloud migrations, enterprise architecture, AI-driven automation, program management; senior work in **United Nations** and **Microsoft** environments.
AUDIENCE: hiring executives, recruiters, enterprise stakeholders.
PLATFORM: Desktop-first responsive web. Primary viewport **1440×1024**; degrade to 768 and 390.
VIBE: Senior, enterprise-grade, modern, AI-forward — **quiet authority** (Linear / Vercel / Stripe register). Proof is the hero; design is the frame.
COLORS (Luthas Enterprise):
- background `#080c16` (deep navy) · surface `#0b111e` (cards) · elevated `#0e1525` (inputs/menus)
- **primary `#3b82f6`** electric blue — CTAs, links, focus rings, section rules, **stat numbers**. Text/icons ON a primary fill are **dark navy `#080c16`** (never white).
- accent **cyan `#00bdd6`** — sparing: ONE data/status highlight per view.
- foreground `#ffffff` · muted `#a8aebd` · border `#606d8a` (hairline)
FONTS: Display + headings **Outfit** — 800 UPPERCASE for hero/section anchors, 600–700 sentence-case for page/card titles. Body **Outfit** 400. Pull-quotes **Cardo** serif (the only Cardo use).
LAYOUT: 1170px max content width, centered, generous whitespace. Cards = surface + 1px `#606d8a` border (NOT heavy shadows). Soft-rectangle buttons (radius ~0.75rem), not full pills. Focus = 2px solid blue outline.

### BLOCK 5 — STYLE
High-fidelity desktop web UI at Figma presentation quality. Deep-navy enterprise canvas; electric-blue primary used with restraint; a single cyan data accent. Large uppercase Outfit display headlines with strong weight/case contrast; clean 12-col grid; hairline borders; subtle blue glow on focus/active only. Evidence surfaced as **large primary stat callouts**. Photography-forward where relevant (professional headshot, monochrome client logos). Editorial executive warmth.

### BLOCK 6 — NEGATIVE
NO lavender/periwinkle `#8f93f1`, NO mint, NO yellow `#f7df3d`, NO white/ivory full-bleed backgrounds, NO glassmorphism, NO neon/club-flyer glow, NO nightlife aesthetic. NO emoji as icons (use a clean single-weight line-icon set). NO clip art, NO stock blobs, NO angled device mockups. NO full-pill primary CTAs. NO SMB/freelancer framing ("build your dream", "web hosting", "restaurant menu", "resumes").

### BLOCK 7 — BACKGROUND (desktop frame)
Desktop browser viewport ONLY — flat, upright, centered, 1440px content on the deep-navy `#080c16` canvas. Outside the layout: same navy or transparent. NO device frame, NO 15° angle, NO desk scene, NO ambient glow outside the layout.

---

## Page → prompt map
| URL | Prompt |
|-----|--------|
| `/` | `PROMPTS.md` → P1 Home |
| `/case-studies` | P2 Case Studies index |
| `/about` | P3 About |
| `/portfolio/amazon-labor-union-digital-transformation` | P4 Portfolio detail (ALU) |
| `/portfolio/gatorade-embraces-generative-ai-powered-bottle-design` | P5 Portfolio detail (Gatorade) |
