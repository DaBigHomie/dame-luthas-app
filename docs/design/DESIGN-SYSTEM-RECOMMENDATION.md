# Design System Recommendation — Dame Luthas Portfolio
### "Luthas Enterprise" — replaces the stale *Royal Nightlife* spec

**Target site (the one being redesigned):** https://dameluthas.damieus.app — the `*.vercel.app` URLs are previews of this same app.
**Brand references only (NOT the subject):** [damieus.com](https://damieus.com/), [showcase.damieus.app](https://showcase.damieus.app/) — Dame's other projects, used as the palette/brand source.
**Status:** Recommendation for review (not yet applied to code).
**Produced by:** 40x design-system review — 4 parallel reviewers (codebase audit · live site · showcase.damieus.app · damieus.com) → opus synthesis → a11y/fit critique.
**Method note:** Brand token values are **verified against the real sibling repo** `damieus-com-migration/src/index.css` — not asserted. They are the single source of brand truth across Dame's projects.
**Provenance / honesty:** Headless `WebFetch` was **blocked** (`dameluthas.damieus.app` → HTTP 403; `damieus.com` → no CSS, JS-rendered), so the workflow's "live" reviews were really code-grounded and its "live damieus.com palette" hexes (`#4DA6FF`, magenta logo, colored service cards) were **discarded** as unverified. The live site was then **verified directly via an authenticated Chrome session** (2026-06-11), which confirmed: white-card hero on the dark canvas, lavender `#8f93f1` "Let's talk" CTA + "SERVICES 0X/03" labels, the UN/WHO/UNICEF/UN Women/MSG client marquee under "trusted United Nations advisor", and an SMB "BUILD YOUR DREAM / Be Your Own Boss" services block. It also surfaced **two layout bugs** not visible in code review: the hero headline **overflows its card** ("TOGETHE[R]" clipped) and the "Utilizing experience and creativity…" text band renders with **overlapping columns**. Every contrast ratio below is computed by `scripts/design/audit-contrast.mts` (**all required checks PASS**), not estimated.

---

## TL;DR — the one-line problem and the fix

> **The content is CTO-level; the design speaks mid-market WordPress agency.**

Every decision here closes that gap by borrowing the **Damieus brand cues** from Dame's reference sites (damieus.com, showcase.damieus.app) into the **Dame Luthas portfolio**: deep blue-navy canvas, one decisive **electric-blue** accent, a sparing **cyan**, and disciplined restraint — while keeping the genuinely strong bones already in the repo (dark-first, Outfit 800, large radii, well-built reduced-motion).

**Drop (TheGem WordPress inheritance):** lavender `#8f93f1`, mint `#a9fdff`, yellow `#f7df3d`, footer lavender `#cecee8`, the yellow/lavender contact panel, the white footer bar.
**Adopt (Damieus, verified):** navy `222 47% 6%`, electric blue `217 91% 60%`, cyan `187 100% 42%`, dark-on-primary text, intentional glow, `-foreground` token convention.

---

## 1. Positioning principles

1. **Authority through restraint, not ornament.** The audience is time-pressed hiring execs. Senior brands (Linear, Vercel, Stripe, McKinsey Digital, and Damieus itself) read serious because they are *quiet*. Default to fewer colors, fewer motion gestures, more whitespace.
2. **Proof is the hero; design is the frame.** The differentiated asset is the evidence — UN/WHO/UNICEF logos, "70% outage reduction," "50% faster go-live," M365 E5 migrations. The system's job is to make that scannable in 5 seconds via stat callouts and structured case sections.
3. **One decisive accent, used with intent.** Replace muted "hobby lavender" with Damieus electric blue `217 91% 60%`, plus a sparing cyan for data/highlights. Accent appears on CTAs, links, focus rings, section rules, and stat numbers — deliberately, not everywhere.
4. **Dark-canvas enterprise, not dark-mode novelty.** Keep the near-black canvas (correct, competitive), but unify it onto Damieus' blue-navy. The hero's white card currently breaks the dark register — remove it.
5. **Engineered, not templated.** The reveal/letter/word motion and reduced-motion hygiene are genuinely well-built — keep them as evidence of engineering care. Remove only the gestures that read "creative agency" (rotating decorative circle, 3D filter flip).

---

## 2. Color system

### Decisions
- **KEEP the dark canvas** — but shift from flat `#0f0f0f` to Damieus blue-navy `222 47% 6%` (`#080c16`). Richer, brand-aligned, preserves contrast.
- **DROP lavender `#8f93f1`** as primary (the single biggest brand mismatch — names the TheGem origin). Replace with electric blue.
- **DROP mint `#a9fdff`** (dead token) — reintroduce its *role* as a controlled cyan accent only.
- **DROP yellow `#f7df3d` and footer lavender `#cecee8`** entirely — the most dissonant "street-flyer" elements.

### Token format: HSL + `-foreground`, matching Damieus
Use **HSL channel tokens** and the shadcn-style `-foreground` convention exactly as `damieus-com-migration` does. This guarantees cross-project cohesion **and** resolves the `text-muted`/`bg-muted` naming collision (foreground roles are explicitly `*-foreground`, never bare `muted`).

### Palette (verified against `damieus-com-migration/src/index.css`)

| Role | Token (HSL) | Hex approx | Use | Contrast |
|---|---|---|---|---|
| `background` | `222 47% 6%` | `#080c16` | Page canvas | base |
| `surface` (`card`) | `222 47% 8%` | `#0b111e` | Cards | — |
| `elevated` (`popover`) | `222 47% 10%` | `#0e1525` | Dropdowns, modals, filter menu | — |
| `foreground` | `0 0% 100%` | `#ffffff` | Primary text | 19.5:1 on bg ✓ AAA |
| `muted-foreground` | `222 14% 70%` | `#a8aebd` | Secondary/metadata | 8.8:1 ✓ AAA |
| `border` | `222 18% 46%` | `#606d8a` | **Interactive** outlines (inputs, focusable cards) | **3.6–3.8:1 ✓ 1.4.11** |
| `border-subtle` | `222 30% 18%` | `#202a3e` | **Decorative-only** dividers (non-interactive) | exempt (1.4.11 governs UI/interactive only) |
| **`primary`** | `217 91% 60%` | `#3b82f6` | CTAs, links, focus, active pills, stat numbers | 5.4:1 as text on bg ✓ |
| `primary-foreground` | `222 47% 6%` | `#080c16` | **Text/icon ON primary fills** (dark, per Damieus) | **5.4:1 ✓ AA** |
| `primary-hover` | `217 91% 55%` | `#2f74e6` | Hover/press | — |
| `primary-soft` | `217 50% 16%` | `#14243d` | Tinted pill/badge background | white text 15.6:1 ✓ |
| **`accent`** (cyan) | `187 100% 42%` | `#00bdd6` | Sparing data/highlight (status dot, chart, one case tag) | 8.6:1 on bg ✓ |
| `success` | `142 71% 45%` | `#21c45d` | Up metrics / verified | 8.5:1 ✓ |
| `warning` | `38 92% 50%` | `#f59f0a` | Caution (text/icon on dark only) | 9.2:1 ✓ |
| `error` | `0 91% 71%` | `#f87272` | Form errors | 7.1:1 ✓ |
| `info` | `199 92% 60%` | `#38bdf8` | Informational notes | distinct from primary |
| `ring` | `217 91% 60%` | `#3b82f6` | Focus outline color | 2px solid (§4) |

> **WCAG must-fix folded in (all verified by `audit-contrast.mts`):** primary is **never** used as white-text-on-blue at body sizes (that combo is **3.6:1 — fails**, confirmed). Per Damieus' own `--primary-foreground`, **text/icons on a primary fill are dark navy** (`primary-foreground`, **5.4:1 ✓**). Small accent text on dark uses `primary` directly (**5.4:1 ✓**). `accent`/`success`/`warning`/`error`/`info` all clear **≥7:1 on bg**. `border` (interactive) is **3.6–3.8:1 on bg/surface/elevated** (meets 1.4.11); the lighter `border-subtle` (1.3:1) is scoped to **decorative, non-interactive** dividers only, which 1.4.11 does not govern.

### `src/app/globals.css` — `:root` + `@theme`

```css
:root {
  /* canvas + surfaces (Damieus blue-navy) */
  --background: 222 47% 6%;
  --surface: 222 47% 8%;
  --elevated: 222 47% 10%;

  /* text */
  --foreground: 0 0% 100%;
  --muted-foreground: 222 14% 70%;

  /* borders */
  --border: 222 18% 46%;          /* interactive: inputs, focusable cards (3.6:1 verified) */
  --border-subtle: 222 30% 18%;   /* decorative dividers only */

  /* primary (electric blue) — dark text on fills, per Damieus */
  --primary: 217 91% 60%;
  --primary-foreground: 222 47% 6%;
  --primary-hover: 217 91% 55%;
  --primary-soft: 217 50% 16%;

  /* accent (cyan) + functional */
  --accent: 187 100% 42%;
  --accent-foreground: 222 47% 6%;
  --success: 142 71% 45%;
  --warning: 38 92% 50%;
  --error: 0 91% 71%;
  --info: 199 92% 60%;

  /* focus + glow (Damieus) */
  --ring: 217 91% 60%;
  --glow-primary: 0 0 40px hsl(217 91% 60% / 0.3);
  --glow-soft: 0 0 20px hsl(217 91% 60% / 0.15);

  --container-max: 1170px;

  /* legacy aliases kept until widgets migrate */
  --bg: hsl(var(--background));
  --text: hsl(var(--foreground));

  /* REMOVED (TheGem): --dl-accent #8f93f1, --dl-cta-mint, --dl-footer-yellow,
     --dl-footer-lavender, --dl-yellow, --dl-lavender, --dl-footer-bar-* */
}

@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-surface: hsl(var(--surface));
  --color-elevated: hsl(var(--elevated));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-border: hsl(var(--border));
  --color-border-subtle: hsl(var(--border-subtle));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-accent: hsl(var(--accent));
  --color-success: hsl(var(--success));
  --color-warning: hsl(var(--warning));
  --color-error: hsl(var(--error));
  --color-info: hsl(var(--info));

  --font-sans: var(--font-outfit), system-ui, sans-serif;
  --font-serif: var(--font-cardo), Georgia, serif;
}
```

This enables semantic utilities — `bg-surface text-muted-foreground border-border text-primary-foreground bg-primary` — replacing scattered `bg-white/5 border-white/10 text-zinc-300`.

### `tokens.ts` — make it a real SSOT
`src/shared/design/tokens.ts` currently ships Inter + JetBrains Mono, a `#0a0a0f` background, and an unused HSL-220 blue scale — **none of which run**. Rewrite it to mirror `globals.css` 1:1 (or delete it). See migration §7.

---

## 3. Typography

**KEEP Outfit. ACTIVATE Cardo (one canonical use). DELETE the Inter/JetBrains references in `tokens.ts`.** Outfit 800 uppercase reads authoritative and modern — every reviewer endorsed it; do not switch to Inter/Cormorant/Syncopate. Cardo is loaded but unused — activate it **only** for testimonial pull-quotes (one decisive editorial face).

| Token | Font · size | Weight | Casing | Use |
|---|---|---|---|---|
| `display` | Outfit · `clamp(40px,6.5vw,96px)` · lh 1.05 | 800 | UPPERCASE | Hero H1 (`.dl-typography-hero-h1`) |
| `h1` | Outfit · `clamp(36px,4.6vw,64px)` · lh 1.12 | 800 | UPPERCASE | Section anchors |
| `h2` | Outfit · `clamp(28px,3vw,40px)` · lh 1.2 | 700 | Sentence | Page titles (About, Case Studies) |
| `h3` | Outfit · `24px` · lh 1.3 | 600 | Sentence | Card titles |
| `h4` | Outfit · `18px` · lh 1.4 | 600 | Sentence | Sub-labels |
| `eyebrow` | Outfit · `14px` · tracking `0.18em` | 600 | UPPERCASE, color `primary` | Section eyebrows, credential tags |
| `body-lg` | Outfit · `18px` · lh 1.65 | 400 | — | Lead paragraphs |
| `body` | Outfit · `16px` · lh 1.6 | 400 | — | Default (`muted-foreground`) |
| `caption` | Outfit · `13px` · tracking `0.04em` | 500 | — | Metadata, captions |
| `stat` | Outfit · `clamp(40px,5vw,72px)` · lh 1 | 800 | tabular-nums, color `primary` | **New** metric callouts |
| `quote` | **Cardo** · `clamp(22px,2.4vw,30px)` · lh 1.4 | 400 | — | Testimonial pull-quotes (only Cardo use) |

> **Resolved:** the eyebrow is **one** canonical value (Outfit 600 uppercase — more authoritative than Cardo italic). The new `stat` and `quote` tokens convert buried evidence into scannable authority.

---

## 4. Spacing, radius, elevation, motion

**Restraint:** a tight token set used consistently. Kill the `px-[21px]` TheGem magic number → map to `px-6`.

**Spacing** — Tailwind 4px scale. Sections `py-20 lg:py-28` (80/112px). Container `max-w-[var(--container-max)]` (1170px) + `px-6`. Cards `p-6 lg:p-8`. Grid `gap-6 lg:gap-8`.

**Radius**
```
--radius-sm: 0.5rem;   /* chips, inputs */
--radius-md: 0.75rem;  /* buttons — drop the 25px pill on CTAs */
--radius-lg: 1rem;     /* cards */
--radius-xl: 1.5rem;   /* major sections (tighten from 2rem) */
--radius-full: 9999px; /* filter pills, status dots only */
```
Move CTAs from the `25px` `gem-button` pill to `--radius-md` soft-rectangle. Full pills read consumer; soft rectangles read enterprise (Linear/Vercel/Damieus). Keep `rounded-full` for filter pills + marquee only.

**Elevation** — on dark canvas, elevation = surface lightness + hairline border, not heavy shadows. Replace `shadow-2xl`.
```
--elev-1: 0 1px 0 0 hsl(var(--border));            /* card: border-led */
--elev-2: 0 8px 24px -8px rgb(0 0 0 / 0.5);        /* hover lift */
```

**Focus (WCAG 2.4.7/2.4.11 must-fix)** — the glow alone is invisible at 40% on dark. Use a **solid 2px outline** as the real focus indicator; keep glow as supplemental hover only:
```css
:where(a, button, [role="button"], input, textarea, select):focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
```

**Motion** — standardize tokens; keep the good system, remove two gestures.
```
--dur-fast:150ms; --dur-normal:300ms; --dur-slow:500ms;
--ease-out: cubic-bezier(0.22,1,0.36,1);
```
- **KEEP:** `letters-slide-up`, `words-slide-left` (retune spring to `--ease-out`, less bounce), scroll reveals, nav underline, card hover, marquee — all with existing reduced-motion fallbacks.
- **REMOVE:** ContactFormBlock rotating circle (`dlGemRotate`); portfolio filter 3D flip (`MenuAnimIn/MenuAnimOut` in `portfolio-filters.css` — **preserve** the benign `dlGemFilterSpin`).
- **ADD:** count-up on `stat` numbers on enter-view (respect reduced-motion).

---

## 5. Component direction

- **Header / nav** — keep sticky + `backdrop-blur`, on navy `bg-background/80` with `border-b border-border-subtle`. Links Outfit 500 uppercase `muted-foreground` → `foreground` on hover, primary underline slide. CTA = `--radius-md` primary button (dark text), e.g. "Book a discovery call."
- **Hero** — remove the white card; one dark register. Left: eyebrow + display H1 + one-line proof subhead + primary CTA + ghost CTA. Right: headshot in `rounded-xl` frame with subtle `--glow-soft` edge. Replace "Web Design / Web Dev / Web Hosting" with **"Cloud Architecture · AI Automation · Digital Transformation."** Add a **stat strip** (3–4 metrics) beneath — fastest ROI change.
- **Case-study card** — `bg-surface border border-border rounded-lg p-6`; hover `--elev-2` + `border-primary/40`. Add metadata row (client · scope · year · headline metric) + "Read case study →". Cyan reserved for a single "Enterprise" tag.
- **Portfolio card** — keep 2→3-col grid; **caption every image** (12 currently uncaptioned). Filter pills `rounded-full`; active = `primary-soft` bg + white text + `primary` border.
- **Buttons** — three variants: **primary** (filled `primary`, **dark `primary-foreground` text**, `--radius-md`), **secondary** (ghost `border-border`, `foreground`, hover `border-primary`), **link** (`primary` underline-on-hover). All get the 2px focus outline.
- **Footer** — **remove the white `dl-gem-footer-bar` inversion**; footer stays on `background` with `border-t border-border-subtle`. Add secondary nav (Expertise · Case Studies · Contact), a credential line, social links.
- **Forms (ContactFormBlock — top-priority fix)** — **delete the yellow+lavender split panel**. One `bg-surface border border-border rounded-xl` card: left = value statement + one proof point; right = the form. Inputs `bg-elevated border border-border`, focus `border-primary` + 2px outline, visible `error`/success states, a "replies within 24h" trust line.

---

## 6. Per-page redesign direction

**Home** — one dark hero (no white card — which also **fixes the live hero text-overflow clip**); headshot + glow; C-suite rotating phrases; **stat strip** ("70% fewer outages · 50% faster go-live · 15–20 hrs/wk automated · 6 UN agencies advised"); credibility headline above the client marquee ("Technology advisor to United Nations agencies and global enterprises"); **rebuild the "Utilizing experience and creativity…" text band** (currently renders with overlapping columns — a visible bug) as a clean single-column statement; **stratify or cut SMB services** — the live homepage drops from AI into "Web Hosting / WordPress / SEO" and a full "BUILD YOUR DREAM / Be Your Own Boss / Sales Funnels" block; lead instead with Cloud Migration · AI Strategy · Enterprise Architecture · Program Leadership.

**About** — keep asymmetric 2-col; restyle credential block to `bg-surface border-border`; replace vague "organizational harmonization" with concrete expertise chips (Global Cloud Migrations · Enterprise Architecture · AI-Driven Automation · Program Management); add a Cardo pull-quote + compact certifications row.

**Case Studies index** — restyle cards to new surface/border; give the `All ▾` filter real `elevated` dropdown styling + active feedback; add per-card metadata + cyan "Enterprise" tag.

**Portfolio detail (Amazon Labor Union, Gatorade AI)** — add the missing narrative spine **Challenge → Approach → Solution → Results** above the gallery; surface outcomes as `stat` callouts (e.g. ALU 300% petitions / 120% fundraising); caption every gallery image; add a Cardo client pull-quote + metadata header (client · duration · scope); cyan used once for the headline result.

---

## 7. Migration notes (this REPLACES the Royal Nightlife spec)

`.github/instructions/design-system.instructions.md` ("Royal Nightlife": Electric Blue `#2563EB`, Cormorant Garamond, Wyze Ink, Ausome Angels) — **none exist in this codebase**; it misdirects agents. Replace it with a new **"Luthas Enterprise"** spec reflecting §2–4.

**Order of change (low-risk → higher-touch):**

0. **Prereq — create `src/shared/utils/cn.ts`** (`clsx` + `twMerge` wrapper). Both specs deferred this; new `Stat`/`PullQuote` components need it.
1. **Kill BOTH orphan token files.** Rewrite `src/shared/design/tokens.ts` to mirror §2 (drop Inter/JetBrains/HSL-220). **Also `src/shared/lib/design-tokens.ts`** is a second dead TheGem SSOT hardcoding `accent #8F93F1`, `yellow #F7DF3D`, `lavender #CECEE8`, `radius.button "25px"`, `sectionPaddingX "21px"` — delete or rewrite it; if left intact an agent will reinstate the wrong values.
2. **Update `globals.css` `:root` + `@theme`** to §2; remove `--dl-cta-mint`, `--dl-footer-yellow`, `--dl-footer-lavender`, `--dl-yellow`, `--dl-lavender`, `--dl-footer-bar-*`. Repoint `.gem-button` / `.portfolio-filter.active` from lavender to `hsl(var(--primary))`.
3. **Replace the Royal Nightlife instructions file** so agents stop pulling wrong tokens.
4. **Swap hardcoded utilities** (`bg-white/5`, `border-white/10`, `text-zinc-300/400`, `px-[21px]`) for semantic tokens across widgets.
5. **Redesign ContactFormBlock AND `ContactFormFields.tsx`** (highest-visibility fix). The wrapper is not enough: `ContactFormFields.tsx` hardcodes `text-black`, `text-black/70`, `placeholder:text-black/45`, and `dl-gem-form-underline`; `forms.css` `.dl-gem-form-underline` uses `border-bottom: 1px solid rgb(0 0 0 / 0.3)` and `.dl-gem-form-submit` uses the white `--dl-footer-bar-bg`. On the dark `elevated` input bg these render invisible. Replace all of them with dark-theme tokens. (Note: the form currently "sends" via a `mailto:` href — confirm intent or scope a real endpoint before promising a success state.)
6. **Fix the hero** white-card disconnect; **restyle footer** — remove the `dl-gem-footer-bar` class from `FooterBottomBar.tsx` **and** update `footer-bar.css` together (changing only one leaves the white bar).
7. **Add components:** `Stat` (count-up + reduced-motion), Cardo `PullQuote`, structured case-study section blocks.
8. **Update content:** rotating phrases, service stratification, marquee credibility headline, expertise chips.
9. **Remove motion liabilities:** `dlGemRotate` circle, `MenuAnimIn/MenuAnimOut` flip (keep `dlGemFilterSpin`).
10. **Verify gates:** `tsc --noEmit`, `lint`, `build`, Playwright; re-check WCAG AA on shipped tokens.

**Net effect:** same strong bones (dark canvas, Outfit, large radii, well-built motion); the TheGem WordPress signals are gone; the brand reads as a purpose-built enterprise AI-strategist portfolio aligned with Damieus.

---

### Source files
- `src/app/globals.css` · `src/shared/design/tokens.ts` · `src/shared/lib/design-tokens.ts` (2nd orphan) · `.github/instructions/design-system.instructions.md` (replace)
- Brand truth: `damieus-com-migration/src/index.css` (verified)
- Form targets: `src/widgets/ContactFormFields.tsx` · `src/shared/design/thegem/remix/forms.css`
- Footer targets: `src/widgets/FooterBottomBar.tsx` · `src/shared/design/thegem/remix/footer-bar.css`
