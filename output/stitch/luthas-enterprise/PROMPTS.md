---
tags: [dame-luthas, stitch, prompts, luthas-enterprise, portfolio, desktop]
topic: "Dame Luthas portfolio — Stitch prompts (Luthas Enterprise, desktop web)"
created: "2026-06-11"
updated: "2026-06-13"
sequence: V2
category: "prompts"
repo: dame-luthas-app
inherits_from: ["stitch-mockup-toolkit/docs/01-STRATEGY.md (13-Block Composition)", "atl-table-booking-app/docs/prompts/stitch_mockups_prompts/CARO-CRM-STITCH-PROMPTS-V4.md (format)"]
sourced_from: ["career-corpus/enriched/{RESUME-READY.md,bundles/*}", "project-polaris/data/{profile.json,contact-profile.json,skills_matrix.json,resume-index.json}"]
---

# Dame Luthas — Portfolio Stitch Prompts (Luthas Enterprise)
## Version: 2.0 | Total Prompts: 5 | Agent: 06 (Tier 1 — Brand & Entry Designer)
## Brand: Dame Luthas — Cloud Architect & AI Transformation Leader (15 yrs) | Repo: dame-luthas-app
## Demographic: hiring executives, technical recruiters, enterprise engineering leaders, Microsoft-stack / Fortune-500 transformation leads.
## Prompt Architecture: 13-Block Composition per `STITCH-PROMPTING-STRATEGY.md`

> **V2 corpus correction:** Content is now sourced from `career-corpus/` + `project-polaris/` (Dame's real work), not the WordPress demo. **Removed as demo/placeholder:** the "United Nations advisor" claim + UN/WHO/UNICEF/UN Women/MSG/GLG logo marquee, the "Amazon Labor Union" page, the "Gatorade" page, and invented metrics (70% outages / 50% go-live / 300% petitions). **Verified real:** title "Cloud Architect & AI Transformation Leader" + "Senior Microsoft 365 Consultant Architect"; flagship work = MALFIG/CORTEX multi-agent platform (11 repos), MAXIMUS AI (580 agents), Project Polaris career engine, ONE4THREE 30× image pipeline (20–30×), ATL Table Booking/Caro; scale = 15 programs · 89 projects · 80+ repos.

**Phase 0 workflow:** Run each paste-ready prompt **in Stitch** → export PNG → commit to `output/stitch/luthas-enterprise/images/`. The Stitch image is the spec for React implementation.

| Step | Tool | What |
|---|---|---|
| 1 | **Stitch** | Paste LUTHAS-01-A…05-A blocks into Stitch; generate each screen |
| 2 | **Antigravity** | Operates Stitch, visual QA, re-run until chrome locks |
| 3 | **Claude Code / Cursor** | Implements/refines the React component referencing the Stitch PNG as spec |

**Stitch may also emit `code.html` — ignore it.** The image is the spec. Each prompt's **COMPONENT TARGET** tells the implementer what to build **after** the Stitch PNG exists.

---

## Prompts in this file

| Slice | Layer | Stitch ID | Title | Priority | Component target |
|---|---|---|---|---|---|
| LUTHAS-001 | A Brand/Entry | LUTHAS-01-A | Home — hero + proof + expertise | P0 | `src/app/page.tsx` → `src/widgets/Hero.tsx` (+ `widgets/home/*`) |
| LUTHAS-002 | B Discovery | LUTHAS-02-A | Case Studies index — filterable grid | P1 | `src/app/case-studies/page.tsx` → `src/widgets/CaseStudiesPage.tsx` |
| LUTHAS-003 | A Brand/Entry | LUTHAS-03-A | About — bio + credentials + quote | P1 | `src/app/[slug]/page.tsx` → `src/widgets/AboutPage.tsx` |
| LUTHAS-004 | C Detail | LUTHAS-04-A | Portfolio detail — MALFIG/CORTEX Multi-Agent Platform | P1 | `src/app/portfolio/[slug]/page.tsx` → `src/widgets/portfolio/PortfolioDetail.tsx` |
| LUTHAS-005 | C Detail | LUTHAS-05-A | Portfolio detail — ONE4THREE 30× Image Pipeline | P1 | `src/app/portfolio/[slug]/page.tsx` → `src/widgets/portfolio/PortfolioDetail.tsx` |

URL map: `/` → 01-A · `/case-studies` → 02-A · `/about` → 03-A · `/portfolio/malfig-cortex-multi-agent-platform` → 04-A · `/portfolio/one4three-30x-image-pipeline` → 05-A. (Detail slugs change from the demo `amazon-labor-union` / `gatorade` pages — update `content.json` / portfolio data accordingly.)

---

## Luthas-Specific Design Rules

1. **Brand tokens only** — every color references a key from `src/shared/design/tokens.ts` (mirrored as CSS vars in `src/app/globals.css`). **Never** hardcode hex. Names: `tokens.colors.primary` (`--primary`, electric blue), `tokens.colors.primary.foreground` (`--primary-foreground`, dark on primary), `tokens.colors.accent` (`--accent`, cyan), `tokens.colors.background` (`--background`), `tokens.colors.surface` (`--surface`), `tokens.colors.elevated` (`--elevated`), `tokens.colors.foreground` (`--foreground`), `tokens.colors.mutedForeground` (`--muted-foreground`), `tokens.colors.border` (`--border`), plus `--success`/`--warning`/`--error`/`--info`.
2. **Shell chrome inheritance** — every prompt cites *"SHELL CHROME INHERITED from LUTHAS-01-A"*. Stitch must NOT redesign the sticky top header (wordmark + nav + CTA) or the navy footer. Marketing portfolio — a **top header**, NOT a CRM sidebar.
3. **Full nav registry** — every prompt lists the complete `LUTHAS_NAV` and highlights the active item (`--primary` underline + `--foreground` text).
4. **Real Dame Luthas data (corpus-sourced)** — title **"Cloud Architect & AI Transformation Leader"** / "Senior Microsoft 365 Consultant Architect", 15 years, Atlanta GA + Brooklyn NY; contact LinkedIn `linkedin.com/in/dameluthas`, GitHub `github.com/DaBigHomie`, portfolio `damieus.com`. Flagship projects: **MALFIG/CORTEX** multi-agent platform (11 repos), **MAXIMUS AI** (580 agents), **Project Polaris** career-intelligence engine, **ONE4THREE 30× image pipeline** (20–30× faster), **ATL Table Booking/Caro** (hospitality web+mobile), ATL Tequila Week, Revel Nightclub. Scale metrics: 15 programs · 89 projects · 80+ repos · 28 frameworks. **NEVER** use the removed demo content (UN/WHO/UNICEF advisor claim + logos, Amazon Labor Union, Gatorade, fabricated %s).
5. **Fonts** — Outfit 800 UPPERCASE for hero/section display; Outfit 600/700 titles; Outfit 400 body; **Cardo** serif for pull-quotes ONLY.
6. **Desktop-first 1440×900** — header always visible; never a hamburger, never a mobile device frame. Degrade noted per prompt (768 / 390).
7. **One decisive accent** — `--primary` electric blue throughout; `--accent` cyan at most once per view. Never lavender, mint, or yellow.

---

## Shared blocks reference

Canonical **SHELL CHROME** and **LUTHAS_NAV** are defined in **LUTHAS-01-A**; later prompts inherit by reference. Tokens cited by name from `src/shared/design/tokens.ts`. Brand SSOT: [`DESIGN.md`](./DESIGN.md). Rationale: `docs/design/DESIGN-SYSTEM-RECOMMENDATION.md`. Career source: `career-corpus/` + `project-polaris/`.

---

# ═══════════════════════════════════════════════════
# A BRAND / ENTRY — HOME (LUTHAS-001)  ·  defines canonical SHELL CHROME + LUTHAS_NAV
# ═══════════════════════════════════════════════════

## PROMPT LUTHAS-01-A — Home (hero + proof + expertise)
**Slice:** LUTHAS-001 | **Agent:** 06 | **Tier:** 1 | **Priority:** P0
**Personas:** P01 Hiring Executive, P02 Technical Recruiter, P03 Enterprise Engineering Leader
**Component Target:** `src/app/page.tsx` → `src/widgets/Hero.tsx` (+ `src/widgets/home/*`, `Header.tsx`, `Footer.tsx`)

### PASTE-READY PROMPT

```
AGENT ROLE: You are Agent 06 — Brand & Entry Designer (Tier 1). You produce executive-portfolio-grade first impressions: quiet enterprise authority (Linear / Vercel / Stripe register) with proof scannable in 5 seconds. Output is conversion-ready for Next.js App Router + Tailwind v4 inside src/ (Feature-Sliced Design). Shell chrome in widgets/Header + widgets/Footer; page content in widgets/.

BRAND: Dame Luthas — Cloud Architect & AI Transformation Leader (15 years); also Senior Microsoft 365 Consultant Architect. Uses Luthas Enterprise design tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, single dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, enterprise engineering leaders, Microsoft-stack / Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4 (@theme tokens in globals.css), FSD widgets.
VIBE: Senior, enterprise-grade, AI-forward. Quiet authority — proof is the hero, design is the frame.
FONTS: Display: Outfit 800 UPPERCASE (hero H1, section anchors) | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif (sparing). tabular-nums on stat figures.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). One continuous dark navy canvas. Cards = surface + 1px border (not heavy shadows). Soft-rectangle buttons (RADIUS.md). One decisive accent. Real corpus data in copy — never the removed demo content.

SUBJECT: The portfolio homepage — hero (no card), a 4-metric stat strip, a flagship-platform proof band, an enterprise expertise grid, selected case studies, and a testimonial — establishing senior cloud + AI-transformation positioning with evidence above the fold.

SCENE: A VP of Engineering lands from LinkedIn with ~5 seconds of attention. The hero headline + rotating discipline line + the stat strip immediately convey seniority and domains (cloud / AI platforms / transformation); the flagship-platform band (MALFIG/CORTEX, MAXIMUS AI, Project Polaris) and metrics supply proof; a single primary CTA ("Book a discovery call") is the next action.

TARGET PERSONAS: P01 Hiring Executive (assess seniority + fit), P02 Technical Recruiter (scan domains + proof), P03 Enterprise Engineering Leader (gauge platform depth).

LAYOUT SPEC:
- SHELL CHROME (CANONICAL — defined here, inherited by all later prompts): Sticky top header, 72px, transparent navy with a 1px --border-subtle bottom rule. Left: "DAME LUTHAS" wordmark Outfit 700 18px --foreground. Center: LUTHAS_NAV. Right: monochrome social icons (LinkedIn linkedin.com/in/dameluthas, GitHub github.com/DaBigHomie) + a soft-rectangle primary button "Book a discovery call" (--primary fill, --primary-foreground dark text, RADIUS.md). Footer (CANONICAL): on --background, 1px --border-subtle top rule, wordmark + secondary nav + "Cloud Architect & AI Transformation Leader · Atlanta / Brooklyn" credential line + social. NO white footer bar.
- LUTHAS_NAV (show ALL items, highlight active): Home | Case Studies | About | Contact. Active item = Home (--primary underline 2px + --foreground text; inactive --muted-foreground).
- HERO (no card), 12-col grid, 1170px max, two columns: LEFT (7 col) — eyebrow "CLOUD ARCHITECT & AI TRANSFORMATION LEADER" Outfit 600 14px --primary tracking 0.18em; H1 "HI, I'M DAME LUTHAS. LET'S BUILD TOGETHER" Outfit 800 UPPERCASE clamp(40px,6.5vw,96px) --foreground; proof subhead Outfit 400 18px --muted-foreground ("15 years architecting cloud, Microsoft 365, and multi-agent AI platforms — 89 projects across 80+ repos."); rotating discipline line "Cloud Architecture · Multi-Agent AI · Digital Transformation" --primary; primary CTA "Book a discovery call" + ghost CTA "View case studies" (1px --border). RIGHT (5 col) — professional headshot in RADIUS.lg frame with a subtle --glow-soft primary edge.
- STAT STRIP: 4 columns on --surface band, 1px --border. Each: figure Outfit 800 clamp(40px,5vw,72px) --primary tabular-nums + caption Outfit 500 --muted-foreground — "580-agent AI platform" (MAXIMUS), "89 projects shipped", "80+ repositories", "20–30× faster image generation" (ONE4THREE).
- FLAGSHIP-PLATFORM PROOF BAND: centered line "Builder of multi-agent AI platforms and enterprise cloud systems" Outfit 600 --foreground; below, a row of monochrome flagship wordmarks/cards — MALFIG/CORTEX, MAXIMUS AI, Project Polaris, ATL Table Booking (Caro), Stitch Mockup Toolkit (--muted-foreground; replaces the removed UN/WHO logo marquee). NEVER show UN/WHO/UNICEF logos.
- EXPERTISE GRID: 4 --surface cards (1px --border, RADIUS.lg): each = --primary line icon, title Outfit 600, one-line desc --muted-foreground, "Learn more →" --primary — (1) Multi-Agent AI Platforms (orchestration, MCP, agent registries, governance/merge gates), (2) Cloud Architecture & Microsoft 365, (3) Applied AI Products (auto-apply engine, 30× image pipeline), (4) Hospitality-Tech Platforms (web + mobile).
- SELECTED CASE STUDIES: 2 cards — thumbnail, metadata "context · scope · year" --muted-foreground caption, title Outfit 600, one headline metric --primary, "Read case study →" — MALFIG/CORTEX Multi-Agent Platform (580 agents) and ONE4THREE 30× Image Pipeline (20–30×).
- TESTIMONIAL: Cardo serif pull-quote clamp(22px,2.4vw,30px) with a 2px --primary left rule + attribution (enterprise engineering leader).

RESPONSIVE CONTEXT: Desktop-first 1440×900 web. Header always visible — never a hamburger. Degrade: 768 (nav condenses, hero stacks, stat strip 2×2), 390 (single column).

COMPONENT TARGET: src/app/page.tsx (native-shell branch) → src/widgets/Hero.tsx + src/widgets/home/{AdvisorSection,LogoMarquee,ServiceBlockSection,TestimonialsCarousel}.tsx + src/widgets/Header.tsx + src/widgets/Footer.tsx

COLORS: tokens.colors.primary (--primary) — eyebrow, CTAs, links, stat figures, active nav underline, focus ring | tokens.colors.primary.foreground (--primary-foreground) — text/icons ON primary fills (dark) | tokens.colors.accent (--accent) — at most one highlight | tokens.colors.background (--background) — canvas | tokens.colors.surface (--surface) — stat band + cards | tokens.colors.elevated (--elevated) — menus | tokens.colors.foreground (--foreground) — primary text | tokens.colors.mutedForeground (--muted-foreground) — captions, inactive nav, flagship wordmarks | tokens.colors.border (--border) / --border-subtle — card + chrome rules

TOKENS: SPACING py-20→28 sections | 1170px container, px-6 | RADIUS.lg cards (1rem) | RADIUS.xl major sections (1.5rem) | RADIUS.md buttons (0.75rem, soft-rectangle) | --glow-soft on headshot frame | focus 2px solid --ring outline, 2px offset | 72px header | tabular-nums on stat figures

VARIANT: EXPLORATION — try 2 hero compositions: (A) headshot-right with stat strip below; (B) centered headline with the stat strip as the proof band. Keep the dark register and single-accent discipline. This prompt defines the canonical shell chrome — lock it.

STYLE: High-fidelity desktop web mockup at Figma presentation quality. Quiet enterprise authority (Linear / Vercel / Stripe). Strong Outfit weight/case contrast, hairline borders, generous whitespace, subtle --primary glow on focus/active only. Evidence as large --primary stat callouts. Monochrome flagship wordmarks. Real corpus data.

NEGATIVE: No mobile device frames. No hamburger menus. No inconsistent Dame Luthas wordmark. No white/ivory full-bleed backgrounds. No lavender/periwinkle, mint, or yellow. No glassmorphism or neon/club glow. No Inter, Roboto, or SF Pro — Outfit + Cardo only. No emoji as icons. No clip art or stock blobs. No wireframes — final-fidelity only. No hardcoded hex values. No SMB/freelancer framing. No UN/WHO/UNICEF "advisor" claim or logos. No "Amazon Labor Union" or "Gatorade" content.

BACKGROUND: 1440×900 web mockup floating on a deep-navy --background surface. SHADOWS.xl under canvas. Subtle --primary ambient glow upper-left. No browser chrome.
```

---

# ═══════════════════════════════════════════════════
# B DISCOVERY — CASE STUDIES INDEX (LUTHAS-002)
# ═══════════════════════════════════════════════════

## PROMPT LUTHAS-02-A — Case Studies index (filterable grid)
**Slice:** LUTHAS-002 | **Agent:** 08 | **Tier:** 2 | **Priority:** P1
**Personas:** P01 Hiring Executive, P02 Technical Recruiter, P03 Enterprise Engineering Leader
**Component Target:** `src/app/case-studies/page.tsx` → `src/widgets/CaseStudiesPage.tsx` (+ PortfolioGrid, PortfolioFilterMenu)

### PASTE-READY PROMPT

```
AGENT ROLE: You are Agent 08 — Discovery & Navigation Designer (Tier 2). You make a body of real enterprise + AI-platform work scannable and filterable, outcomes-first. Output is conversion-ready for Next.js App Router + Tailwind v4 inside src/ (FSD).

BRAND: Dame Luthas — Cloud Architect & AI Transformation Leader (15 years). Uses Luthas Enterprise design tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, single dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, enterprise engineering leaders, Microsoft-stack / Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4, FSD widgets.
VIBE: Senior, enterprise-grade, quiet authority. Outcomes first.
FONTS: Display: Outfit 800 UPPERCASE | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif. tabular-nums on metrics.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). Cards = surface + 1px border. One decisive accent. Real corpus case data only.

SUBJECT: The Case Studies index — a filterable 3-column grid of Dame's real flagship engagements, each card outcomes-first with one headline metric, plus a filter row.

SCENE: A hiring panel verifies depth and relevance — scanning for domain fit (AI platforms / cloud / hospitality-tech) and hard results, then opening the most relevant case. The "All" filter is active; a cyan "Flagship" tag distinguishes the platform-scale engagements.

TARGET PERSONAS: P01 Hiring Executive (assess relevance), P02 Technical Recruiter (scan breadth), P03 Enterprise Engineering Leader (find platform analog).

LAYOUT SPEC:
- SHELL CHROME INHERITED from LUTHAS-01-A — sticky 72px top header (DAME LUTHAS wordmark + LUTHAS_NAV + social icons + "Book a discovery call" primary button) and canonical navy footer. Do not redesign.
- LUTHAS_NAV (show ALL items, highlight active): Home | Case Studies | About | Contact. Active item = Case Studies (--primary underline 2px + --foreground text).
- PAGE INTRO: breadcrumb "Home / Case Studies" --muted-foreground with --primary active; H1 "Case Studies" Outfit 700 clamp(28px,3vw,40px) --foreground; one --muted-foreground intro line ("Multi-agent AI platforms, cloud + Microsoft 365, applied-AI products, and hospitality-tech — outcomes first.").
- FILTER ROW 48px: a soft-rectangle "All ▾" dropdown styled as an --elevated menu (1px --border, RADIUS.md); filter pills (rounded-full) for AI Platforms / Cloud & M365 / Applied AI / Hospitality-Tech — ACTIVE pill = --primary-soft fill + --primary border + --foreground text; inactive = 1px --border + --muted-foreground.
- CARD GRID 3-column, --surface cards (1px --border, RADIUS.lg): each = 16:9 thumbnail; metadata "context · scope · year" Outfit 500 --muted-foreground caption; title Outfit 600 --foreground; ONE headline metric Outfit 800 --primary tabular-nums; a cyan "Flagship" tag (--accent) on platform-scale work; "Read case study →" --primary. Hover = lift to SHADOWS.md + --primary border. Real cards: "MALFIG/CORTEX Multi-Agent Platform" (580 agents · 11 repos), "ONE4THREE 30× Image Pipeline" (20–30× faster), "Project Polaris — Career Intelligence Engine" (auto-apply, Playwright + Supabase), "ATL Table Booking / Caro" (reservations marketplace, web + mobile), "MAXIMUS AI — 580-Agent Deployment Platform", "WordPress → React Migrations" (at volume).

RESPONSIVE CONTEXT: Desktop-first 1440×900 web. Header always visible. Degrade: 768 (2-col grid), 390 (1-col; filter row scrolls horizontally).

COMPONENT TARGET: src/app/case-studies/page.tsx → src/widgets/CaseStudiesPage.tsx (+ src/widgets/PortfolioGrid.tsx, src/widgets/PortfolioFilterMenu.tsx)

COLORS: tokens.colors.primary (--primary) — active nav + headline metrics + links | tokens.colors.primary.foreground (--primary-foreground) — text on primary fills | tokens.colors.accent (--accent) — "Flagship" tag ONLY | tokens.colors.background (--background) — canvas | tokens.colors.surface (--surface) — cards | tokens.colors.elevated (--elevated) — dropdown | tokens.colors.foreground (--foreground) — titles | tokens.colors.mutedForeground (--muted-foreground) — metadata, inactive | tokens.colors.border (--border) — card + pill rules. Active-pill text on --primary-soft = --foreground.

TOKENS: SPACING py-20 section | grid gap 1.5–2rem | RADIUS.lg cards | RADIUS.md dropdown + buttons | RADIUS.full pills | --elevated dropdown surface | focus 2px solid --ring | 48px filter row

VARIANT: REFINEMENT — inherit shell chrome from LUTHAS-01-A exactly. Lock the card anatomy; explore ONLY the filter-row treatment (pills vs. a segmented control). Emphasize card-grid rhythm and metric legibility.

STYLE: High-fidelity desktop web mockup at Figma presentation quality. Even card rhythm, clear metadata hierarchy, outcomes in --primary blue. Hairline borders, restrained motion (hover lift only).

NEGATIVE: No mobile device frames. No hamburger menus. No inconsistent Dame Luthas wordmark. No white backgrounds. No lavender, mint, or yellow. No glassmorphism or neon. No Inter/Roboto/SF Pro — Outfit + Cardo only. No emoji as icons. No wireframes — final-fidelity only. No hardcoded hex values. No SMB/freelancer framing. No "Amazon Labor Union" or "Gatorade" demo cards.

BACKGROUND: 1440×900 web mockup floating on a deep-navy --background surface. SHADOWS.xl under canvas. Subtle --primary ambient glow upper-left. No browser chrome.
```

---

# ═══════════════════════════════════════════════════
# A BRAND / ENTRY — ABOUT (LUTHAS-003)
# ═══════════════════════════════════════════════════

## PROMPT LUTHAS-03-A — About (bio + credentials + quote)
**Slice:** LUTHAS-003 | **Agent:** 07 | **Tier:** 1 | **Priority:** P1
**Personas:** P01 Hiring Executive, P03 Enterprise Engineering Leader, P02 Technical Recruiter
**Component Target:** `src/app/[slug]/page.tsx` (about slug) → `src/widgets/AboutPage.tsx`

### PASTE-READY PROMPT

```
AGENT ROLE: You are Agent 07 — Personal-Brand & Credibility Designer (Tier 1). You translate a senior career into concrete, verifiable expertise without vague filler. Output is conversion-ready for Next.js App Router + Tailwind v4 inside src/ (FSD).

BRAND: Dame Luthas — Cloud Architect & AI Transformation Leader (15 years); Senior Microsoft 365 Consultant Architect. Uses Luthas Enterprise design tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, single dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, enterprise engineering leaders, Microsoft-stack / Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4, FSD widgets.
VIBE: Senior, enterprise-grade, quiet authority. Concrete over vague.
FONTS: Display: Outfit 800 UPPERCASE | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). Cards = surface + 1px border. One decisive accent. Real corpus credentials only.

SUBJECT: The About page — a concise senior bio, concrete expertise chips, a credential/certifications block, and one career-defining Cardo pull-quote.

SCENE: A stakeholder vetting fit reads for specifics: which domains, which stack, what scale. The page states the real positioning — 15 years across cloud architecture, Microsoft 365, and multi-agent AI; builder of MALFIG/CORTEX and MAXIMUS AI; 89 projects across 80+ repos — and replaces vague language with concrete expertise.

TARGET PERSONAS: P01 Hiring Executive (assess depth), P03 Enterprise Engineering Leader (verify platform pedigree), P02 Technical Recruiter (extract specifics).

LAYOUT SPEC:
- SHELL CHROME INHERITED from LUTHAS-01-A — sticky 72px top header + canonical navy footer. Do not redesign.
- LUTHAS_NAV (show ALL items, highlight active): Home | Case Studies | About | Contact. Active item = About (--primary underline 2px + --foreground text).
- BODY (asymmetric 2-col [1fr / 1.3fr], 1170px): LEFT — professional headshot RADIUS.lg; below, a --surface card (1px --border, RADIUS.lg) credential block — "Atlanta, GA / Brooklyn, NY", "15 years experience", and certifications incl. "Senior Microsoft 365 Consultant Architect", "AI Transformation Leader" (Outfit 500 --muted-foreground). RIGHT — H1 "About Dame Luthas" Outfit 700 clamp(28px,3vw,40px) --foreground; concise senior bio Outfit 400 18px --foreground (concrete, no filler); a row of bordered expertise chips (rounded-full, 1px --border, --muted-foreground → --primary on hover): "Cloud Architecture", "Microsoft 365", "Multi-Agent AI Platforms", "AI-Driven Automation", "Cybersecurity, Risk & Compliance", "Program & Change Management"; then a Cardo serif pull-quote clamp(22px,2.4vw,30px) --foreground with a 2px --primary left rule (one career-defining line).
- TECH BAND: monochrome stack/flagship wordmarks (Anthropic API, Supabase, Next.js, Microsoft 365, Vercel, MALFIG/CORTEX) under a --muted-foreground "Builds with" label. (Replaces the removed UN/WHO "Trusted by" logos.)
- CTA BAND: --surface band (1px --border top/bottom), short headline + primary "Let's talk" button (--primary fill, --primary-foreground text).

RESPONSIVE CONTEXT: Desktop-first 1440×900 web. Header always visible. Degrade: 768 (stack — card above bio), 390 (single column; chips wrap).

COMPONENT TARGET: src/app/[slug]/page.tsx (about slug) → src/widgets/AboutPage.tsx

COLORS: tokens.colors.primary (--primary) — active nav, chip hover, quote rule, CTA | tokens.colors.primary.foreground (--primary-foreground) — text on primary fill | tokens.colors.accent (--accent) — optional, once | tokens.colors.background (--background) — canvas | tokens.colors.surface (--surface) — credential card + CTA band | tokens.colors.foreground (--foreground) — headings, bio | tokens.colors.mutedForeground (--muted-foreground) — captions, chips, stack wordmarks | tokens.colors.border (--border) — card + chip rules

TOKENS: SPACING py-20 sections | RADIUS.lg credential card + headshot | RADIUS.full chips | RADIUS.md CTA button | Cardo serif pull-quote + 2px --primary left rule | focus 2px solid --ring

VARIANT: REFINEMENT — inherit shell chrome from LUTHAS-01-A exactly. Keep the asymmetric grid; explore the credential block as a card vs. an inline definition list. One Cardo serif accent only (the quote).

STYLE: High-fidelity desktop web mockup at Figma presentation quality. Editorial executive warmth; one Cardo serif accent. Concrete, specific copy; no filler. Hairline borders.

NEGATIVE: No mobile device frames. No hamburger menus. No inconsistent Dame Luthas wordmark. No white backgrounds. No lavender, mint, or yellow. No glassmorphism or neon. No Inter/Roboto/SF Pro — Outfit + Cardo only. No emoji as icons. No vague buzzwords. No wireframes — final-fidelity only. No hardcoded hex values. No UN/WHO/UNICEF "advisor" claim or logos.

BACKGROUND: 1440×900 web mockup floating on a deep-navy --background surface. SHADOWS.xl under canvas. Subtle --primary ambient glow upper-left. No browser chrome.
```

---

# ═══════════════════════════════════════════════════
# C DETAIL — PORTFOLIO: MALFIG / CORTEX MULTI-AGENT PLATFORM (LUTHAS-004)
# ═══════════════════════════════════════════════════

## PROMPT LUTHAS-04-A — Portfolio detail: MALFIG / CORTEX Multi-Agent Platform
**Slice:** LUTHAS-004 | **Agent:** 11 | **Tier:** 3 | **Priority:** P1
**Personas:** P01 Hiring Executive, P03 Enterprise Engineering Leader, P02 Technical Recruiter
**Component Target:** `src/app/portfolio/[slug]/page.tsx` → `src/widgets/portfolio/PortfolioDetail.tsx` (+ GalleryGrid, PortfolioInfo, PortfolioNav)

### PASTE-READY PROMPT

```
AGENT ROLE: You are Agent 11 — Case-Study Narrative Designer (Tier 3). You structure an engagement as Challenge → Approach → Solution → Results, with outcomes surfaced as stat callouts and captioned architecture visuals. Output is conversion-ready for Next.js App Router + Tailwind v4 inside src/ (FSD).

BRAND: Dame Luthas — Cloud Architect & AI Transformation Leader (15 years). Uses Luthas Enterprise design tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, single dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, enterprise engineering leaders, Microsoft-stack / Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4, FSD widgets.
VIBE: Senior, enterprise-grade, quiet authority. Systems story + proof.
FONTS: Display: Outfit 800 UPPERCASE | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif. tabular-nums on stats.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). Reading-optimized measure. One decisive accent. Real architecture + metrics; captioned diagrams.

SUBJECT: The MALFIG / CORTEX Multi-Agent Platform case-study detail — metadata header, a Challenge → Approach → Solution → Results narrative spine, stat callouts, a captioned architecture gallery, an engineering pull-quote, and prev/next nav.

SCENE: A reader who clicked from the index wants the platform story and the proof: coordinating many AI coding agents across 80+ repos without drift; the answer — CORTEX shared memory + Forge routing + governance/merge gates (Maximus Prime) — culminating in MAXIMUS AI, a 580-agent deployment platform. Results surface as large --primary stats ("580 agents", "11 platform repos", "89 projects orchestrated"), with one --accent cyan headline ("580 agents"); architecture diagrams are captioned with their role.

TARGET PERSONAS: P01 Hiring Executive (assess platform scale), P03 Enterprise Engineering Leader (architecture rigor), P02 Technical Recruiter (verify depth).

LAYOUT SPEC:
- SHELL CHROME INHERITED from LUTHAS-01-A — sticky 72px top header + canonical navy footer. Do not redesign.
- LUTHAS_NAV (show ALL items, highlight active): Home | Case Studies | About | Contact. Active item = Case Studies (--primary underline 2px + --foreground text).
- DETAIL HERO: breadcrumb "Home / Case Studies / MALFIG · CORTEX" --muted-foreground; metadata row "Context: Damieus platform · Scope: Multi-agent orchestration & governance · Role: Cloud Architect / Platform Lead · 2026" Outfit 500 --muted-foreground; H1 "MALFIG / CORTEX — Multi-Agent AI Platform" Outfit 800 UPPERCASE clamp(36px,4.6vw,64px) --foreground; one-line summary.
- NARRATIVE SPINE (centered max-w-prose): four stacked sections, Outfit 600 heading + Outfit 400 body — Challenge (coordinate AI coding agents across 80+ repos without drift, conflicts, or RLS/governance gaps) → Approach (CORTEX shared memory in Supabase, Forge model/agent routing, blast-radius analysis, file-lock manager, cold-review + merge gates) → Solution (MAXIMUS AI — a 580-agent deployment platform with an agent registry and IntentEnvelope intake; 11 platform repos) → Results.
- STAT CALLOUTS (in/after Results): large figures Outfit 800 --primary tabular-nums — "580 agents", "11 platform repos", "89 projects · 80+ repos orchestrated"; --accent cyan used ONCE on "580 agents".
- GALLERY: 3-column grid (1px --border frames, RADIUS.lg), EACH image captioned Outfit 500 --muted-foreground — "CORTEX schema (sessions · tasks · knowledge)", "Agent registry & cluster/swarm map", "Forge routing + blast-radius", "Merge-gate / Maximus Prime L-stack". (Architecture diagrams, not photos.)
- ENGINEERING PULL-QUOTE: Cardo serif clamp(22px,2.4vw,30px) --foreground, 2px --primary left rule, attributed.
- PREV / NEXT portfolio nav: bordered (1px --border), --muted-foreground → --primary on hover.

RESPONSIVE CONTEXT: Desktop-first 1440×900 web. Header always visible. Degrade: 768 (gallery 2-col), 390 (1-col; spine full-width).

COMPONENT TARGET: src/app/portfolio/[slug]/page.tsx (slug: malfig-cortex-multi-agent-platform) → src/widgets/portfolio/PortfolioDetail.tsx (+ GalleryGrid.tsx, PortfolioInfo.tsx, PortfolioNav.tsx)

COLORS: tokens.colors.primary (--primary) — stats, links, active nav, quote rule | tokens.colors.primary.foreground (--primary-foreground) — text on primary fill | tokens.colors.accent (--accent) — the single "580 agents" headline ONLY | tokens.colors.background (--background) — canvas | tokens.colors.surface (--surface) — cards | tokens.colors.foreground (--foreground) — headings, body | tokens.colors.mutedForeground (--muted-foreground) — metadata, captions | tokens.colors.border (--border) — gallery frames + nav

TOKENS: SPACING py-16→20 sections | RADIUS.lg gallery + cards | RADIUS.md buttons | stat figures Outfit 800 tabular-nums | focus 2px solid --ring

VARIANT: REFINEMENT — inherit shell chrome from LUTHAS-01-A exactly. Lock the Challenge→Results spine; explore stat-callout placement (inline band vs. a results card). Architecture-forward captioned gallery.

STYLE: High-fidelity desktop web mockup at Figma presentation quality. Reading-optimized spine (comfortable measure), architecture-forward captioned gallery, outcomes in --primary blue, one --accent highlight. Hairline borders, restrained motion.

NEGATIVE: No mobile device frames. No hamburger menus. No inconsistent Dame Luthas wordmark. No white backgrounds. No lavender, mint, or yellow. No glassmorphism or neon. No Inter/Roboto/SF Pro — Outfit + Cardo only. No emoji as icons. No uncaptioned image dumps. No wireframes — final-fidelity only. No hardcoded hex values. No "Amazon Labor Union" content.

BACKGROUND: 1440×900 web mockup floating on a deep-navy --background surface. SHADOWS.xl under canvas. Subtle --primary ambient glow upper-left. No browser chrome.
```

---

# ═══════════════════════════════════════════════════
# C DETAIL — PORTFOLIO: ONE4THREE 30× IMAGE PIPELINE (LUTHAS-005)
# ═══════════════════════════════════════════════════

## PROMPT LUTHAS-05-A — Portfolio detail: ONE4THREE 30× Generative-AI Image Pipeline
**Slice:** LUTHAS-005 | **Agent:** 11 | **Tier:** 3 | **Priority:** P1
**Personas:** P01 Hiring Executive, P03 Enterprise Engineering Leader (AI/innovation), P02 Technical Recruiter
**Component Target:** `src/app/portfolio/[slug]/page.tsx` → `src/widgets/portfolio/PortfolioDetail.tsx` (+ GalleryGrid, PortfolioInfo, PortfolioNav)

### PASTE-READY PROMPT

```
AGENT ROLE: You are Agent 11 — Case-Study Narrative Designer (Tier 3). You structure this generative-AI engagement as Challenge → Approach → Solution → Results; the AI-generated product imagery is the only saturated color, framed by restrained navy/blue chrome. Output is conversion-ready for Next.js App Router + Tailwind v4 inside src/ (FSD).

BRAND: Dame Luthas — Cloud Architect & AI Transformation Leader (15 years). Uses Luthas Enterprise design tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, single dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, enterprise engineering leaders, Microsoft-stack / Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4, FSD widgets.
VIBE: Senior, enterprise-grade, quiet authority. Applied-AI proof.
FONTS: Display: Outfit 800 UPPERCASE | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif. tabular-nums on stats.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). Restrained chrome so the AI imagery pops. One decisive accent. Real metrics; captioned visuals.

SUBJECT: The ONE4THREE 30× Generative-AI Image Pipeline case-study detail — metadata header, a Challenge → Approach → Solution → Results spine, throughput stat callouts, and a gallery of the AI-generated product designs (each captioned). (This pipeline produced the vivid AI bottle/label artwork.)

SCENE: A reader evaluating applied-AI depth wants the business problem (producing on-brand, individualized product imagery — e.g. custom bottle/label designs — at scale), the gen-AI pipeline approach (image-gen-30x-cli on Gemini / Google Cloud), the solution, and the result ("20–30× faster" image generation). Throughput surfaces as --primary stats with one --accent cyan headline ("20–30×"); the vivid lightning-bolt bottle artwork is the only saturated color, framed by the navy/blue system.

TARGET PERSONAS: P01 Hiring Executive (assess applied-AI outcome), P03 Enterprise Engineering Leader (pipeline rigor), P02 Technical Recruiter (verify applied-AI depth).

LAYOUT SPEC:
- SHELL CHROME INHERITED from LUTHAS-01-A — sticky 72px top header + canonical navy footer. Do not redesign.
- LUTHAS_NAV (show ALL items, highlight active): Home | Case Studies | About | Contact. Active item = Case Studies (--primary underline 2px + --foreground text).
- DETAIL HERO: breadcrumb "Home / Case Studies / ONE4THREE 30× Pipeline" --muted-foreground; metadata row "Context: ONE4THREE · Scope: Generative-AI image pipeline (image-gen-30x-cli) · Role: AI Strategist / Pipeline Architect · 2026" Outfit 500 --muted-foreground; H1 "ONE4THREE — 30× Generative-AI Image Pipeline" Outfit 800 UPPERCASE clamp(36px,4.6vw,64px) --foreground; one-line summary.
- NARRATIVE SPINE (centered max-w-prose): Challenge (on-brand individualized product imagery at scale — bottle/label designs) → Approach (a 30× generative-AI pipeline: image-gen-30x-cli, Gemini / Google Cloud, batch + brand guardrails) → Solution → Results — each Outfit 600 heading + Outfit 400 body.
- STAT CALLOUTS: large figures Outfit 800 --primary tabular-nums — "20–30× faster generation" + throughput/volume; --accent cyan used ONCE on "20–30×".
- GALLERY: grid of the AI-generated product designs (vivid lightning-bolt bottle/label artwork — sport, abstract, character themes) with 3:4 frames (1px --border, RADIUS.lg), EACH captioned Outfit 500 --muted-foreground with theme/use — the artwork is the ONLY saturated color on the page. (Reuse the existing AI bottle imagery from the prior gallery; the design system frames it, the pipeline produced it.)
- CLIENT PULL-QUOTE: Cardo serif clamp(22px,2.4vw,30px) --foreground, 2px --primary left rule, attributed.
- PREV / NEXT portfolio nav: bordered (1px --border), --muted-foreground → --primary on hover.

RESPONSIVE CONTEXT: Desktop-first 1440×900 web. Header always visible. Degrade: 768 (gallery 2-col), 390 (1-col; bottle images keep 3:4 aspect).

COMPONENT TARGET: src/app/portfolio/[slug]/page.tsx (slug: one4three-30x-image-pipeline) → src/widgets/portfolio/PortfolioDetail.tsx (+ GalleryGrid.tsx, PortfolioInfo.tsx, PortfolioNav.tsx)

COLORS: tokens.colors.primary (--primary) — stats, links, active nav, quote rule | tokens.colors.primary.foreground (--primary-foreground) — text on primary fill | tokens.colors.accent (--accent) — the single "20–30×" headline ONLY (keep chrome restrained so the artwork pops) | tokens.colors.background (--background) — canvas | tokens.colors.surface (--surface) — cards | tokens.colors.foreground (--foreground) — headings, body | tokens.colors.mutedForeground (--muted-foreground) — metadata, captions | tokens.colors.border (--border) — gallery frames + nav

TOKENS: SPACING py-16→20 sections | RADIUS.lg gallery cards (3:4 bottle frames) | RADIUS.md buttons | stat figures Outfit 800 tabular-nums | focus 2px solid --ring

VARIANT: REFINEMENT — inherit shell chrome from LUTHAS-01-A exactly. Keep the LUTHAS-04-A spine; explore the gallery as a masonry vs. a uniform grid for the artwork. Restrained chrome so the saturated artwork is the focus.

STYLE: High-fidelity desktop web mockup at Figma presentation quality. Restrained navy/blue chrome so the saturated AI imagery is the focus. Outcomes in --primary blue, one --accent highlight. Captions on every image. Hairline borders.

NEGATIVE: No mobile device frames. No hamburger menus. No inconsistent Dame Luthas wordmark. No white backgrounds. No lavender, mint, or yellow chrome. No glassmorphism or neon UI. No Inter/Roboto/SF Pro — Outfit + Cardo only. No emoji as icons. No uncaptioned image dumps. No wireframes — final-fidelity only. No hardcoded hex values. No "Gatorade" brand framing — credit the ONE4THREE 30× pipeline as the work.

BACKGROUND: 1440×900 web mockup floating on a deep-navy --background surface. SHADOWS.xl under canvas. Subtle --primary ambient glow upper-left. No browser chrome.
```

---

### Usage
1. Open Google Stitch → new desktop/web design.
2. Paste one PASTE-READY PROMPT (13-block complete). Generate.
3. Iterate: regenerate any section that drifts toward lavender / pills / SMB framing / glassmorphism / a sidebar / the removed demo content (UN logos, ALU, Gatorade).
4. Export PNG → `output/stitch/luthas-enterprise/images/`. Compare color/spacing against shipped tokens (`src/app/globals.css`, `src/shared/design/tokens.ts`).
5. COMPONENT TARGET names the FSD destination file for the React implementation step. Detail slugs changed — update the portfolio data (`content.json`) to match the real projects.
