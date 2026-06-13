---
tags: [dame-luthas, stitch, prompts, luthas-enterprise, portfolio, desktop]
topic: "Dame Luthas portfolio — Stitch prompts (Luthas Enterprise, desktop web)"
created: "2026-06-11"
sequence: V1
category: "prompts"
repo: dame-luthas-app
inherits_from: ["stitch-mockup-toolkit/docs/01-STRATEGY.md (13-Block Composition)", "atl-table-booking-app/docs/prompts/stitch_mockups_prompts/CARO-CRM-STITCH-PROMPTS-V4.md (format)"]
---

# Dame Luthas — Portfolio Stitch Prompts (Luthas Enterprise)
## Version: 1.0 | Total Prompts: 5 | Agent: 06 (Tier 1 — Brand & Entry Designer)
## Brand: Dame Luthas (Technology Leader & AI Strategist portfolio) | Repo: dame-luthas-app
## Demographic: hiring executives, technical recruiters, UN/NGO program sponsors, Fortune-500 transformation leads.
## Prompt Architecture: 13-Block Composition per `STITCH-PROMPTING-STRATEGY.md`

**Phase 0 workflow:** Run each paste-ready prompt **in Stitch** (Google Stitch UI) → export PNG → commit to `output/stitch/luthas-enterprise/images/`. The Stitch image is the spec for React implementation.

| Step | Tool | What |
|---|---|---|
| 1 | **Stitch** | Paste LUTHAS-01-A…05-A blocks from this file into Stitch; generate each screen |
| 2 | **Antigravity** | Operates Stitch, visual QA, re-run until chrome locks |
| 3 | **Claude Code / Cursor** | Implements/refines the React component referencing the Stitch PNG as spec |

**Stitch may also emit `code.html` — ignore it.** The image is the spec; React implementation is a separate step. Each prompt's **COMPONENT TARGET** tells the implementer what to build **after** the Stitch PNG exists — not a request to hand-write HTML.

---

## Prompts in this file

| Slice | Layer | Stitch ID | Title | Priority | Component target |
|---|---|---|---|---|---|
| LUTHAS-001 | A Brand/Entry | LUTHAS-01-A | Home — hero + proof + expertise | P0 | `src/app/page.tsx` → `src/widgets/Hero.tsx` (+ `widgets/home/*`) |
| LUTHAS-002 | B Discovery | LUTHAS-02-A | Case Studies index — filterable grid | P1 | `src/app/case-studies/page.tsx` → `src/widgets/CaseStudiesPage.tsx` |
| LUTHAS-003 | A Brand/Entry | LUTHAS-03-A | About — bio + credentials + quote | P1 | `src/app/[slug]/page.tsx` → `src/widgets/AboutPage.tsx` |
| LUTHAS-004 | C Detail | LUTHAS-04-A | Portfolio detail — Amazon Labor Union | P1 | `src/app/portfolio/[slug]/page.tsx` → `src/widgets/portfolio/PortfolioDetail.tsx` |
| LUTHAS-005 | C Detail | LUTHAS-05-A | Portfolio detail — Gatorade Gen-AI bottles | P1 | `src/app/portfolio/[slug]/page.tsx` → `src/widgets/portfolio/PortfolioDetail.tsx` |

URL map: `/` → 01-A · `/case-studies` → 02-A · `/about` → 03-A · `/portfolio/amazon-labor-union-digital-transformation` → 04-A · `/portfolio/gatorade-embraces-generative-ai-powered-bottle-design` → 05-A.

---

## Luthas-Specific Design Rules

1. **Brand tokens only** — every color references a key from `src/shared/design/tokens.ts` (mirrored as CSS vars in `src/app/globals.css`). **Never** hardcode hex. Canonical token names: `tokens.colors.primary` (`--primary`, electric blue), `tokens.colors.primary.foreground` (`--primary-foreground`, dark text on primary), `tokens.colors.accent` (`--accent`, cyan), `tokens.colors.background` (`--background`), `tokens.colors.surface` (`--surface`), `tokens.colors.elevated` (`--elevated`), `tokens.colors.foreground` (`--foreground`), `tokens.colors.mutedForeground` (`--muted-foreground`), `tokens.colors.border` (`--border`), plus `--success`/`--warning`/`--error`/`--info`.
2. **Shell chrome inheritance** — every prompt cites *"SHELL CHROME INHERITED from LUTHAS-01-A"*. Stitch must NOT redesign the sticky top header (wordmark + nav + CTA) or the navy footer. (This is a marketing portfolio — a **top header**, NOT a CRM sidebar.)
3. **Full nav registry** — every prompt lists the complete `LUTHAS_NAV` and highlights the active item (`--primary` underline + `--foreground` text). Nav is consistent across renders.
4. **Real Dame Luthas data** — scenes use canonical proof: clients UN, WHO, UNICEF, UN Women, Madison Square Garden, GLG; metrics "70% fewer outages", "50% faster go-live", "15–20 hrs/wk automated"; case studies "Amazon Labor Union — Digital Transformation", "Gatorade — Generative-AI Bottle Design".
5. **Fonts** — Outfit 800 UPPERCASE for hero/section display; Outfit 600/700 for titles; Outfit 400 for body; **Cardo** serif for pull-quotes ONLY. No other typefaces.
6. **Desktop-first 1440×900** — top header always visible; never a hamburger, never a mobile device frame. Responsive degrade noted per prompt (768 / 390).
7. **One decisive accent** — `--primary` electric blue throughout; `--accent` cyan used at most once per view. Never lavender, mint, or yellow.

---

## Shared blocks reference

Each paste-ready block below inlines the inheritance constraints it needs. The canonical **SHELL CHROME** and **LUTHAS_NAV** are defined in **LUTHAS-01-A**; all later prompts inherit them by reference. Brand tokens are cited by name from `src/shared/design/tokens.ts`. Brand SSOT: [`DESIGN.md`](./DESIGN.md). Recommendation + rationale: `docs/design/DESIGN-SYSTEM-RECOMMENDATION.md`.

---

# ═══════════════════════════════════════════════════
# A BRAND / ENTRY — HOME (LUTHAS-001)
# Prompt LUTHAS-01-A  ·  defines canonical SHELL CHROME + LUTHAS_NAV
# ═══════════════════════════════════════════════════

## PROMPT LUTHAS-01-A — Home (hero + proof + expertise)
**Slice:** LUTHAS-001 | **Agent:** 06 | **Tier:** 1 | **Priority:** P0
**Personas:** P01 Hiring Executive, P02 Technical Recruiter, P03 UN/NGO Program Sponsor
**Component Target:** `src/app/page.tsx` → `src/widgets/Hero.tsx` (+ `src/widgets/home/*`, `Header.tsx`, `Footer.tsx`)

### PASTE-READY PROMPT

```
AGENT ROLE: You are Agent 06 — Brand & Entry Designer (Tier 1). You produce executive-portfolio-grade first impressions: quiet enterprise authority (Linear / Vercel / Stripe register) with proof scannable in 5 seconds. Output must be conversion-ready for Next.js App Router + Tailwind v4 inside src/ (Feature-Sliced Design). Preserve FSD boundaries — shell chrome in widgets/Header + widgets/Footer, page content in widgets/.

BRAND: Dame Luthas — professional portfolio of a Technology Leader & AI Strategist. Uses Luthas Enterprise design tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, single dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, UN/NGO program sponsors, Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4 (@theme tokens in globals.css), FSD widgets.
VIBE: Senior, enterprise-grade, AI-forward. Quiet authority — proof is the hero, design is the frame.
FONTS: Display: Outfit 800 UPPERCASE (hero H1, section anchors) | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif (sparing). tabular-nums on stat figures.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). One continuous dark navy canvas. Cards = surface + 1px border (not heavy shadows). Soft-rectangle buttons (RADIUS.md). One decisive accent. Real Dame Luthas proof data in copy.

SUBJECT: The portfolio homepage — hero (no card), a 4-metric stat strip, a credibility line + client logo marquee, an enterprise expertise grid, selected case studies, and a testimonial — establishing senior enterprise positioning with evidence above the fold.

SCENE: A VP of Engineering lands from LinkedIn with ~5 seconds of attention. The hero headline + rotating discipline line + the stat strip immediately convey seniority and domains (cloud / AI / transformation); the UN/WHO/UNICEF marquee and metrics supply proof; a single primary CTA ("Book a discovery call") is the next action.

TARGET PERSONAS: P01 Hiring Executive (assess seniority + fit), P02 Technical Recruiter (scan domains + proof), P03 UN/NGO Program Sponsor (verify institutional pedigree).

LAYOUT SPEC:
- SHELL CHROME (CANONICAL — defined here, inherited by all later prompts): Sticky top header, 72px, transparent navy with a 1px --border-subtle bottom rule. Left: "DAME LUTHAS" wordmark Outfit 700 18px --foreground. Center: LUTHAS_NAV. Right: 3 monochrome social icons (LinkedIn, YouTube, X) + a soft-rectangle primary button "Book a discovery call" (--primary fill, --primary-foreground dark text, RADIUS.md). Footer (CANONICAL): on --background, 1px --border-subtle top rule, wordmark + secondary nav + credential line + social. NO white footer bar.
- LUTHAS_NAV (show ALL items, highlight active): Home | Case Studies | About | Contact. Active item = Home (--primary underline 2px + --foreground text; inactive --muted-foreground).
- HERO (no card), 12-col grid, 1170px max, two columns: LEFT (7 col) — eyebrow "TECHNOLOGY LEADER & AI STRATEGIST" Outfit 600 14px --primary tracking 0.18em; H1 "HI, I'M DAME LUTHAS. LET'S BUILD TOGETHER" Outfit 800 UPPERCASE clamp(40px,6.5vw,96px) --foreground; proof subhead Outfit 400 18px --muted-foreground ("I help global enterprises and UN agencies migrate to the cloud, automate with AI, and ship measurable change."); rotating discipline line "Cloud Architecture · AI Automation · Digital Transformation" --primary; primary CTA "Book a discovery call" + ghost CTA "View case studies" (1px --border). RIGHT (5 col) — professional headshot in RADIUS.lg frame with a subtle --glow-soft primary edge.
- STAT STRIP: 4 columns on --surface band, 1px --border. Each: figure Outfit 800 clamp(40px,5vw,72px) --primary tabular-nums + caption Outfit 500 --muted-foreground — "70% fewer outages", "50% faster go-live", "15–20 hrs/wk automated", "6 UN agencies advised".
- CREDIBILITY + MARQUEE: centered line "Technology advisor to United Nations agencies and global enterprises" Outfit 600 --foreground; below, a monochrome logo marquee — UN, WHO, UNICEF, UN Women, Madison Square Garden, GLG (grayscale, --muted-foreground).
- EXPERTISE GRID: 4 --surface cards (1px --border, RADIUS.lg, SPACING gap): each = --primary line icon, title Outfit 600 (Cloud Migration & Architecture / AI Strategy & Automation / Enterprise Program Leadership / Digital Transformation), one-line desc --muted-foreground, "Learn more →" --primary.
- SELECTED CASE STUDIES: 2 cards — thumbnail, metadata row "client · scope · year" --muted-foreground caption, title Outfit 600, one headline metric --primary, "Read case study →".
- TESTIMONIAL: Cardo serif pull-quote clamp(22px,2.4vw,30px) with a 2px --primary left rule + attribution (UN / enterprise leader).

RESPONSIVE CONTEXT: Desktop-first 1440×900 web. Header always visible — never collapsed to a hamburger. Degrade: 768 (nav condenses, hero stacks, stat strip 2×2), 390 (single column).

COMPONENT TARGET: src/app/page.tsx (native-shell branch) → src/widgets/Hero.tsx + src/widgets/home/{AdvisorSection,LogoMarquee,ServiceBlockSection,TestimonialsCarousel}.tsx + src/widgets/Header.tsx + src/widgets/Footer.tsx

COLORS: tokens.colors.primary (--primary) — eyebrow, CTAs, links, stat figures, active nav underline, focus ring | tokens.colors.primary.foreground (--primary-foreground) — text/icons ON primary fills (dark) | tokens.colors.accent (--accent) — at most one highlight | tokens.colors.background (--background) — page canvas | tokens.colors.surface (--surface) — stat band + cards | tokens.colors.elevated (--elevated) — menus | tokens.colors.foreground (--foreground) — primary text | tokens.colors.mutedForeground (--muted-foreground) — captions, inactive nav, logos | tokens.colors.border (--border) / --border-subtle — card + chrome rules

TOKENS: SPACING py-20→28 sections | 1170px container, px-6 | RADIUS.lg cards (1rem) | RADIUS.xl major sections (1.5rem) | RADIUS.md buttons (0.75rem, soft-rectangle) | --glow-soft on headshot frame | focus 2px solid --ring outline, 2px offset | 72px header | tabular-nums on stat figures

VARIANT: EXPLORATION — try 2 hero compositions: (A) headshot-right with stat strip below; (B) centered headline with the stat strip as the proof band. Keep the dark register and single-accent discipline in both. This prompt defines the canonical shell chrome — lock it.

STYLE: High-fidelity desktop web mockup at Figma presentation quality. Quiet enterprise authority (Linear / Vercel / Stripe). Strong Outfit weight/case contrast, hairline borders, generous whitespace, subtle --primary glow on focus/active only. Evidence as large --primary stat callouts. Monochrome client logos. Real Dame Luthas proof data.

NEGATIVE: No mobile device frames. No hamburger menus. No inconsistent Dame Luthas wordmark. No white/ivory full-bleed backgrounds. No lavender/periwinkle, mint, or yellow. No glassmorphism or neon/club glow. No Inter, Roboto, or SF Pro — Outfit + Cardo only. No emoji as icons. No clip art or stock blobs. No wireframes — final-fidelity only. No hardcoded hex values. No SMB/freelancer framing ("build your dream", "web hosting", "resumes").

BACKGROUND: 1440×900 web mockup floating on a deep-navy --background surface. SHADOWS.xl under canvas. Subtle --primary ambient glow upper-left. No browser chrome.
```

---

# ═══════════════════════════════════════════════════
# B DISCOVERY — CASE STUDIES INDEX (LUTHAS-002)
# ═══════════════════════════════════════════════════

## PROMPT LUTHAS-02-A — Case Studies index (filterable grid)
**Slice:** LUTHAS-002 | **Agent:** 08 | **Tier:** 2 | **Priority:** P1
**Personas:** P01 Hiring Executive, P02 Technical Recruiter, P04 Transformation Lead
**Component Target:** `src/app/case-studies/page.tsx` → `src/widgets/CaseStudiesPage.tsx` (+ PortfolioGrid, PortfolioFilterMenu)

### PASTE-READY PROMPT

```
AGENT ROLE: You are Agent 08 — Discovery & Navigation Designer (Tier 2). You make a body of enterprise work scannable and filterable, outcomes-first. Output is conversion-ready for Next.js App Router + Tailwind v4 inside src/ (FSD). Preserve FSD boundaries.

BRAND: Dame Luthas — Technology Leader & AI Strategist portfolio. Uses Luthas Enterprise design tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, single dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, UN/NGO program sponsors, Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4, FSD widgets.
VIBE: Senior, enterprise-grade, quiet authority. Outcomes first.
FONTS: Display: Outfit 800 UPPERCASE | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif. tabular-nums on metrics.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). Cards = surface + 1px border. One decisive accent. Real Dame Luthas case data.

SUBJECT: The Case Studies index — a filterable 3-column grid of enterprise engagements, each card outcomes-first with one headline metric, plus a filter row.

SCENE: A hiring panel verifies depth and relevance — scanning for domain fit (cloud / AI / transformation) and hard results, then opening the most relevant case. The "All" filter is active; an "Enterprise" cyan tag distinguishes strategic engagements.

TARGET PERSONAS: P01 Hiring Executive (assess relevance), P02 Technical Recruiter (scan breadth), P04 Transformation Lead (find domain analog).

LAYOUT SPEC:
- SHELL CHROME INHERITED from LUTHAS-01-A — sticky 72px top header (DAME LUTHAS wordmark Outfit 700 + LUTHAS_NAV + social icons + "Book a discovery call" primary button) and canonical navy footer. Do not redesign.
- LUTHAS_NAV (show ALL items, highlight active): Home | Case Studies | About | Contact. Active item = Case Studies (--primary underline 2px + --foreground text).
- PAGE INTRO: breadcrumb "Home / Case Studies" --muted-foreground with --primary active; H1 "Case Studies" Outfit 700 clamp(28px,3vw,40px) --foreground; one --muted-foreground intro line ("Enterprise cloud, AI, and transformation engagements — outcomes first.").
- FILTER ROW 48px: a soft-rectangle "All ▾" dropdown styled as an --elevated menu (1px --border, RADIUS.md); filter pills (rounded-full) — ACTIVE pill = --primary-soft fill + --primary border + --foreground text; inactive = 1px --border + --muted-foreground.
- CARD GRID 3-column, SPACING gap, --surface cards (1px --border, RADIUS.lg): each = 16:9 thumbnail; metadata row "client · scope · year" Outfit 500 --muted-foreground caption; title Outfit 600 --foreground; ONE headline metric Outfit 800 --primary tabular-nums; a cyan "Enterprise" tag (--accent) on strategic engagements; "Read case study →" --primary. Hover = lift to SHADOWS.md + --primary border. Include cards for "Amazon Labor Union — Digital Transformation" (300% petitions) and "Gatorade — Generative-AI Bottle Design".

RESPONSIVE CONTEXT: Desktop-first 1440×900 web. Header always visible. Degrade: 768 (2-col grid), 390 (1-col; filter row scrolls horizontally).

COMPONENT TARGET: src/app/case-studies/page.tsx → src/widgets/CaseStudiesPage.tsx (+ src/widgets/PortfolioGrid.tsx, src/widgets/PortfolioFilterMenu.tsx)

COLORS: tokens.colors.primary (--primary) — active nav + headline metrics + links | tokens.colors.primary.foreground (--primary-foreground) — text on primary fills | tokens.colors.accent (--accent) — "Enterprise" tag ONLY | tokens.colors.background (--background) — canvas | tokens.colors.surface (--surface) — cards | tokens.colors.elevated (--elevated) — dropdown | tokens.colors.foreground (--foreground) — titles | tokens.colors.mutedForeground (--muted-foreground) — metadata, inactive | tokens.colors.border (--border) — card + pill rules. Active-pill text on --primary-soft = --foreground.

TOKENS: SPACING py-20 section | grid gap 1.5–2rem | RADIUS.lg cards | RADIUS.md dropdown + buttons | RADIUS.full pills | --elevated dropdown surface | focus 2px solid --ring | 48px filter row

VARIANT: REFINEMENT — inherit shell chrome from LUTHAS-01-A exactly. Lock the card anatomy; explore ONLY the filter-row treatment (pills vs. a segmented control). Emphasize card-grid rhythm and metric legibility.

STYLE: High-fidelity desktop web mockup at Figma presentation quality. Even card rhythm, clear metadata hierarchy, outcomes in --primary blue. Hairline borders, restrained motion (hover lift only).

NEGATIVE: No mobile device frames. No hamburger menus. No inconsistent Dame Luthas wordmark. No white backgrounds. No lavender, mint, or yellow. No glassmorphism or neon. No Inter/Roboto/SF Pro — Outfit + Cardo only. No emoji as icons. No wireframes — final-fidelity only. No hardcoded hex values. No SMB/freelancer framing.

BACKGROUND: 1440×900 web mockup floating on a deep-navy --background surface. SHADOWS.xl under canvas. Subtle --primary ambient glow upper-left. No browser chrome.
```

---

# ═══════════════════════════════════════════════════
# A BRAND / ENTRY — ABOUT (LUTHAS-003)
# ═══════════════════════════════════════════════════

## PROMPT LUTHAS-03-A — About (bio + credentials + quote)
**Slice:** LUTHAS-003 | **Agent:** 07 | **Tier:** 1 | **Priority:** P1
**Personas:** P01 Hiring Executive, P03 UN/NGO Program Sponsor, P02 Technical Recruiter
**Component Target:** `src/app/[slug]/page.tsx` (about slug) → `src/widgets/AboutPage.tsx`

### PASTE-READY PROMPT

```
AGENT ROLE: You are Agent 07 — Personal-Brand & Credibility Designer (Tier 1). You translate a senior career into concrete, verifiable expertise without vague filler. Output is conversion-ready for Next.js App Router + Tailwind v4 inside src/ (FSD).

BRAND: Dame Luthas — Technology Leader & AI Strategist portfolio. Uses Luthas Enterprise design tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, single dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, UN/NGO program sponsors, Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4, FSD widgets.
VIBE: Senior, enterprise-grade, quiet authority. Concrete over vague.
FONTS: Display: Outfit 800 UPPERCASE | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). Cards = surface + 1px border. One decisive accent. Real Dame Luthas credentials.

SUBJECT: The About page — a concise senior bio, concrete expertise chips, a credential/certifications block, and one career-defining Cardo pull-quote.

SCENE: A stakeholder vetting fit reads for specifics: which domains, which institutions, what scale. The page replaces vague "organizational harmonization" language with concrete proof — Global Cloud Migrations, Enterprise Architecture, AI-Driven Automation, Program Management — and a UN/Microsoft pedigree.

TARGET PERSONAS: P01 Hiring Executive (assess depth), P03 UN/NGO Program Sponsor (verify institutional pedigree), P02 Technical Recruiter (extract specifics).

LAYOUT SPEC:
- SHELL CHROME INHERITED from LUTHAS-01-A — sticky 72px top header + canonical navy footer. Do not redesign.
- LUTHAS_NAV (show ALL items, highlight active): Home | Case Studies | About | Contact. Active item = About (--primary underline 2px + --foreground text).
- BODY (asymmetric 2-col [1fr / 1.3fr], 1170px): LEFT — professional headshot RADIUS.lg; below, a --surface card (1px --border, RADIUS.lg) credential block — location, current focus, and a compact certifications list Outfit 500 --muted-foreground. RIGHT — H1 "About Dame Luthas" Outfit 700 clamp(28px,3vw,40px) --foreground; concise senior bio Outfit 400 18px --foreground (concrete, no filler); a row of bordered expertise chips (rounded-full, 1px --border, --muted-foreground → --primary on hover): "Global Cloud Migrations", "Enterprise Architecture", "AI-Driven Automation", "Program Management"; then a Cardo serif pull-quote clamp(22px,2.4vw,30px) --foreground with a 2px --primary left rule (one career-defining line).
- CREDIBILITY BAND: monochrome client logos (UN, WHO, UNICEF, UN Women, Madison Square Garden, GLG) under a --muted-foreground "Trusted by" label.
- CTA BAND: --surface band (1px --border top/bottom), short headline + primary "Let's talk" button (--primary fill, --primary-foreground text).

RESPONSIVE CONTEXT: Desktop-first 1440×900 web. Header always visible. Degrade: 768 (stack — card above bio), 390 (single column; chips wrap).

COMPONENT TARGET: src/app/[slug]/page.tsx (about slug) → src/widgets/AboutPage.tsx

COLORS: tokens.colors.primary (--primary) — active nav, chip hover, quote rule, CTA | tokens.colors.primary.foreground (--primary-foreground) — text on primary fill | tokens.colors.accent (--accent) — optional, once | tokens.colors.background (--background) — canvas | tokens.colors.surface (--surface) — credential card + CTA band | tokens.colors.foreground (--foreground) — headings, bio | tokens.colors.mutedForeground (--muted-foreground) — captions, chips | tokens.colors.border (--border) — card + chip rules

TOKENS: SPACING py-20 sections | RADIUS.lg credential card + headshot | RADIUS.full chips | RADIUS.md CTA button | Cardo serif pull-quote + 2px --primary left rule | focus 2px solid --ring

VARIANT: REFINEMENT — inherit shell chrome from LUTHAS-01-A exactly. Keep the asymmetric grid; explore the credential block as a card vs. an inline definition list. One Cardo serif accent only (the quote).

STYLE: High-fidelity desktop web mockup at Figma presentation quality. Editorial executive warmth; one Cardo serif accent. Concrete, specific copy; no filler. Hairline borders.

NEGATIVE: No mobile device frames. No hamburger menus. No inconsistent Dame Luthas wordmark. No white backgrounds. No lavender, mint, or yellow. No glassmorphism or neon. No Inter/Roboto/SF Pro — Outfit + Cardo only. No emoji as icons. No vague buzzwords. No wireframes — final-fidelity only. No hardcoded hex values.

BACKGROUND: 1440×900 web mockup floating on a deep-navy --background surface. SHADOWS.xl under canvas. Subtle --primary ambient glow upper-left. No browser chrome.
```

---

# ═══════════════════════════════════════════════════
# C DETAIL — PORTFOLIO: AMAZON LABOR UNION (LUTHAS-004)
# ═══════════════════════════════════════════════════

## PROMPT LUTHAS-04-A — Portfolio detail: Amazon Labor Union
**Slice:** LUTHAS-004 | **Agent:** 11 | **Tier:** 3 | **Priority:** P1
**Personas:** P01 Hiring Executive, P04 Transformation Lead, P02 Technical Recruiter
**Component Target:** `src/app/portfolio/[slug]/page.tsx` → `src/widgets/portfolio/PortfolioDetail.tsx` (+ GalleryGrid, PortfolioInfo, PortfolioNav)

### PASTE-READY PROMPT

```
AGENT ROLE: You are Agent 11 — Case-Study Narrative Designer (Tier 3). You structure an engagement as Challenge → Approach → Solution → Results, with outcomes surfaced as stat callouts and captioned evidence. Output is conversion-ready for Next.js App Router + Tailwind v4 inside src/ (FSD).

BRAND: Dame Luthas — Technology Leader & AI Strategist portfolio. Uses Luthas Enterprise design tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, single dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, UN/NGO program sponsors, Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4, FSD widgets.
VIBE: Senior, enterprise-grade, quiet authority. Story + proof.
FONTS: Display: Outfit 800 UPPERCASE | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif. tabular-nums on stats.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). Reading-optimized measure. One decisive accent. Real engagement data + captioned visuals.

SUBJECT: The Amazon Labor Union "Digital Transformation" case-study detail — metadata header, a Challenge → Approach → Solution → Results narrative spine, stat callouts, a captioned gallery, a client pull-quote, and prev/next nav.

SCENE: A reader who clicked from the index wants the story and the proof: what the problem was, what was done, and the measurable result. Results surface as large --primary stats ("300% increase in petitions", "120% fundraising growth"), with one --accent cyan headline result; gallery images are captioned with their strategic role.

TARGET PERSONAS: P01 Hiring Executive (assess outcomes), P04 Transformation Lead (method transfer), P02 Technical Recruiter (verify depth).

LAYOUT SPEC:
- SHELL CHROME INHERITED from LUTHAS-01-A — sticky 72px top header + canonical navy footer. Do not redesign.
- LUTHAS_NAV (show ALL items, highlight active): Home | Case Studies | About | Contact. Active item = Case Studies (--primary underline 2px + --foreground text).
- DETAIL HERO: breadcrumb "Home / Case Studies / Amazon Labor Union" --muted-foreground; metadata row "Client: Amazon Labor Union · Scope: Digital Transformation · Role: Tech Lead · Year" Outfit 500 --muted-foreground; H1 "Amazon Labor Union — Digital Transformation" Outfit 800 UPPERCASE clamp(36px,4.6vw,64px) --foreground; one-line summary.
- NARRATIVE SPINE (centered max-w-prose): four stacked sections, each Outfit 600 heading + Outfit 400 body — Challenge → Approach → Solution → Results.
- STAT CALLOUTS (in/after Results): large figures Outfit 800 --primary tabular-nums — "300% increase in petitions", "120% fundraising growth"; --accent cyan used ONCE for the single headline result.
- GALLERY: 3-column grid (1px --border frames, RADIUS.lg), EACH image captioned Outfit 500 --muted-foreground with its strategic role ("Campaign landing page", "Member dashboard", "Donation funnel").
- CLIENT PULL-QUOTE: Cardo serif clamp(22px,2.4vw,30px) --foreground, 2px --primary left rule, attributed.
- PREV / NEXT portfolio nav: bordered (1px --border), --muted-foreground → --primary on hover.

RESPONSIVE CONTEXT: Desktop-first 1440×900 web. Header always visible. Degrade: 768 (gallery 2-col), 390 (1-col; spine full-width).

COMPONENT TARGET: src/app/portfolio/[slug]/page.tsx → src/widgets/portfolio/PortfolioDetail.tsx (+ GalleryGrid.tsx, PortfolioInfo.tsx, PortfolioNav.tsx)

COLORS: tokens.colors.primary (--primary) — stats, links, active nav, quote rule | tokens.colors.primary.foreground (--primary-foreground) — text on primary fill | tokens.colors.accent (--accent) — the single headline result ONLY | tokens.colors.background (--background) — canvas | tokens.colors.surface (--surface) — cards | tokens.colors.foreground (--foreground) — headings, body | tokens.colors.mutedForeground (--muted-foreground) — metadata, captions | tokens.colors.border (--border) — gallery frames + nav

TOKENS: SPACING py-16→20 sections | RADIUS.lg gallery + cards | RADIUS.md buttons | stat figures Outfit 800 tabular-nums | focus 2px solid --ring

VARIANT: REFINEMENT — inherit shell chrome from LUTHAS-01-A exactly. Lock the Challenge→Results spine; explore stat-callout placement (inline band vs. a results card). Evidence-forward gallery with captions.

STYLE: High-fidelity desktop web mockup at Figma presentation quality. Reading-optimized spine (comfortable measure), evidence-forward captioned gallery, outcomes in --primary blue, one --accent highlight. Hairline borders, restrained motion.

NEGATIVE: No mobile device frames. No hamburger menus. No inconsistent Dame Luthas wordmark. No white backgrounds. No lavender, mint, or yellow. No glassmorphism or neon. No Inter/Roboto/SF Pro — Outfit + Cardo only. No emoji as icons. No uncaptioned image dumps. No wireframes — final-fidelity only. No hardcoded hex values.

BACKGROUND: 1440×900 web mockup floating on a deep-navy --background surface. SHADOWS.xl under canvas. Subtle --primary ambient glow upper-left. No browser chrome.
```

---

# ═══════════════════════════════════════════════════
# C DETAIL — PORTFOLIO: GATORADE GEN-AI BOTTLES (LUTHAS-005)
# ═══════════════════════════════════════════════════

## PROMPT LUTHAS-05-A — Portfolio detail: Gatorade Generative-AI Bottle Design
**Slice:** LUTHAS-005 | **Agent:** 11 | **Tier:** 3 | **Priority:** P1
**Personas:** P01 Hiring Executive, P04 Transformation Lead (AI/innovation), P02 Technical Recruiter
**Component Target:** `src/app/portfolio/[slug]/page.tsx` → `src/widgets/portfolio/PortfolioDetail.tsx` (+ GalleryGrid, PortfolioInfo, PortfolioNav)

### PASTE-READY PROMPT

```
AGENT ROLE: You are Agent 11 — Case-Study Narrative Designer (Tier 3). You structure this generative-AI engagement as Challenge → Approach → Solution → Results; the AI artwork is the only saturated color on the page, framed by restrained navy/blue chrome. Output is conversion-ready for Next.js App Router + Tailwind v4 inside src/ (FSD).

BRAND: Dame Luthas — Technology Leader & AI Strategist portfolio. Uses Luthas Enterprise design tokens from src/shared/design/tokens.ts.
PRODUCT: Marketing / web product, desktop-first 1440×900, single dark navy canvas with a sticky top header (NO sidebar).
DEMOGRAPHIC: hiring executives, technical recruiters, UN/NGO program sponsors, Fortune-500 transformation leads.
PLATFORM: Next.js App Router (src/app), Tailwind v4, FSD widgets.
VIBE: Senior, enterprise-grade, quiet authority. Applied-AI proof.
FONTS: Display: Outfit 800 UPPERCASE | Heading: Outfit 600/700 | Body: Outfit 400/500 | Pull-quote: Cardo serif. tabular-nums on stats.
RULES: Desktop-first 1440×900. Sticky top header (NEVER hamburger). Restrained chrome so the AI artwork pops. One decisive accent. Real engagement data + captioned visuals.

SUBJECT: The Gatorade "Generative-AI-Powered Bottle Design" case-study detail — metadata header, a Challenge → Approach → Solution → Results spine, throughput/engagement stat callouts, and a gallery of vivid AI-generated bottle designs (each captioned).

SCENE: A reader evaluating applied-AI depth wants the business problem (on-brand individualized bottle artwork at scale), the gen-AI pipeline approach with brand guardrails, the solution, and the result. Throughput/engagement metrics surface as --primary stats with one --accent cyan headline; the vivid lightning-bolt bottle artwork is the only saturated color, framed by the navy/blue system.

TARGET PERSONAS: P01 Hiring Executive (assess applied-AI outcome), P04 Transformation Lead (AI pipeline transfer), P02 Technical Recruiter (verify applied-AI depth).

LAYOUT SPEC:
- SHELL CHROME INHERITED from LUTHAS-01-A — sticky 72px top header + canonical navy footer. Do not redesign.
- LUTHAS_NAV (show ALL items, highlight active): Home | Case Studies | About | Contact. Active item = Case Studies (--primary underline 2px + --foreground text).
- DETAIL HERO: breadcrumb "Home / Case Studies / Gatorade" --muted-foreground; metadata row "Client: Gatorade · Scope: Generative-AI Product Design · Role: AI Strategist · Year" Outfit 500 --muted-foreground; H1 "Gatorade Embraces Generative-AI-Powered Bottle Design" Outfit 800 UPPERCASE clamp(36px,4.6vw,64px) --foreground; one-line summary.
- NARRATIVE SPINE (centered max-w-prose): Challenge (on-brand individualized bottle art at scale) → Approach (a generative-AI design pipeline + brand guardrails) → Solution → Results — each Outfit 600 heading + Outfit 400 body.
- STAT CALLOUTS: large figures Outfit 800 --primary tabular-nums for design throughput / engagement lift; --accent cyan used ONCE for the single headline metric.
- GALLERY: grid of vivid AI-generated bottle designs (lightning-bolt: sport, abstract, character themes) with 3:4 frames (1px --border, RADIUS.lg), EACH captioned Outfit 500 --muted-foreground with theme/use — the artwork is the ONLY saturated color on the page.
- CLIENT PULL-QUOTE: Cardo serif clamp(22px,2.4vw,30px) --foreground, 2px --primary left rule, attributed.
- PREV / NEXT portfolio nav: bordered (1px --border), --muted-foreground → --primary on hover.

RESPONSIVE CONTEXT: Desktop-first 1440×900 web. Header always visible. Degrade: 768 (gallery 2-col), 390 (1-col; bottle images keep 3:4 aspect).

COMPONENT TARGET: src/app/portfolio/[slug]/page.tsx → src/widgets/portfolio/PortfolioDetail.tsx (+ GalleryGrid.tsx, PortfolioInfo.tsx, PortfolioNav.tsx)

COLORS: tokens.colors.primary (--primary) — stats, links, active nav, quote rule | tokens.colors.primary.foreground (--primary-foreground) — text on primary fill | tokens.colors.accent (--accent) — the single headline metric ONLY (keep chrome restrained so the bottle artwork pops) | tokens.colors.background (--background) — canvas | tokens.colors.surface (--surface) — cards | tokens.colors.foreground (--foreground) — headings, body | tokens.colors.mutedForeground (--muted-foreground) — metadata, captions | tokens.colors.border (--border) — gallery frames + nav

TOKENS: SPACING py-16→20 sections | RADIUS.lg gallery cards (3:4 bottle frames) | RADIUS.md buttons | stat figures Outfit 800 tabular-nums | focus 2px solid --ring

VARIANT: REFINEMENT — inherit shell chrome from LUTHAS-01-A exactly. Keep the LUTHAS-04-A spine; explore the gallery as a masonry vs. a uniform grid for the bottle artwork. Restrained chrome so the saturated artwork is the visual focus.

STYLE: High-fidelity desktop web mockup at Figma presentation quality. Restrained navy/blue chrome so the saturated AI bottle artwork is the focus. Outcomes in --primary blue, one --accent highlight. Captions on every image. Hairline borders.

NEGATIVE: No mobile device frames. No hamburger menus. No inconsistent Dame Luthas wordmark. No white backgrounds. No lavender, mint, or yellow chrome. No glassmorphism or neon UI. No Inter/Roboto/SF Pro — Outfit + Cardo only. No emoji as icons. No uncaptioned image dumps. No wireframes — final-fidelity only. No hardcoded hex values.

BACKGROUND: 1440×900 web mockup floating on a deep-navy --background surface. SHADOWS.xl under canvas. Subtle --primary ambient glow upper-left. No browser chrome.
```

---

### Usage
1. Open Google Stitch → new desktop/web design.
2. Paste one PASTE-READY PROMPT (13-block complete). Generate.
3. Iterate: regenerate any section that drifts toward lavender / pills / SMB framing / glassmorphism / a sidebar.
4. Export PNG → `output/stitch/luthas-enterprise/images/`. Compare color/spacing against shipped tokens (`src/app/globals.css`, `src/shared/design/tokens.ts`).
5. COMPONENT TARGET names the FSD destination file for the React implementation step.
