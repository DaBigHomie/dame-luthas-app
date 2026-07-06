---
tags: [dame-luthas, stitch, prompts, luthas-enterprise, portfolio, desktop]
topic: "Dame Luthas portfolio — Stitch prompts (Luthas Enterprise, desktop web)"
created: "2026-06-11"
updated: "2026-06-13"
sequence: V3
category: "prompts"
repo: dame-luthas-app
inherits_from: ["stitch-mockup-toolkit/docs/01-STRATEGY.md (13-Block Composition)", "atl-table-booking-app/docs/prompts/stitch_mockups_prompts/CARO-CRM-STITCH-PROMPTS-V4.md (format)"]
sourced_from: ["CORTEX career_projects (17 programs · 89 projects)", "career-corpus/enriched/bundles/*", "project-polaris/data/{profile,contact-profile,resume-index,skills_matrix}.json"]
---

# Dame Luthas — Portfolio Stitch Prompts (Luthas Enterprise)
## Version: 3.0 | Total Prompts: 8 | Agent: 06 (Tier 1 — Brand & Entry Designer)
## Brand: Dame Luthas — Cloud Architect & AI Transformation Leader (15 yrs) | Repo: dame-luthas-app
## Demographic: hiring executives, technical recruiters, enterprise engineering leaders, Microsoft-stack / Fortune-500 transformation leads.
## Prompt Architecture: 13-Block Composition per `STITCH-PROMPTING-STRATEGY.md`

> **V3 — corpus-wide inventory.** Sourced from CORTEX `career_projects` (the full multi-repo analysis): **17 programs · 89 projects · 80+ repos**. Consulting/advisory client work (NOT in repos, so absent from the build corpus but **real**) is preserved: United Nations advisory, Amazon Labor Union digital transformation, Gatorade generative-AI bottle design, Microsoft 365 enterprise architecture. Build flagships added as **additional** case studies: MALFIG/CORTEX (13-repo multi-agent platform), MAXIMUS AI (580 agents), ONE4THREE 30× image pipeline (the AI bottle artwork is this pipeline's output), Project Polaris (career-intelligence auto-apply engine), ATL Table Booking/Caro (reservations marketplace, web+mobile), ATL Tequila Week (8-repo festival platform), and WordPress→React migrations at volume.

**Phase 0 workflow:** Run each paste-ready prompt **in Stitch** → export PNG → `output/stitch/luthas-enterprise/images/`. The image is the spec for React implementation; COMPONENT TARGET names the file to build after.

---

## Prompts in this file

| Slice | Layer | Stitch ID | Title | Priority | Component target |
|---|---|---|---|---|---|
| LUTHAS-001 | A Brand/Entry | LUTHAS-01-A | Home — hero + proof + expertise | P0 | `src/app/page.tsx` → `src/widgets/Hero.tsx` |
| LUTHAS-002 | B Discovery | LUTHAS-02-A | Case Studies index — full real inventory | P1 | `src/app/case-studies/page.tsx` → `src/widgets/CaseStudiesPage.tsx` |
| LUTHAS-003 | A Brand/Entry | LUTHAS-03-A | About — bio + credentials + quote | P1 | `src/app/[slug]/page.tsx` → `src/widgets/AboutPage.tsx` |
| LUTHAS-004 | C Detail | LUTHAS-04-A | Detail — Amazon Labor Union (consulting) | P1 | `src/app/portfolio/[slug]/page.tsx` → `src/widgets/portfolio/PortfolioDetail.tsx` |
| LUTHAS-005 | C Detail | LUTHAS-05-A | Detail — Gatorade Gen-AI bottles (consulting/applied AI) | P1 | `src/app/portfolio/[slug]/page.tsx` → `PortfolioDetail.tsx` |
| LUTHAS-006 | C Detail | LUTHAS-06-A | Detail — MALFIG/CORTEX Multi-Agent Platform (build) | P1 | `src/app/portfolio/[slug]/page.tsx` → `PortfolioDetail.tsx` |
| LUTHAS-007 | C Detail | LUTHAS-07-A | Detail — ONE4THREE 30× Image Pipeline (build) | P1 | `src/app/portfolio/[slug]/page.tsx` → `PortfolioDetail.tsx` |
| LUTHAS-008 | C Detail | LUTHAS-08-A | Detail — ATL Table Booking / Caro marketplace (build) | P2 | `src/app/portfolio/[slug]/page.tsx` → `PortfolioDetail.tsx` |

URL map: `/`→01-A · `/case-studies`→02-A · `/about`→03-A · `/portfolio/amazon-labor-union-digital-transformation`→04-A · `/portfolio/gatorade-embraces-generative-ai-powered-bottle-design`→05-A · `/portfolio/malfig-cortex-multi-agent-platform`→06-A · `/portfolio/one4three-30x-image-pipeline`→07-A · `/portfolio/atl-table-booking-caro`→08-A. (06–08 are additional real case studies — add to `content.json` / portfolio data.)

---

## Luthas-Specific Design Rules

1. **Brand tokens only** — colors reference keys from `src/shared/design/tokens.ts` (CSS vars in `globals.css`). **Never** hardcode hex. Names: `--primary` (electric blue), `--primary-foreground` (dark on primary), `--accent` (cyan), `--background`, `--surface`, `--elevated`, `--foreground`, `--muted-foreground`, `--border`, + `--success/--warning/--error/--info`.
2. **Shell chrome inheritance** — every prompt cites *"SHELL CHROME INHERITED from LUTHAS-01-A"*. Don't redesign the sticky top header (wordmark + nav + CTA) or navy footer. Top header, NOT a sidebar.
3. **Full nav registry** — every prompt lists `LUTHAS_NAV` and highlights the active item (`--primary` underline + `--foreground`).
4. **Real Dame Luthas data (corpus + consulting):** title **"Cloud Architect & AI Transformation Leader"** / "Senior Microsoft 365 Consultant Architect", 15 yrs, Atlanta GA + Brooklyn NY; LinkedIn `linkedin.com/in/dameluthas`, GitHub `github.com/DaBigHomie`, portfolio `damieus.com`. **Consulting (real, not in repos):** United Nations advisory + UN/WHO/UNICEF/UN Women/MSG/GLG, Amazon Labor Union — Digital Transformation, Gatorade — Generative-AI Bottle Design, Microsoft 365 enterprise architecture. **Build flagships:** MALFIG/CORTEX (13 repos), MAXIMUS AI (580 agents, 34 clusters), ONE4THREE 30× pipeline (20–30×), Project Polaris, ATL Table Booking/Caro, ATL Tequila Week (8 repos). Scale: 17 programs · 89 projects · 80+ repos. Never invent metrics.
5. **Fonts** — Outfit 800 UPPERCASE display; Outfit 600/700 titles; Outfit 400 body; **Cardo** serif for pull-quotes ONLY.
6. **Desktop-first 1440×900** — header always visible; never a hamburger, never a mobile device frame. Degrade 768 / 390.
7. **One decisive accent** — `--primary` electric blue; `--accent` cyan at most once per view. Never lavender, mint, or yellow.

---

## Shared blocks reference
Canonical **SHELL CHROME** + **LUTHAS_NAV** defined in **LUTHAS-01-A**; later prompts inherit by reference. Tokens by name from `src/shared/design/tokens.ts`. Brand SSOT: [`DESIGN.md`](./DESIGN.md). Career source: CORTEX `career_projects` + `career-corpus/` + `project-polaris/`.

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
AGENT ROLE: You are Agent 06 — Brand & Entry Designer (Tier 1). You produce executive-portfolio-grade first impressions: quiet enterprise authority (Linear / Vercel / Stripe register) with proof scannable in 5 seconds. Output is conversion-ready for Next.js App Router + Tailwind v4 inside src/ (FSD). Shell chrome in widgets/Header + widgets/Footer; content in widgets/.

BRAND: Dame Luthas — Cloud Architect & AI Transformation Leader (15 years); Senior Microsoft 365 Consultant Architect. Builder of a 580-agent multi-agent AI platform (MAXIMUS AI / MALFIG·CORTEX) and advisor to global institutions; 17 programs · 89 projects · 80+ repos. Uses Luthas Enterprise tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, single dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, enterprise engineering leaders, Microsoft-stack / Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4 (@theme tokens in globals.css), FSD widgets.
VIBE: Senior, enterprise-grade, AI-forward. Quiet authority — proof is the hero.
FONTS: Display: Outfit 800 UPPERCASE | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif. tabular-nums on stat figures.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). Continuous dark navy canvas. Cards = surface + 1px border. Soft-rectangle buttons (RADIUS.md). One decisive accent. Real corpus/consulting data only.

SUBJECT: The homepage — hero (no card), a 4-metric magnitude stat strip, a client + flagship proof band, an enterprise expertise grid (6), selected case studies, and a testimonial — establishing a 15-year Cloud Architect & AI Transformation Leader of platform scale.

SCENE: A VP of Engineering lands from LinkedIn with ~5 seconds. The hero headline + rotating discipline line + stat strip convey magnitude (580 AI agents, 89 projects, 15 years); the proof band shows real clients (UN/WHO/UNICEF) AND flagship platforms (MALFIG/CORTEX, MAXIMUS AI); one primary CTA ("Book a discovery call") is the next action.

TARGET PERSONAS: P01 Hiring Executive (assess seniority + scale), P02 Technical Recruiter (scan domains + proof), P03 Enterprise Engineering Leader (gauge platform depth).

LAYOUT SPEC:
- SHELL CHROME (CANONICAL — inherited by all later prompts): Sticky top header, 72px, transparent navy + 1px --border-subtle bottom rule. Left: "DAME LUTHAS" wordmark Outfit 700 18px --foreground. Center: LUTHAS_NAV. Right: social icons (LinkedIn linkedin.com/in/dameluthas, GitHub github.com/DaBigHomie) + soft-rectangle primary button "Book a discovery call" (--primary fill, --primary-foreground text, RADIUS.md). Footer (CANONICAL): on --background, 1px --border-subtle top rule, wordmark + secondary nav + "Cloud Architect & AI Transformation Leader · Atlanta / Brooklyn" credential line + social. NO white footer bar.
- LUTHAS_NAV (show ALL, highlight active): Home | Case Studies | About | Contact. Active = Home (--primary underline 2px + --foreground; inactive --muted-foreground).
- HERO (no card), 12-col, 1170px, 2-col: LEFT (7) — eyebrow "CLOUD ARCHITECT · AI TRANSFORMATION LEADER · MICROSOFT 365" Outfit 600 14px --primary tracking 0.18em; H1 "HI, I'M DAME LUTHAS. LET'S BUILD TOGETHER" Outfit 800 UPPERCASE clamp(40px,6.5vw,96px) --foreground; proof subhead Outfit 400 18px --muted-foreground ("15 years architecting enterprise cloud, Microsoft 365, and multi-agent AI — builder of a 580-agent platform, advisor to global institutions, 89 projects across 80+ repos."); rotating discipline line "Cloud Architecture · Multi-Agent AI · Digital Transformation" --primary; primary CTA "Book a discovery call" + ghost CTA "View case studies" (1px --border). RIGHT (5) — professional headshot in RADIUS.lg frame with subtle --glow-soft primary edge.
- STAT STRIP: 4 cols on --surface band, 1px --border. Figure Outfit 800 clamp(40px,5vw,72px) --primary tabular-nums + caption --muted-foreground — "580 AI agents orchestrated", "89 projects shipped", "80+ repositories", "20–30× faster image generation".
- PROOF BAND (two rows): row 1 line "Advisor to global institutions" + monochrome client logos UN, WHO, UNICEF, UN Women, Madison Square Garden, GLG (--muted-foreground); row 2 line "Builder of multi-agent AI platforms" + monochrome flagship wordmarks MALFIG·CORTEX, MAXIMUS AI, ONE4THREE, Project Polaris, Caro.
- EXPERTISE GRID: 6 --surface cards (1px --border, RADIUS.lg) — --primary line icon, title Outfit 600, 1-line desc --muted-foreground, "Learn more →": (1) Multi-Agent AI Platforms, (2) Cloud Architecture & Microsoft 365, (3) Applied AI Products, (4) Enterprise Digital Transformation, (5) Reservations & Hospitality Platforms, (6) Web at Volume (WordPress→React).
- SELECTED CASE STUDIES: 3 cards — Amazon Labor Union — Digital Transformation, MALFIG/CORTEX — Multi-Agent Platform (580 agents), ONE4THREE 30× Image Pipeline (20–30×); each metadata + one --primary headline metric + "Read case study →".
- TESTIMONIAL: Cardo serif pull-quote clamp(22px,2.4vw,30px), 2px --primary left rule, attribution.

RESPONSIVE CONTEXT: Desktop-first 1440×900. Header always visible. Degrade: 768 (nav condenses, hero stacks, stat strip 2×2, expertise 2-col), 390 (single column).

COMPONENT TARGET: src/app/page.tsx (native-shell branch) → src/widgets/Hero.tsx + src/widgets/home/{AdvisorSection,LogoMarquee,ServiceBlockSection,TestimonialsCarousel}.tsx + Header.tsx + Footer.tsx

COLORS: --primary — eyebrow, CTAs, links, stat figures, active nav, focus ring | --primary-foreground — text/icons ON primary fills (dark) | --accent — at most one highlight | --background — canvas | --surface — stat band + cards | --elevated — menus | --foreground — primary text | --muted-foreground — captions, inactive nav, logos | --border / --border-subtle — rules

TOKENS: SPACING py-20→28 | 1170px container, px-6 | RADIUS.lg cards | RADIUS.xl sections | RADIUS.md buttons | --glow-soft headshot | focus 2px solid --ring, 2px offset | 72px header | tabular-nums stat figures

VARIANT: EXPLORATION — two hero compositions (A headshot-right + stat strip below; B centered headline + stat band). Keep dark register + single-accent. Defines canonical shell chrome — lock it.

STYLE: High-fidelity desktop web at Figma quality. Quiet enterprise authority. Strong Outfit weight/case contrast, hairline borders, generous whitespace, subtle --primary glow on focus/active only. Evidence as large --primary stat callouts. Monochrome client + flagship logos.

NEGATIVE: No mobile device frames. No hamburger menus. No inconsistent Dame Luthas wordmark. No white/ivory full-bleed backgrounds. No lavender/periwinkle, mint, or yellow. No glassmorphism or neon glow. No Inter/Roboto/SF Pro — Outfit + Cardo only. No emoji as icons. No clip art or stock blobs. No wireframes — final-fidelity only. No hardcoded hex values. No SMB/freelancer framing. No invented metrics.

BACKGROUND: 1440×900 web mockup floating on a deep-navy --background surface. SHADOWS.xl under canvas. Subtle --primary ambient glow upper-left. No browser chrome.
```

---

# ═══════════════════════════════════════════════════
# B DISCOVERY — CASE STUDIES INDEX (LUTHAS-002)
# ═══════════════════════════════════════════════════

## PROMPT LUTHAS-02-A — Case Studies index (full real inventory)
**Slice:** LUTHAS-002 | **Agent:** 08 | **Tier:** 2 | **Priority:** P1
**Personas:** P01 Hiring Executive, P02 Technical Recruiter, P03 Enterprise Engineering Leader
**Component Target:** `src/app/case-studies/page.tsx` → `src/widgets/CaseStudiesPage.tsx` (+ PortfolioGrid, PortfolioFilterMenu)

### PASTE-READY PROMPT

```
AGENT ROLE: You are Agent 08 — Discovery & Navigation Designer (Tier 2). You make a large body of consulting + AI-platform + hospitality work scannable and filterable, outcomes-first. Output is conversion-ready for Next.js App Router + Tailwind v4 inside src/ (FSD).

BRAND: Dame Luthas — Cloud Architect & AI Transformation Leader (15 years); 17 programs · 89 projects · 80+ repos. Uses Luthas Enterprise tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, enterprise engineering leaders, Microsoft-stack / Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4, FSD widgets.
VIBE: Senior, enterprise-grade, quiet authority. Outcomes first; breadth visible.
FONTS: Display: Outfit 800 UPPERCASE | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif. tabular-nums on metrics.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). Cards = surface + 1px border. One decisive accent. Real case data only.

SUBJECT: The Case Studies index — a filterable 3-column grid of Dame's real engagements spanning consulting, AI platforms, applied AI, and hospitality-tech, each card outcomes-first.

SCENE: A hiring panel scans for domain fit and hard results across a deep portfolio, filters by category, and opens the most relevant case. "All" is active; cyan "Flagship" tags mark platform-scale work; category filters group the breadth.

TARGET PERSONAS: P01 Hiring Executive (relevance), P02 Technical Recruiter (breadth), P03 Enterprise Engineering Leader (platform analog).

LAYOUT SPEC:
- SHELL CHROME INHERITED from LUTHAS-01-A — sticky 72px top header + canonical navy footer. Do not redesign.
- LUTHAS_NAV (show ALL, highlight active): Home | Case Studies | About | Contact. Active = Case Studies (--primary underline 2px + --foreground).
- PAGE INTRO: breadcrumb "Home / Case Studies" --muted-foreground (--primary active); H1 "Case Studies" Outfit 700 clamp(28px,3vw,40px) --foreground; intro line "Consulting & enterprise transformation, multi-agent AI platforms, applied-AI products, and hospitality-tech — 17 programs across 80+ repos."
- FILTER ROW 48px: "All ▾" dropdown as --elevated menu (1px --border, RADIUS.md); pills (rounded-full): Consulting & Transformation | AI Platforms | Applied AI | Cloud & M365 | Hospitality-Tech | Web at Volume. ACTIVE pill = --primary-soft fill + --primary border + --foreground; inactive = 1px --border + --muted-foreground.
- CARD GRID 3-col, --surface cards (1px --border, RADIUS.lg): 16:9 thumbnail; metadata "context · scope · year" --muted-foreground; title Outfit 600 --foreground; ONE headline metric Outfit 800 --primary tabular-nums; cyan "Flagship" tag (--accent) on platform-scale work; "Read case study →" --primary; hover lift + --primary border. REAL cards (≈12):
  1. Amazon Labor Union — Digital Transformation (Consulting)
  2. Gatorade — Generative-AI Bottle Design (Applied AI)
  3. United Nations — Advisory & Digital Programs (Consulting)
  4. Microsoft 365 — Enterprise Architecture & Migration (Cloud & M365)
  5. MALFIG / CORTEX — Multi-Agent AI Platform · 580 agents · 13 repos (Flagship)
  6. MAXIMUS AI — 580-Agent Deployment Platform · 34 clusters (Flagship)
  7. ONE4THREE — 30× Generative-AI Image Pipeline · 20–30× (Applied AI)
  8. Project Polaris — Career-Intelligence Auto-Apply Engine (Applied AI)
  9. ATL Table Booking / Caro — Reservations Marketplace, web + mobile (Hospitality-Tech)
  10. ATL Tequila Week — Festival Digital Platform · 8 repos (Hospitality-Tech)
  11. Jay Anthony / Revel — Nightlife & Booking Platforms (Hospitality-Tech)
  12. WordPress → React Migrations — Damieus, Luthas, Haywood (Web at Volume)

RESPONSIVE CONTEXT: Desktop-first 1440×900. Header always visible. Degrade: 768 (2-col), 390 (1-col; filter row scrolls).

COMPONENT TARGET: src/app/case-studies/page.tsx → src/widgets/CaseStudiesPage.tsx (+ PortfolioGrid.tsx, PortfolioFilterMenu.tsx)

COLORS: --primary — active nav + headline metrics + links | --primary-foreground — text on primary fills | --accent — "Flagship" tag ONLY | --background — canvas | --surface — cards | --elevated — dropdown | --foreground — titles | --muted-foreground — metadata, inactive | --border — card + pill rules. Active-pill text on --primary-soft = --foreground.

TOKENS: SPACING py-20 | grid gap 1.5–2rem | RADIUS.lg cards | RADIUS.md dropdown/buttons | RADIUS.full pills | --elevated dropdown | focus 2px solid --ring | 48px filter row

VARIANT: REFINEMENT — inherit shell chrome from LUTHAS-01-A exactly. Lock card anatomy; explore the filter-row treatment (pills vs. segmented control). Emphasize grid rhythm + metric legibility across the breadth.

STYLE: High-fidelity desktop web at Figma quality. Even card rhythm, clear metadata hierarchy, outcomes in --primary blue, "Flagship" cyan tag sparingly. Hairline borders, hover lift only.

NEGATIVE: No mobile device frames. No hamburger menus. No inconsistent Dame Luthas wordmark. No white backgrounds. No lavender, mint, or yellow. No glassmorphism or neon. No Inter/Roboto/SF Pro — Outfit + Cardo only. No emoji as icons. No wireframes — final-fidelity only. No hardcoded hex values. No SMB/freelancer framing. No invented metrics.

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
AGENT ROLE: You are Agent 07 — Personal-Brand & Credibility Designer (Tier 1). You translate a 15-year, multi-role senior career into concrete, verifiable expertise without filler. Output is conversion-ready for Next.js App Router + Tailwind v4 inside src/ (FSD).

BRAND: Dame Luthas — Cloud Architect & AI Transformation Leader (15 years); Senior Microsoft 365 Consultant Architect; Technical Program Manager; Director of IT Enablement. Uses Luthas Enterprise tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, enterprise engineering leaders, Microsoft-stack / Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4, FSD widgets.
VIBE: Senior, enterprise-grade, quiet authority. Concrete over vague; magnitude evident.
FONTS: Display: Outfit 800 UPPERCASE | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). Cards = surface + 1px border. One decisive accent. Real credentials only.

SUBJECT: The About page — a senior bio conveying magnitude, concrete expertise chips, a credential/role block, and one career-defining Cardo pull-quote.

SCENE: A stakeholder vetting fit reads for specifics: domains, stack, scale, institutions. The page states the real positioning — 15 years across cloud architecture, Microsoft 365, and multi-agent AI; builder of MALFIG/CORTEX + MAXIMUS AI (580 agents); advisor to global institutions; 17 programs / 89 projects / 80+ repos — across roles from Cloud Architect to Director of IT Enablement.

TARGET PERSONAS: P01 Hiring Executive (depth), P03 Enterprise Engineering Leader (platform pedigree), P02 Technical Recruiter (specifics).

LAYOUT SPEC:
- SHELL CHROME INHERITED from LUTHAS-01-A — sticky 72px top header + canonical navy footer. Do not redesign.
- LUTHAS_NAV (show ALL, highlight active): Home | Case Studies | About | Contact. Active = About (--primary underline 2px + --foreground).
- BODY (asymmetric 2-col [1fr / 1.3fr], 1170px): LEFT — headshot RADIUS.lg; below, a --surface card (1px --border) credential block — "Atlanta, GA / Brooklyn, NY", "15 years", roles "Cloud/Systems Architect · Senior Microsoft 365 Consultant Architect · AI Transformation Leader · Technical Program Manager · Director of IT Enablement" (Outfit 500 --muted-foreground). RIGHT — H1 "About Dame Luthas" Outfit 700 clamp(28px,3vw,40px) --foreground; senior bio Outfit 400 18px --foreground (concrete, magnitude); bordered expertise chips (rounded-full, 1px --border, --muted-foreground → --primary hover): "Cloud Architecture", "Microsoft 365", "Multi-Agent AI Platforms", "Applied AI", "Cybersecurity, Risk & Compliance", "Program & Change Management", "WordPress → React Migration"; then a Cardo serif pull-quote clamp(22px,2.4vw,30px) --foreground, 2px --primary left rule.
- SCALE BAND: 4 inline figures Outfit 800 --primary tabular-nums — "17 programs", "89 projects", "80+ repos", "580 AI agents".
- TECH/CLIENT BAND: monochrome wordmarks under "Builds with / Advises": Anthropic API, Supabase, Next.js, Microsoft 365, Google Cloud, Vercel + UN/WHO (--muted-foreground).
- CTA BAND: --surface band (1px --border top/bottom), headline + primary "Let's talk" button.

RESPONSIVE CONTEXT: Desktop-first 1440×900. Header always visible. Degrade: 768 (stack, card above bio), 390 (single column; chips wrap).

COMPONENT TARGET: src/app/[slug]/page.tsx (about slug) → src/widgets/AboutPage.tsx

COLORS: --primary — active nav, chip hover, quote rule, scale figures, CTA | --primary-foreground — text on primary fill | --accent — optional, once | --background — canvas | --surface — credential card + bands | --foreground — headings, bio | --muted-foreground — captions, chips, wordmarks | --border — card + chip rules

TOKENS: SPACING py-20 | RADIUS.lg credential card + headshot | RADIUS.full chips | RADIUS.md CTA button | Cardo pull-quote + 2px --primary rule | tabular-nums scale figures | focus 2px solid --ring

VARIANT: REFINEMENT — inherit shell chrome from LUTHAS-01-A exactly. Keep asymmetric grid; explore credential block as card vs. inline list. One Cardo serif accent (the quote).

STYLE: High-fidelity desktop web at Figma quality. Editorial executive warmth; one Cardo accent. Concrete, magnitude-forward copy; no filler. Hairline borders.

NEGATIVE: No mobile device frames. No hamburger menus. No inconsistent Dame Luthas wordmark. No white backgrounds. No lavender, mint, or yellow. No glassmorphism or neon. No Inter/Roboto/SF Pro — Outfit + Cardo only. No emoji as icons. No vague buzzwords. No wireframes — final-fidelity only. No hardcoded hex values. No invented metrics.

BACKGROUND: 1440×900 web mockup floating on a deep-navy --background surface. SHADOWS.xl under canvas. Subtle --primary ambient glow upper-left. No browser chrome.
```

---

# ═══════════════════════════════════════════════════
# C DETAIL — CONSULTING: AMAZON LABOR UNION (LUTHAS-004)
# ═══════════════════════════════════════════════════

## PROMPT LUTHAS-04-A — Detail: Amazon Labor Union — Digital Transformation
**Slice:** LUTHAS-004 | **Agent:** 11 | **Tier:** 3 | **Priority:** P1
**Personas:** P01 Hiring Executive, P04 Transformation Lead, P02 Technical Recruiter
**Component Target:** `src/app/portfolio/[slug]/page.tsx` (slug: amazon-labor-union-digital-transformation) → `src/widgets/portfolio/PortfolioDetail.tsx`

### PASTE-READY PROMPT

```
AGENT ROLE: You are Agent 11 — Case-Study Narrative Designer (Tier 3). Structure the engagement Challenge → Approach → Solution → Results, outcomes as stat callouts, captioned evidence. Output conversion-ready for Next.js App Router + Tailwind v4 inside src/ (FSD).

BRAND: Dame Luthas — Cloud Architect & AI Transformation Leader (15 years). Uses Luthas Enterprise tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, enterprise engineering leaders, Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4, FSD widgets.
VIBE: Senior, enterprise-grade, quiet authority. Story + proof.
FONTS: Display: Outfit 800 UPPERCASE | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif. tabular-nums on stats.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). Reading-optimized measure. One decisive accent. Real engagement data; captioned visuals.

SUBJECT: The Amazon Labor Union "Digital Transformation" consulting case-study detail — metadata header, Challenge → Approach → Solution → Results spine, stat callouts, captioned gallery, client pull-quote, prev/next nav.

SCENE: A reader from the index wants the story and the proof of a real client engagement: the organizing/digital challenge, the transformation approach, and measurable outcomes — captioned visuals as evidence; one --accent cyan headline result.

TARGET PERSONAS: P01 Hiring Executive (outcomes), P04 Transformation Lead (method), P02 Technical Recruiter (depth).

LAYOUT SPEC:
- SHELL CHROME INHERITED from LUTHAS-01-A — sticky 72px top header + canonical navy footer. Do not redesign.
- LUTHAS_NAV (show ALL, highlight active): Home | Case Studies | About | Contact. Active = Case Studies.
- DETAIL HERO: breadcrumb "Home / Case Studies / Amazon Labor Union"; metadata "Client: Amazon Labor Union · Scope: Digital Transformation · Role: Tech Lead / Advisor · Year"; H1 "Amazon Labor Union — Digital Transformation" Outfit 800 UPPERCASE clamp(36px,4.6vw,64px) --foreground; one-line summary.
- NARRATIVE SPINE (centered max-w-prose): Challenge → Approach → Solution → Results (Outfit 600 heading + Outfit 400 body).
- STAT CALLOUTS: large --primary Outfit 800 tabular-nums figures from the real engagement; one --accent cyan headline result.
- GALLERY: 2–3 col grid (1px --border frames, RADIUS.lg), EACH captioned --muted-foreground with its strategic role.
- CLIENT PULL-QUOTE: Cardo serif clamp(22px,2.4vw,30px) --foreground, 2px --primary left rule, attributed (use real testimonials — Maria Sanchez / Jamal Washington per case-study registry).
- PREV / NEXT nav: bordered (1px --border), --muted-foreground → --primary hover.

RESPONSIVE CONTEXT: Desktop-first 1440×900. Header always visible. Degrade: 768 (gallery 2-col), 390 (1-col; spine full-width).

COMPONENT TARGET: src/app/portfolio/[slug]/page.tsx → src/widgets/portfolio/PortfolioDetail.tsx (+ GalleryGrid.tsx, PortfolioInfo.tsx, PortfolioNav.tsx)

COLORS: --primary — stats, links, active nav, quote rule | --primary-foreground — text on primary fill | --accent — single headline result ONLY | --background — canvas | --surface — cards | --foreground — headings, body | --muted-foreground — metadata, captions | --border — gallery frames + nav

TOKENS: SPACING py-16→20 | RADIUS.lg gallery + cards | RADIUS.md buttons | stat figures Outfit 800 tabular-nums | focus 2px solid --ring

VARIANT: REFINEMENT — inherit shell chrome from LUTHAS-01-A. Lock the spine; explore stat-callout placement. Captioned evidence gallery.

STYLE: High-fidelity desktop web at Figma quality. Reading-optimized spine, captioned gallery, outcomes in --primary, one --accent highlight. Hairline borders.

NEGATIVE: No mobile device frames. No hamburger menus. No inconsistent Dame Luthas wordmark. No white backgrounds. No lavender, mint, or yellow. No glassmorphism or neon. No Inter/Roboto/SF Pro — Outfit + Cardo only. No emoji as icons. No uncaptioned image dumps. No wireframes. No hardcoded hex values. No invented metrics.

BACKGROUND: 1440×900 web mockup on deep-navy --background surface. SHADOWS.xl under canvas. Subtle --primary glow upper-left. No browser chrome.
```

---

# ═══════════════════════════════════════════════════
# C DETAIL — CONSULTING / APPLIED AI: GATORADE GEN-AI BOTTLES (LUTHAS-005)
# ═══════════════════════════════════════════════════

## PROMPT LUTHAS-05-A — Detail: Gatorade — Generative-AI Bottle Design
**Slice:** LUTHAS-005 | **Agent:** 11 | **Tier:** 3 | **Priority:** P1
**Personas:** P01 Hiring Executive, P04 Transformation Lead, P02 Technical Recruiter
**Component Target:** `src/app/portfolio/[slug]/page.tsx` (slug: gatorade-embraces-generative-ai-powered-bottle-design) → `PortfolioDetail.tsx`

### PASTE-READY PROMPT

```
AGENT ROLE: You are Agent 11 — Case-Study Narrative Designer (Tier 3). Structure the engagement Challenge → Approach → Solution → Results; the AI-generated bottle artwork is the only saturated color, framed by restrained navy/blue chrome. Output conversion-ready for Next.js App Router + Tailwind v4 inside src/ (FSD).

BRAND: Dame Luthas — Cloud Architect & AI Transformation Leader (15 years). Uses Luthas Enterprise tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, enterprise engineering leaders, Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4, FSD widgets.
VIBE: Senior, enterprise-grade, quiet authority. Applied-AI proof.
FONTS: Display: Outfit 800 UPPERCASE | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif. tabular-nums on stats.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). Restrained chrome so the AI artwork pops. One decisive accent. Real metrics; captioned visuals.

SUBJECT: The Gatorade "Generative-AI-Powered Bottle Design" case-study detail — metadata header, Challenge → Approach → Solution → Results spine, stat callouts, and a gallery of AI-generated bottle designs (each captioned).

SCENE: A reader evaluating applied-AI depth wants the brand problem (on-brand individualized bottle artwork at scale), the generative-AI approach, the solution, and the result. The vivid lightning-bolt bottle artwork is the only saturated color; one --accent cyan headline metric.

TARGET PERSONAS: P01 Hiring Executive (applied-AI outcome), P04 Transformation Lead (AI method), P02 Technical Recruiter (depth).

LAYOUT SPEC:
- SHELL CHROME INHERITED from LUTHAS-01-A — sticky 72px top header + canonical navy footer. Do not redesign.
- LUTHAS_NAV (show ALL, highlight active): Home | Case Studies | About | Contact. Active = Case Studies.
- DETAIL HERO: breadcrumb "Home / Case Studies / Gatorade"; metadata "Client: Gatorade · Scope: Generative-AI Product Design · Role: AI Strategist · Year"; H1 "Gatorade Embraces Generative-AI-Powered Bottle Design" Outfit 800 UPPERCASE clamp(36px,4.6vw,64px) --foreground; one-line summary.
- NARRATIVE SPINE (centered max-w-prose): Challenge → Approach (generative-AI design pipeline + brand guardrails) → Solution → Results (Outfit 600 + Outfit 400).
- STAT CALLOUTS: --primary Outfit 800 tabular-nums for design throughput / engagement; one --accent cyan headline.
- GALLERY: grid of vivid AI-generated bottle designs (lightning-bolt: sport, abstract, character) 3:4 frames (1px --border, RADIUS.lg), EACH captioned --muted-foreground — artwork the ONLY saturated color.
- CLIENT PULL-QUOTE: Cardo serif clamp(22px,2.4vw,30px) --foreground, 2px --primary left rule, attributed.
- PREV / NEXT nav: bordered, --muted-foreground → --primary hover.

RESPONSIVE CONTEXT: Desktop-first 1440×900. Header always visible. Degrade: 768 (gallery 2-col), 390 (1-col; 3:4 aspect kept).

COMPONENT TARGET: src/app/portfolio/[slug]/page.tsx → src/widgets/portfolio/PortfolioDetail.tsx (+ GalleryGrid.tsx, PortfolioInfo.tsx, PortfolioNav.tsx)

COLORS: --primary — stats, links, active nav, quote rule | --primary-foreground — text on primary fill | --accent — single headline ONLY (keep chrome restrained so artwork pops) | --background — canvas | --surface — cards | --foreground — headings, body | --muted-foreground — metadata, captions | --border — gallery frames + nav

TOKENS: SPACING py-16→20 | RADIUS.lg gallery (3:4 frames) | RADIUS.md buttons | stat figures Outfit 800 tabular-nums | focus 2px solid --ring

VARIANT: REFINEMENT — inherit shell chrome from LUTHAS-01-A. Keep the LUTHAS-04-A spine; explore masonry vs. uniform gallery. Restrained chrome so artwork is the focus.

STYLE: High-fidelity desktop web at Figma quality. Restrained navy/blue chrome so the AI artwork is the focus. Outcomes in --primary, one --accent. Captions on every image.

NEGATIVE: No mobile device frames. No hamburger menus. No inconsistent Dame Luthas wordmark. No white backgrounds. No lavender, mint, or yellow chrome. No glassmorphism or neon UI. No Inter/Roboto/SF Pro — Outfit + Cardo only. No emoji as icons. No uncaptioned image dumps. No wireframes. No hardcoded hex values. No invented metrics.

BACKGROUND: 1440×900 web mockup on deep-navy --background surface. SHADOWS.xl under canvas. Subtle --primary glow upper-left. No browser chrome.
```

---

# ═══════════════════════════════════════════════════
# C DETAIL — BUILD: MALFIG / CORTEX MULTI-AGENT PLATFORM (LUTHAS-006)  [additional]
# ═══════════════════════════════════════════════════

## PROMPT LUTHAS-06-A — Detail: MALFIG / CORTEX Multi-Agent Platform
**Slice:** LUTHAS-006 | **Agent:** 11 | **Tier:** 3 | **Priority:** P1
**Personas:** P01 Hiring Executive, P03 Enterprise Engineering Leader, P02 Technical Recruiter
**Component Target:** `src/app/portfolio/[slug]/page.tsx` (slug: malfig-cortex-multi-agent-platform) → `PortfolioDetail.tsx`

### PASTE-READY PROMPT

```
AGENT ROLE: You are Agent 11 — Case-Study Narrative Designer (Tier 3). Structure Challenge → Approach → Solution → Results, outcomes as stat callouts, captioned architecture diagrams. Output conversion-ready for Next.js App Router + Tailwind v4 inside src/ (FSD).

BRAND: Dame Luthas — Cloud Architect & AI Transformation Leader (15 years). Uses Luthas Enterprise tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, enterprise engineering leaders, Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4, FSD widgets.
VIBE: Senior, enterprise-grade, quiet authority. Systems story + proof.
FONTS: Display: Outfit 800 UPPERCASE | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif. tabular-nums on stats.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). Reading-optimized measure. One decisive accent. Real architecture + metrics; captioned diagrams.

SUBJECT: The MALFIG / CORTEX Multi-Agent Platform case-study detail (13 repos: maximus-ai, ugwtf, handoff-framework, audit-orchestrator, audit-fix-ship, agent-mastery, stitch-mockup-toolkit, documentation-standards, +more) — metadata header, Challenge → Approach → Solution → Results spine, stat callouts, captioned architecture gallery, engineering pull-quote, prev/next nav.

SCENE: A reader wants the platform story: coordinating AI coding agents across 80+ repos without drift or governance gaps; the answer — CORTEX shared memory (Supabase) + Forge model/agent routing + blast-radius analysis + file-lock manager + cold-review/merge gates (Maximus Prime) — culminating in MAXIMUS AI, a 580-agent deployment platform across 34 clusters. Stack: Anthropic API, MCP, Express, Next.js, PostgreSQL/Supabase. One --accent cyan headline ("580 agents").

TARGET PERSONAS: P01 Hiring Executive (platform scale), P03 Enterprise Engineering Leader (architecture rigor), P02 Technical Recruiter (depth).

LAYOUT SPEC:
- SHELL CHROME INHERITED from LUTHAS-01-A — sticky 72px top header + canonical navy footer. Do not redesign.
- LUTHAS_NAV (show ALL, highlight active): Home | Case Studies | About | Contact. Active = Case Studies.
- DETAIL HERO: breadcrumb "Home / Case Studies / MALFIG · CORTEX"; metadata "Context: Damieus platform · Scope: Multi-agent orchestration & governance · Role: Cloud Architect / Platform Lead · 2026"; H1 "MALFIG / CORTEX — Multi-Agent AI Platform" Outfit 800 UPPERCASE clamp(36px,4.6vw,64px) --foreground; one-line summary.
- NARRATIVE SPINE (centered max-w-prose): Challenge (orchestrate AI coding agents across 80+ repos without drift, conflicts, RLS/governance gaps) → Approach (CORTEX shared memory in Supabase, Forge routing, blast-radius analysis, file-lock manager, cold-review + merge gates) → Solution (MAXIMUS AI — 580-agent deployment platform, agent registry, IntentEnvelope intake; 13 platform repos) → Results.
- STAT CALLOUTS: --primary Outfit 800 tabular-nums — "580 agents", "34 clusters", "13 platform repos", "89 projects orchestrated"; --accent cyan ONCE on "580 agents".
- GALLERY: 3-col (1px --border, RADIUS.lg) architecture diagrams, EACH captioned --muted-foreground — "CORTEX schema (sessions · tasks · knowledge)", "Agent registry & cluster/swarm map", "Forge routing + blast-radius", "Maximus Prime merge-gate L-stack".
- ENGINEERING PULL-QUOTE: Cardo serif, 2px --primary left rule, attributed.
- PREV / NEXT nav: bordered, --muted-foreground → --primary hover.

RESPONSIVE CONTEXT: Desktop-first 1440×900. Header always visible. Degrade: 768 (gallery 2-col), 390 (1-col).

COMPONENT TARGET: src/app/portfolio/[slug]/page.tsx → src/widgets/portfolio/PortfolioDetail.tsx (+ GalleryGrid.tsx, PortfolioInfo.tsx, PortfolioNav.tsx)

COLORS: --primary — stats, links, active nav, quote rule | --primary-foreground — text on primary fill | --accent — "580 agents" headline ONLY | --background — canvas | --surface — cards | --foreground — headings, body | --muted-foreground — metadata, captions | --border — gallery frames + nav

TOKENS: SPACING py-16→20 | RADIUS.lg gallery + cards | RADIUS.md buttons | stat figures Outfit 800 tabular-nums | focus 2px solid --ring

VARIANT: REFINEMENT — inherit shell chrome from LUTHAS-01-A. Lock the spine; explore stat-callout placement. Architecture-forward captioned gallery (diagrams, not photos).

STYLE: High-fidelity desktop web at Figma quality. Reading-optimized spine, architecture-forward captioned gallery, outcomes in --primary, one --accent. Hairline borders.

NEGATIVE: No mobile device frames. No hamburger menus. No inconsistent Dame Luthas wordmark. No white backgrounds. No lavender, mint, or yellow. No glassmorphism or neon. No Inter/Roboto/SF Pro — Outfit + Cardo only. No emoji as icons. No uncaptioned image dumps. No wireframes. No hardcoded hex values. No invented metrics.

BACKGROUND: 1440×900 web mockup on deep-navy --background surface. SHADOWS.xl under canvas. Subtle --primary glow upper-left. No browser chrome.
```

---

# ═══════════════════════════════════════════════════
# C DETAIL — BUILD: ONE4THREE 30× IMAGE PIPELINE (LUTHAS-007)  [additional]
# ═══════════════════════════════════════════════════

## PROMPT LUTHAS-07-A — Detail: ONE4THREE 30× Generative-AI Image Pipeline
**Slice:** LUTHAS-007 | **Agent:** 11 | **Tier:** 3 | **Priority:** P1
**Personas:** P01 Hiring Executive, P03 Enterprise Engineering Leader, P02 Technical Recruiter
**Component Target:** `src/app/portfolio/[slug]/page.tsx` (slug: one4three-30x-image-pipeline) → `PortfolioDetail.tsx`

### PASTE-READY PROMPT

```
AGENT ROLE: You are Agent 11 — Case-Study Narrative Designer (Tier 3). Structure Challenge → Approach → Solution → Results; AI-generated product imagery is the only saturated color. Output conversion-ready for Next.js App Router + Tailwind v4 inside src/ (FSD).

BRAND: Dame Luthas — Cloud Architect & AI Transformation Leader (15 years). Uses Luthas Enterprise tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, enterprise engineering leaders, Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4, FSD widgets.
VIBE: Senior, enterprise-grade, quiet authority. Applied-AI proof.
FONTS: Display: Outfit 800 UPPERCASE | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif. tabular-nums on stats.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). Restrained chrome so AI imagery pops. One decisive accent. Real metrics; captioned visuals.

SUBJECT: The ONE4THREE 30× Generative-AI Image Pipeline case-study detail (repos: one4three-co-next-app, image-gen-30x-cli; stack: Google Cloud, Gemini, Next.js, Supabase, Stripe, Vercel) — metadata header, Challenge → Approach → Solution → Results spine, throughput stat callouts, captioned gallery of AI-generated product designs. (This pipeline produced the AI bottle/label artwork.)

SCENE: A reader evaluating applied-AI depth wants the problem (on-brand individualized product imagery at scale), the gen-AI pipeline approach (image-gen-30x-cli on Gemini / Google Cloud, batch + brand guardrails), the solution, and the result ("20–30× faster" generation). Throughput in --primary stats, one --accent cyan headline ("20–30×"); vivid AI artwork the only saturated color.

TARGET PERSONAS: P01 Hiring Executive (applied-AI outcome), P03 Enterprise Engineering Leader (pipeline rigor), P02 Technical Recruiter (depth).

LAYOUT SPEC:
- SHELL CHROME INHERITED from LUTHAS-01-A — sticky 72px top header + canonical navy footer. Do not redesign.
- LUTHAS_NAV (show ALL, highlight active): Home | Case Studies | About | Contact. Active = Case Studies.
- DETAIL HERO: breadcrumb "Home / Case Studies / ONE4THREE 30× Pipeline"; metadata "Context: ONE4THREE · Scope: Generative-AI image pipeline (image-gen-30x-cli) · Role: AI Strategist / Pipeline Architect · 2026"; H1 "ONE4THREE — 30× Generative-AI Image Pipeline" Outfit 800 UPPERCASE clamp(36px,4.6vw,64px) --foreground; one-line summary.
- NARRATIVE SPINE (centered max-w-prose): Challenge → Approach (30× pipeline: image-gen-30x-cli, Gemini / Google Cloud, batch + brand guardrails) → Solution → Results (Outfit 600 + Outfit 400).
- STAT CALLOUTS: --primary Outfit 800 tabular-nums — "20–30× faster generation" + throughput/volume; --accent cyan ONCE on "20–30×".
- GALLERY: grid of AI-generated product designs (vivid lightning-bolt bottle/label artwork) 3:4 frames (1px --border, RADIUS.lg), EACH captioned --muted-foreground — artwork the ONLY saturated color. (Reuse the existing AI bottle imagery; pipeline produced it.)
- CLIENT PULL-QUOTE: Cardo serif, 2px --primary left rule, attributed.
- PREV / NEXT nav: bordered, --muted-foreground → --primary hover.

RESPONSIVE CONTEXT: Desktop-first 1440×900. Header always visible. Degrade: 768 (gallery 2-col), 390 (1-col; 3:4 kept).

COMPONENT TARGET: src/app/portfolio/[slug]/page.tsx → src/widgets/portfolio/PortfolioDetail.tsx (+ GalleryGrid.tsx, PortfolioInfo.tsx, PortfolioNav.tsx)

COLORS: --primary — stats, links, active nav, quote rule | --primary-foreground — text on primary fill | --accent — "20–30×" headline ONLY (keep chrome restrained so artwork pops) | --background — canvas | --surface — cards | --foreground — headings, body | --muted-foreground — metadata, captions | --border — gallery frames + nav

TOKENS: SPACING py-16→20 | RADIUS.lg gallery (3:4 frames) | RADIUS.md buttons | stat figures Outfit 800 tabular-nums | focus 2px solid --ring

VARIANT: REFINEMENT — inherit shell chrome from LUTHAS-01-A. Keep the LUTHAS-04-A spine; explore masonry vs. uniform gallery. Restrained chrome so artwork is the focus.

STYLE: High-fidelity desktop web at Figma quality. Restrained navy/blue chrome so AI imagery is the focus. Outcomes in --primary, one --accent. Captions on every image.

NEGATIVE: No mobile device frames. No hamburger menus. No inconsistent Dame Luthas wordmark. No white backgrounds. No lavender, mint, or yellow chrome. No glassmorphism or neon UI. No Inter/Roboto/SF Pro — Outfit + Cardo only. No emoji as icons. No uncaptioned image dumps. No wireframes. No hardcoded hex values. No invented metrics.

BACKGROUND: 1440×900 web mockup on deep-navy --background surface. SHADOWS.xl under canvas. Subtle --primary glow upper-left. No browser chrome.
```

---

# ═══════════════════════════════════════════════════
# C DETAIL — BUILD: ATL TABLE BOOKING / CARO MARKETPLACE (LUTHAS-008)  [additional]
# ═══════════════════════════════════════════════════

## PROMPT LUTHAS-08-A — Detail: ATL Table Booking / Caro — Reservations Marketplace
**Slice:** LUTHAS-008 | **Agent:** 11 | **Tier:** 3 | **Priority:** P2
**Personas:** P01 Hiring Executive, P03 Enterprise Engineering Leader, P02 Technical Recruiter
**Component Target:** `src/app/portfolio/[slug]/page.tsx` (slug: atl-table-booking-caro) → `PortfolioDetail.tsx`

### PASTE-READY PROMPT

```
AGENT ROLE: You are Agent 11 — Case-Study Narrative Designer (Tier 3). Structure Challenge → Approach → Solution → Results, outcomes as stat callouts, captioned product screens. Output conversion-ready for Next.js App Router + Tailwind v4 inside src/ (FSD).

BRAND: Dame Luthas — Cloud Architect & AI Transformation Leader (15 years). Uses Luthas Enterprise tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, enterprise engineering leaders, Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4, FSD widgets.
VIBE: Senior, enterprise-grade, quiet authority. Product + platform story.
FONTS: Display: Outfit 800 UPPERCASE | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif. tabular-nums on stats.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). Reading-optimized measure. One decisive accent. Real product data; captioned screens. (The product UI is Caro's own dark "Midnight" theme — show it inside the case study; the page chrome stays Luthas Enterprise navy.)

SUBJECT: The ATL Table Booking / Caro case-study detail (repo: atl-table-booking-app; Expo / React Native + web, Supabase, Vercel) — a reservations marketplace spanning web + mobile + a Caro CRM admin — metadata header, Challenge → Approach → Solution → Results spine, stat callouts, captioned product-screen gallery, pull-quote, prev/next nav.

SCENE: A reader wants the product + platform story: a multi-surface reservations marketplace (consumer mobile app, web, and a Caro CRM admin for venues), built with Expo/React Native + Supabase on an FSD architecture. Real delivery metric: 401/505 platform tasks completed. One --accent cyan headline.

TARGET PERSONAS: P01 Hiring Executive (product scope), P03 Enterprise Engineering Leader (multi-surface architecture), P02 Technical Recruiter (depth).

LAYOUT SPEC:
- SHELL CHROME INHERITED from LUTHAS-01-A — sticky 72px top header + canonical navy footer. Do not redesign.
- LUTHAS_NAV (show ALL, highlight active): Home | Case Studies | About | Contact. Active = Case Studies.
- DETAIL HERO: breadcrumb "Home / Case Studies / ATL Table Booking · Caro"; metadata "Context: ATL Table Booking (Caro) · Scope: Reservations marketplace, web + mobile + CRM · Role: Architect / Lead · 2026"; H1 "ATL Table Booking / Caro — Reservations Marketplace" Outfit 800 UPPERCASE clamp(36px,4.6vw,64px) --foreground; one-line summary.
- NARRATIVE SPINE (centered max-w-prose): Challenge (multi-surface reservations + venue CRM at marketplace scale) → Approach (Expo/React Native consumer app + Next.js web + Caro CRM admin, Supabase, FSD) → Solution → Results (Outfit 600 + Outfit 400).
- STAT CALLOUTS: --primary Outfit 800 tabular-nums — "401/505 tasks completed", "3 surfaces (mobile · web · CRM)"; --accent cyan ONCE on the headline.
- GALLERY: 3-col (1px --border, RADIUS.lg) captioned product screens — "Consumer mobile booking", "Venue discovery / map", "Caro CRM admin", "Bottle-service / loyalty". Caption --muted-foreground. (Product screens show Caro's own theme; page chrome stays Luthas navy.)
- PULL-QUOTE: Cardo serif, 2px --primary left rule, attributed.
- PREV / NEXT nav: bordered, --muted-foreground → --primary hover.

RESPONSIVE CONTEXT: Desktop-first 1440×900. Header always visible. Degrade: 768 (gallery 2-col), 390 (1-col).

COMPONENT TARGET: src/app/portfolio/[slug]/page.tsx → src/widgets/portfolio/PortfolioDetail.tsx (+ GalleryGrid.tsx, PortfolioInfo.tsx, PortfolioNav.tsx)

COLORS: --primary — stats, links, active nav, quote rule | --primary-foreground — text on primary fill | --accent — single headline ONLY | --background — canvas | --surface — cards | --foreground — headings, body | --muted-foreground — metadata, captions | --border — gallery frames + nav

TOKENS: SPACING py-16→20 | RADIUS.lg gallery + cards | RADIUS.md buttons | stat figures Outfit 800 tabular-nums | focus 2px solid --ring

VARIANT: REFINEMENT — inherit shell chrome from LUTHAS-01-A. Lock the spine; explore device-framed vs. flat product screens in the gallery. Page chrome stays Luthas navy regardless of the Caro product theme shown inside screenshots.

STYLE: High-fidelity desktop web at Figma quality. Reading-optimized spine, captioned product-screen gallery, outcomes in --primary, one --accent. Hairline borders.

NEGATIVE: No mobile device frames AROUND THE PAGE (device frames are allowed only inside gallery product screenshots). No hamburger menus on the page chrome. No inconsistent Dame Luthas wordmark. No white page backgrounds. No lavender, mint, or yellow page chrome. No glassmorphism or neon page UI. No Inter/Roboto/SF Pro — Outfit + Cardo only. No emoji as icons. No uncaptioned image dumps. No wireframes. No hardcoded hex values. No invented metrics.

BACKGROUND: 1440×900 web mockup on deep-navy --background surface. SHADOWS.xl under canvas. Subtle --primary glow upper-left. No browser chrome.
```

---

### Usage
1. Open Google Stitch → new desktop/web design.
2. Paste one PASTE-READY PROMPT (13-block complete). Generate.
3. Iterate: regenerate any section that drifts toward lavender / pills / SMB framing / glassmorphism / a sidebar / invented metrics.
4. Export PNG → `output/stitch/luthas-enterprise/images/`. Compare color/spacing against shipped tokens.
5. COMPONENT TARGET names the FSD destination. Detail slugs 06–08 are additional real case studies — add to the portfolio data (`content.json`).
