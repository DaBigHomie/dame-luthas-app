# Stitch Prompts — Luthas Enterprise (Dame Luthas portfolio)

13-block composition per `stitch-mockup-toolkit/docs/01-STRATEGY.md`. Five prompts, one per page,
each a paste-ready block. Tokens are referenced by **name** (from `src/shared/design/tokens.ts` /
the CSS vars in `src/app/globals.css`) — **never hardcode hex**. Brand SSOT: `DESIGN.md`.

Block sequence: **0** Agent Context · **1** Brand Preamble · **2** Subject · **3** Scene · **3b** Personas
· **3c** Layout Spec · **3d** Responsive · **3e** Component Target · **4** Brand Colors · **4b** Design Tokens
· **4c** Variant Directive · **5** Style Directives · **6** Negative · **7** Background/Frame.

> Token refs used in Block 4 (names, not hex): `tokens.colors.primary` (`--primary`, electric blue),
> `tokens.colors.accent` (`--accent`, cyan), `tokens.colors.surface` (`--surface`),
> `tokens.colors.background` (`--background`), `tokens.colors.foreground`/`mutedForeground`,
> `tokens.colors.primary.foreground` (dark text ON primary fills).

---

## P1 — HOME  (`/`)

```
[Block 0 — Agent Context]
You are the Executive Portfolio Lead & Brand-Entry Architect for Dame Luthas. You design the first
screen a hiring executive sees and you optimize for instant credibility, scannable proof, and a single
clear next action.

[Block 1 — Brand Preamble]
Dame Luthas — professional portfolio of a Technology Leader & AI Strategist (global cloud migrations,
enterprise architecture, AI-driven automation, program management; senior UN and Microsoft work).
Demographic: hiring executives, recruiters, enterprise stakeholders. Platform: desktop-first responsive
web (Next.js App Router + Tailwind v4, Feature-Sliced Design). Vibe: senior, enterprise-grade, AI-forward,
quiet authority (Linear/Vercel/Stripe register).

[Block 2 — Subject]
The homepage hero + supporting sections — a single-screen value proposition that establishes Dame Luthas
as a senior enterprise technology leader, with evidence above the fold.

[Block 3 — Scene]
A recruiter or VP of Engineering lands here from LinkedIn with ~5 seconds of attention. They must grasp
the seniority, the domains (cloud/AI/transformation), and the proof (UN/Microsoft, hard metrics) before
deciding to read on or book a call.

[Block 3b — Target Personas]
Enterprise hiring exec · technical recruiter · UN/NGO program sponsor · Fortune-500 transformation lead.

[Block 3c — Layout Spec]
12-col grid, 1170px max content, generous whitespace. Sections top→bottom:
1) Sticky header: wordmark "DAME LUTHAS" left; centered nav (Home · Case Studies · About · Contact);
   right: social icons + soft-rectangle primary button "Book a discovery call".
2) Hero, 2-col, NO card: LEFT — blue eyebrow "TECHNOLOGY LEADER & AI STRATEGIST", huge Outfit-800
   UPPERCASE H1 "HI, I'M DAME LUTHAS. LET'S BUILD TOGETHER", muted proof subhead, rotating line
   "Cloud Architecture · AI Automation · Digital Transformation", primary CTA + ghost CTA. RIGHT —
   professional headshot in a rounded-xl frame with a subtle blue glow edge.
3) Stat strip: 4 large primary stat numbers — "70% fewer outages", "50% faster go-live",
   "15–20 hrs/wk automated", "6 UN agencies advised".
4) Credibility line "Technology advisor to United Nations agencies and global enterprises" + a monochrome
   logo marquee (UN, WHO, UNICEF, UN Women, Madison Square Garden, GLG).
5) Expertise: 3–4 surface cards (Cloud Migration & Architecture · AI Strategy & Automation · Enterprise
   Program Leadership · Digital Transformation).
6) Selected case studies: 2–3 cards w/ metadata + one blue headline metric each.
7) Cardo serif testimonial pull-quote.
8) Footer on navy (no white bar): secondary nav, credential line, social.

[Block 3d — Responsive Context]
Primary viewport: desktop 1440×1024. Degrade gracefully at 768 (nav → condensed) and 390 (single column,
hero stacks, stat strip wraps 2×2).

[Block 3e — Component Target]
src/app/page.tsx (native-shell branch) → src/widgets/Hero.tsx, src/widgets/home/* (AdvisorSection,
LogoMarquee, ServiceBlockSection, TestimonialsCarousel), src/widgets/Header.tsx, src/widgets/Footer.tsx.

[Block 4 — Brand Colors]
Primary:    Electric Blue → tokens.colors.primary.DEFAULT  (--primary)
Secondary:  Navy Surface  → tokens.colors.surface          (--surface)
Accent:     Cyan          → tokens.colors.accent.DEFAULT    (--accent)  [use once, for one stat/status]
Background: Deep Navy      → tokens.colors.background        (--background)
Text:       White / Muted  → tokens.colors.foreground / tokens.colors.mutedForeground (--foreground / --muted-foreground)
On-primary text/icons: tokens.colors.primary.foreground (--primary-foreground, DARK). Never hardcode hex.

[Block 4b — Design Tokens]
Spacing base: 0.25rem (Tailwind scale; sections py-20→28). Radius LG: 1rem (cards). Radius XL: 1.5rem
(major sections). Buttons: radius 0.75rem (soft-rectangle, NOT pill). Elevation: surface + 1px border
(--border), not heavy shadow. Focus: 2px solid --ring outline.

[Block 4c — Variant Directive]
EXPLORATION pass: try 2 hero compositions (headshot-right vs. centered headline + stat band). Keep the
dark register and single-accent discipline in both.

[Block 5 — Style Directives]
High-fidelity desktop web at Figma presentation quality. Strong Outfit weight/case contrast, hairline
borders, generous spacing, subtle blue glow on focus/active only. Evidence as large primary stat
callouts. Monochrome client logos. Modern enterprise SaaS standards (not iOS/Android chrome).

[Block 6 — Negative Prompts]
Avoid: lavender/periwinkle (#8f93f1), mint, yellow (#f7df3d), white/ivory full-bleed backgrounds,
glassmorphism, neon/club glow, nightlife aesthetic, emoji-as-icons, clip art, stock blobs, angled device
mockups, full-pill primary CTAs, and any SMB/freelancer framing ("build your dream", "web hosting",
"restaurant menu", "resumes"), lorem ipsum, system/Comic-Sans fonts.

[Block 7 — Background/Frame]
Desktop browser viewport only — flat, upright, centered, 1440px content on the deep-navy --background
canvas. No device frame, no angle, no desk scene, no ambient glow outside the layout.
```

---

## P2 — CASE STUDIES INDEX  (`/case-studies`)

```
[Block 0 — Agent Context]
You are the Information-Architecture & Evidence-Curation Architect for Dame Luthas. You make a body of
enterprise work scannable and filterable, foregrounding outcomes.

[Block 1 — Brand Preamble]
Dame Luthas — Technology Leader & AI Strategist portfolio. Demographic: hiring execs, recruiters,
enterprise stakeholders. Platform: desktop-first responsive web (Next.js + Tailwind v4, FSD). Vibe:
senior, enterprise, quiet authority.

[Block 2 — Subject]
The Case Studies index — a filterable grid of enterprise engagements, outcomes-first.

[Block 3 — Scene]
A hiring panel wants to verify depth and relevance. They scan for domain fit (cloud/AI/transformation)
and hard results, then open the most relevant case.

[Block 3b — Target Personas]
Enterprise hiring exec · technical recruiter · transformation program sponsor.

[Block 3c — Layout Spec]
1) Sticky header (as P1). 2) Intro: breadcrumb "Home / Case Studies" (muted, blue active), Outfit-700
title "Case Studies", one muted intro line. 3) Filter row: soft-rectangle "All ▾" dropdown styled as an
elevated (--elevated) menu; filter pills — ACTIVE pill = primary-soft fill + blue border + white text,
inactive = bordered/muted. 4) 3-col card grid (surface + 1px border): 16:9 thumbnail, metadata row
"client · scope · year" (muted caption), Outfit-600 title, ONE blue headline stat, a cyan "Enterprise"
tag on strategic engagements, "Read case study →"; hover = lift + blue border. Include cards for
"Amazon Labor Union — Digital Transformation" and "Gatorade — Generative-AI Bottle Design". 5) Footer.

[Block 3d — Responsive Context]
Desktop 1440 (3-col) → 768 (2-col) → 390 (1-col). Filter row scrolls horizontally on mobile.

[Block 3e — Component Target]
src/app/case-studies/page.tsx → src/widgets/CaseStudiesPage.tsx (+ PortfolioGrid / PortfolioFilterMenu).

[Block 4 — Brand Colors]
Primary: Electric Blue → tokens.colors.primary.DEFAULT (--primary) · Secondary: Navy Surface →
tokens.colors.surface (--surface) · Accent: Cyan → tokens.colors.accent.DEFAULT (--accent) [the
"Enterprise" tag only] · Background: Deep Navy → tokens.colors.background (--background) · Text: White /
Muted → tokens.colors.foreground / mutedForeground. Active-pill text on primary-soft = white. Never hardcode hex.

[Block 4b — Design Tokens]
Spacing base 0.25rem; grid gap 1.5–2rem. Radius LG 1rem (cards). Pills: radius-full. Dropdown: --elevated
surface + 1px border. Focus: 2px solid --ring.

[Block 4c — Variant Directive]
REFINEMENT pass: lock the card anatomy; explore only the filter-row treatment (pills vs. segmented control).

[Block 5 — Style Directives]
High-fidelity desktop web. Even card rhythm, clear metadata hierarchy, outcomes in primary blue. Hairline
borders, restrained motion (hover lift only).

[Block 6 — Negative Prompts]
Avoid: lavender/mint/yellow, white backgrounds, glassmorphism, neon, emoji-as-icons, clip art, full-pill
primary CTAs, SMB framing, lorem ipsum, system fonts.

[Block 7 — Background/Frame]
Desktop browser viewport only on deep-navy --background. No device frame, no angle, no desk scene.
```

---

## P3 — ABOUT  (`/about`)

```
[Block 0 — Agent Context]
You are the Personal-Brand & Credibility Architect for Dame Luthas. You translate a senior career into
concrete, verifiable expertise without vague filler.

[Block 1 — Brand Preamble]
Dame Luthas — Technology Leader & AI Strategist portfolio. Demographic: hiring execs, recruiters,
enterprise stakeholders. Platform: desktop-first responsive web (Next.js + Tailwind v4, FSD). Vibe:
senior, enterprise, quiet authority.

[Block 2 — Subject]
The About page — bio, concrete expertise, credentials, and one career-defining quote.

[Block 3 — Scene]
A stakeholder vetting fit reads for specifics: which domains, which institutions, what scale. The page
must replace vague "organizational harmonization" language with concrete proof.

[Block 3b — Target Personas]
Enterprise hiring exec · board/advisory sponsor · recruiter.

[Block 3c — Layout Spec]
1) Sticky header (as P1). 2) Asymmetric 2-col body [1fr / 1.3fr]: LEFT — headshot, then a surface card
(1px border) credential block (location, current focus, certifications). RIGHT — Outfit-700 "About Dame
Luthas", concise senior bio, a row of bordered expertise chips ("Global Cloud Migrations", "Enterprise
Architecture", "AI-Driven Automation", "Program Management"), then a Cardo serif pull-quote with a thin
blue left-rule. 3) Credibility band: monochrome client logos under a muted "Trusted by". 4) CTA band
(surface, hairline top/bottom borders) + primary "Let's talk". 5) Footer.

[Block 3d — Responsive Context]
Desktop 1440 (2-col asymmetric) → 768 (stack, card above bio) → 390 (single column, chips wrap).

[Block 3e — Component Target]
src/app/[slug]/page.tsx (about slug) → src/widgets/AboutPage.tsx.

[Block 4 — Brand Colors]
Primary: Electric Blue → tokens.colors.primary.DEFAULT (--primary) · Secondary: Navy Surface →
tokens.colors.surface (--surface) · Accent: Cyan → tokens.colors.accent.DEFAULT (--accent) [optional,
once] · Background: Deep Navy → tokens.colors.background (--background) · Text: White / Muted →
tokens.colors.foreground / mutedForeground. Chips: bordered, muted text → blue on hover. Never hardcode hex.

[Block 4b — Design Tokens]
Spacing base 0.25rem. Radius LG 1rem (credential card). Chips: radius-full, 1px border. Pull-quote: Cardo
serif, blue 2px left-rule. Focus: 2px solid --ring.

[Block 4c — Variant Directive]
REFINEMENT: keep the asymmetric grid; explore the credential block as a card vs. an inline list.

[Block 5 — Style Directives]
High-fidelity desktop web. Editorial executive warmth; one Cardo serif accent (the quote). Concrete,
specific copy; no filler.

[Block 6 — Negative Prompts]
Avoid: lavender/mint/yellow, white backgrounds, glassmorphism, neon, emoji-as-icons, clip art, full-pill
CTAs, SMB framing, vague buzzwords, lorem ipsum, system fonts.

[Block 7 — Background/Frame]
Desktop browser viewport only on deep-navy --background. No device frame, no angle, no desk scene.
```

---

## P4 — PORTFOLIO DETAIL: Amazon Labor Union  (`/portfolio/amazon-labor-union-digital-transformation`)

```
[Block 0 — Agent Context]
You are the Case-Study Narrative Architect for Dame Luthas. You structure an engagement as
Challenge → Approach → Solution → Results with outcomes surfaced as stat callouts.

[Block 1 — Brand Preamble]
Dame Luthas — Technology Leader & AI Strategist portfolio. Demographic: hiring execs, recruiters,
enterprise stakeholders. Platform: desktop-first responsive web (Next.js + Tailwind v4, FSD). Vibe:
senior, enterprise, quiet authority.

[Block 2 — Subject]
The Amazon Labor Union "Digital Transformation" case-study detail page.

[Block 3 — Scene]
A reader who clicked from the index wants the story and the proof: what the problem was, what was done,
and the measurable result — with captioned visuals as evidence.

[Block 3b — Target Personas]
Enterprise hiring exec · transformation sponsor · recruiter verifying depth.

[Block 3c — Layout Spec]
1) Sticky header (as P1). 2) Detail hero: breadcrumb "Home / Case Studies / Amazon Labor Union";
metadata row "Client · Scope · Role · Year"; Outfit-800 title; one-line summary. 3) Narrative spine —
4 stacked sections (Outfit-600 heading + body): Challenge → Approach → Solution → Results. 4) Stat
callouts (in/after Results): large primary stats "300% increase in petitions", "120% fundraising
growth"; cyan used once for the single headline result. 5) Gallery: 2–3 col grid, EACH image captioned
with its strategic role. 6) Cardo serif client pull-quote, attributed. 7) Prev/Next portfolio nav
(bordered, blue hover). 8) Footer.

[Block 3d — Responsive Context]
Desktop 1440 (gallery 3-col, spine single-col centered max-w-prose) → 768 (gallery 2-col) → 390 (1-col).

[Block 3e — Component Target]
src/app/portfolio/[slug]/page.tsx → src/widgets/portfolio/PortfolioDetail.tsx (+ GalleryGrid,
PortfolioInfo, PortfolioNav).

[Block 4 — Brand Colors]
Primary: Electric Blue → tokens.colors.primary.DEFAULT (--primary) [stats, links] · Secondary: Navy
Surface → tokens.colors.surface (--surface) · Accent: Cyan → tokens.colors.accent.DEFAULT (--accent)
[headline result only] · Background: Deep Navy → tokens.colors.background (--background) · Text: White /
Muted → tokens.colors.foreground / mutedForeground. Never hardcode hex.

[Block 4b — Design Tokens]
Spacing base 0.25rem; section rhythm py-16→20. Radius LG 1rem (gallery images, cards). Stat numbers:
Outfit-800, tabular-nums, primary. Focus: 2px solid --ring.

[Block 4c — Variant Directive]
REFINEMENT: lock the Challenge→Results spine; explore stat-callout placement (inline band vs. results card).

[Block 5 — Style Directives]
High-fidelity desktop web. Reading-optimized spine (comfortable measure), evidence-forward gallery with
captions, outcomes in primary blue, one cyan highlight. Hairline borders, restrained motion.

[Block 6 — Negative Prompts]
Avoid: lavender/mint/yellow, white backgrounds, glassmorphism, neon, emoji-as-icons, uncaptioned image
dumps, clip art, full-pill CTAs, SMB framing, lorem ipsum, system fonts.

[Block 7 — Background/Frame]
Desktop browser viewport only on deep-navy --background. No device frame, no angle, no desk scene.
```

---

## P5 — PORTFOLIO DETAIL: Gatorade Generative-AI Bottle Design  (`/portfolio/gatorade-embraces-generative-ai-powered-bottle-design`)

```
[Block 0 — Agent Context]
You are the Case-Study Narrative Architect for Dame Luthas. You structure this generative-AI engagement
as Challenge → Approach → Solution → Results; the AI artwork is the only saturated color on the page.

[Block 1 — Brand Preamble]
Dame Luthas — Technology Leader & AI Strategist portfolio. Demographic: hiring execs, recruiters,
enterprise stakeholders. Platform: desktop-first responsive web (Next.js + Tailwind v4, FSD). Vibe:
senior, enterprise, quiet authority.

[Block 2 — Subject]
The Gatorade "Generative-AI-Powered Bottle Design" case-study detail page.

[Block 3 — Scene]
A reader evaluating AI-strategy depth wants the business problem, the gen-AI approach, and the result —
with the generated bottle artwork shown as proof, framed by the restrained navy/blue system.

[Block 3b — Target Personas]
Enterprise hiring exec · AI/innovation lead · recruiter verifying applied-AI depth.

[Block 3c — Layout Spec]
Identical structure to P4. 1) Sticky header. 2) Detail hero: breadcrumb "Home / Case Studies / Gatorade";
metadata "Client: Gatorade · Scope: Generative-AI Product Design · Role: AI Strategist · Year";
Outfit-800 title; one-line summary. 3) Spine: Challenge (on-brand individualized bottle art at scale) →
Approach (a generative-AI design pipeline + brand guardrails) → Solution → Results. 4) Stat callouts:
primary-blue stats for design throughput / engagement lift; ONE cyan headline metric. 5) Gallery: grid
of vivid AI-generated bottle designs (lightning-bolt: sport, abstract, character themes), EACH captioned
with theme/use — the artwork is the only saturated color. 6) Cardo serif pull-quote. 7) Prev/Next nav. 8) Footer.

[Block 3d — Responsive Context]
Desktop 1440 (gallery 3-col) → 768 (2-col) → 390 (1-col). Bottle images keep 3:4 aspect.

[Block 3e — Component Target]
src/app/portfolio/[slug]/page.tsx → src/widgets/portfolio/PortfolioDetail.tsx (+ GalleryGrid,
PortfolioInfo, PortfolioNav).

[Block 4 — Brand Colors]
Primary: Electric Blue → tokens.colors.primary.DEFAULT (--primary) · Secondary: Navy Surface →
tokens.colors.surface (--surface) · Accent: Cyan → tokens.colors.accent.DEFAULT (--accent) [headline
metric only — keep the chrome restrained so the bottle artwork pops] · Background: Deep Navy →
tokens.colors.background (--background) · Text: White / Muted → tokens.colors.foreground / mutedForeground.
Never hardcode hex.

[Block 4b — Design Tokens]
Spacing base 0.25rem. Radius LG 1rem (gallery cards). Stat numbers Outfit-800 primary. Gallery image
frame: 1px --border. Focus: 2px solid --ring.

[Block 4c — Variant Directive]
REFINEMENT: keep the P4 spine; explore the gallery as a masonry vs. uniform grid for the bottle artwork.

[Block 5 — Style Directives]
High-fidelity desktop web. Restrained navy/blue chrome so the saturated AI bottle artwork is the visual
focus. Outcomes in primary blue, one cyan highlight. Captions on every image. Hairline borders.

[Block 6 — Negative Prompts]
Avoid: lavender/mint/yellow chrome, white backgrounds, glassmorphism, neon UI, emoji-as-icons,
uncaptioned image dumps, clip art, full-pill CTAs, SMB framing, lorem ipsum, system fonts.

[Block 7 — Background/Frame]
Desktop browser viewport only on deep-navy --background. No device frame, no angle, no desk scene.
```

---

### Usage
1. Open Google Stitch → new desktop/web design.
2. Paste one P-prompt (already 13-block complete). Generate.
3. Iterate: regenerate any section that drifts toward lavender / pills / SMB framing / glassmorphism.
4. Export; compare color/spacing against shipped tokens (`src/app/globals.css`, `src/shared/design/tokens.ts`).
5. For code conversion, Block 3e names the FSD destination file for each screen.
