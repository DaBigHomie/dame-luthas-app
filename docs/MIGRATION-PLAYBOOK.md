# MIGRATION-PLAYBOOK.md

**WordPress → Next.js migration, repeatable across sites.**

| Adapter | Status | Source theme |
|---------|--------|--------------|
| **TheGem / Elementor** | Complete (site 1: `dameluthas.local`) | `thegem-elementor` + Elementor Pro |
| **JNews** | Scaffolded — [docs/adapters/JNEWS-ADAPTER.md](./adapters/JNEWS-ADAPTER.md) | `jnews` + WPBakery / Gutenberg |

## How to use

Run phases 1–10 in order per site. The **core** (phases 1, 2, 4, 5, 7, 8, 9, 10) is theme-agnostic. Only **Phase 3 (census detector + registry)** and **Phase 2 (GraphQL adapter)** differ per theme.

```
Site 1: dameluthas.local  → adapter: thegem   (TheGem + Elementor + Elementor Pro)
Site 2: <jnews site>      → adapter: jnews     (JNews + WPBakery/Gutenberg)
Site 3: <jnews site>      → adapter: jnews
```

**Detect the theme first:** inspect `/wp-content/themes/<name>/` in source.

- `thegem-elementor` → **thegem** adapter (this doc)
- `jnews` → **jnews** adapter ([JNEWS-ADAPTER.md](./adapters/JNEWS-ADAPTER.md))

**Ground truth (TheGem):** Elementor exposes widget identity as `data-widget_type` in rendered HTML. Any marker with no registry entry = a missing component — the guardrail that ends silent drops.

---

## Phase 1 — Discover ALL public endpoints

Never audit just the homepage. Single-template scans miss single/archive/CPT-detail layouts, which is where missing components hide.

**Sources (theme-agnostic):**

- Sitemap: `/wp-sitemap.xml`, `/sitemap.xml`, `/sitemap_index.xml`
- GraphQL `uri` fields on pages, posts, CPTs
- `robots.txt` / manual route matrix

**This repo:**

```bash
npm run wp:audit-source -- http://dameluthas.local/
# → data/audit/source-audit.json, source-audit.md
```

**Phase 1b — public route matrix (Next vs WP):**

| WP URL | Next route | Backlog |
|--------|------------|---------|
| `/` | `/` | — |
| `/contact/` | `/contact` | `task_luthas_wp_035` |
| `/case-studies/` | `/case-studies` | `task_luthas_wp_036` |
| `/pf/{slug}/` | `/portfolio/{slug}` | `task_luthas_wp_037`–`039` |

Planned: `npm run verify:public-routes` — see [docs/tasks/MIGRATION-BACKLOG.md](./tasks/MIGRATION-BACKLOG.md).

**Endpoint discovery pattern (for full-site audit scripts):**

```ts
// scripts/lib/discover-urls.ts (reference — implement per project)
export async function discoverUrls(page: any, SITE: string) {
  const urls = new Set<string>();
  for (const sm of ["/wp-sitemap.xml", "/sitemap.xml", "/sitemap_index.xml"]) {
    try {
      const xml = await (await page.request.get(SITE + sm)).text();
      [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].forEach((m) => urls.add(m[1]));
      for (const child of [...xml.matchAll(/<loc>([^<]+\.xml)<\/loc>/g)].map((m) => m[1])) {
        try {
          const cx = await (await page.request.get(child)).text();
          [...cx.matchAll(/<loc>([^<]+)<\/loc>/g)].forEach((m) => urls.add(m[1]));
        } catch { /* child sitemap optional */ }
      }
    } catch { /* sitemap optional */ }
  }
  return [...urls];
}
```

---

## Phase 2 — Configure GraphQL (TheGem adapter)

Install **WPGraphQL** on the source. Confirm `/graphql` returns `{ __typename }` → `RootQuery`.

**Generic fields (any theme):** `contentTypes`, `menus`, `posts { content excerpt featuredImage }`, `pages`, `categories`, `tags`.

**TheGem / Elementor — expose Elementor data** for full widget settings (unlocks content rendered HTML truncates, e.g. testimonial quotes):

```php
// wp-content/themes/{child}/functions.php on SOURCE WP only
add_action('init', function () {
  register_post_meta('page', '_elementor_data', [
    'show_in_graphql' => true,
    'single'            => true,
    'type'              => 'string',
    'auth_callback'     => function () { return current_user_can('edit_posts'); },
  ]);
});
```

Install **WPGraphQL for Elementor** when available. To extract: query meta → `JSON.parse` → walk tree for `widgetType: "thegem-testimonials"` etc.

**DB fallback:**

```sql
SELECT meta_value FROM wp_postmeta
WHERE post_id = <id> AND meta_key = '_elementor_data';
```

**This repo:**

```bash
npm run wp:install-graphql
npm run wp:probe-schema
```

**JNews:** see [JNEWS-ADAPTER.md](./adapters/JNEWS-ADAPTER.md) — Phase 2 GraphQL config is TBD after live audit.

---

## Phase 3 — Census detector + registries (TheGem adapter)

The census reads the builder's per-block marker on **every URL** from Phase 1. Any marker with no registry entry = missing component.

### TheGem census marker: `data-widget_type`

```ts
export const censusThegem = () => {
  const widgets: Record<string, number> = {};
  document.querySelectorAll("[data-widget_type]").forEach((el) => {
    const w = el.getAttribute("data-widget_type")!;
    widgets[w] = (widgets[w] || 0) + 1;
  });
  const elements: Record<string, number> = {};
  document.querySelectorAll("[data-element_type]").forEach((el) => {
    const t = el.getAttribute("data-element_type")!;
    elements[t] = (elements[t] || 0) + 1;
  });
  return { widgets, elements };
};
```

**Single source of truth:** `scripts/wp/lib/widget-registry.ts`

| `component` | Meaning |
|-------------|---------|
| `"AnimatedHeading"` | Handled by named React widget |
| `null` | **Explicit skip** (template chrome, dividers) |

**Rule:** No registry entry = silent drop during extract = missing container.

```bash
npm run wp:verify-widget-census   # exit 1 if unmapped types vs source-audit.json
```

### TheGem `WIDGET_REGISTRY` (site-wide — homepage + contact + case-studies + portfolio singles)

Built from **site-wide** census, not one page. Keep `scripts/wp/lib/widget-registry.ts` in sync with this table.

| `data-widget_type` | Component | Source | Notes |
|--------------------|-----------|--------|-------|
| `thegem-animated-heading.default` | `AnimatedHeading` | thegem | Homepage |
| `thegem-styledimage.default` | `StyledImage` | thegem | |
| `thegem-styledbutton.default` | `AnimatedButton` | thegem | |
| `thegem-custom-menu.default` | `ServiceCard` | thegem | |
| `thegem-clients.default` | `LogoMarquee` | thegem | |
| `thegem-testimonials.default` | `TestimonialsCarousel` | thegem | Full quotes need `_elementor_data` |
| `thegem-portfolio.default` | `PortfolioGrid` | thegem | |
| `thegem-contact-form7.default` | `ContactFormBlock` | cf7 | |
| `social-icons.default` | `SocialIcons` | elementor-pro | |
| `divider.default` | — (skip) | elementor | Decorative |
| `thegem-template-logo.default` | `Header` | thegem | |
| `thegem-template-menu.default` | `Header` | thegem | |
| `text-editor.default` | `RichText` / skip | elementor | Surfaced on `/contact/` |
| `heading.default` | `AnimatedHeading` | elementor | |
| `image.default` | `StyledImage` | elementor | |
| `icon-list.default` | `IconList` | elementor | Contact page |
| `html.default` | `RawHtml` | elementor | |
| `thegem-team.default` | `TeamMember` | thegem | Contact page |
| `spacer.default` | `Spacer` | elementor | Portfolio singles |
| `thegem-diagram.default` | `Diagram` | thegem | Portfolio singles |
| `thegem-gallery-grid.default` | `GalleryGrid` | thegem | Portfolio singles |
| `thegem-template-portfolio-info.default` | `PortfolioInfo` | thegem | |
| `thegem-template-portfolio-title.default` | `PortfolioTitle` | thegem | |
| `thegem-template-portfolio-excerpt.default` | `PortfolioExcerpt` | thegem | |
| `thegem-template-portfolio-content.default` | `PortfolioContent` | thegem | |
| `thegem-template-portfolio-navigation.default` | `PortfolioNav` | thegem | |
| `thegem-template-post-title.default` | — (skip) | thegem | Template chrome |
| `thegem-template-loop-post-content.default` | — (skip) | thegem | Template chrome |
| `thegem-custom-fields.default` | — (skip) | thegem | Template meta |

### TheGem `TEMPLATE_REGISTRY`

| Kind | Template names (examples) |
|------|---------------------------|
| header | Header-01, Header 02 (Demo), Header Sticky-01, Mobile Nav (Demo) |
| footer | Footer (Demo), Footer 02 (Demo) |
| single | Single Post 23, Blog Post (Demo) |
| archive | Portfolio Page (Demo) |
| loop | Testimonials Loop Item (Demo) — renders **one** testimonial; explains truncated homepage quotes |
| title | Title Area 01 (Demo) |
| other | Digital Marketing, Draft Template |

**JNews:** `BLOCK_REGISTRY` — see [JNEWS-ADAPTER.md](./adapters/JNEWS-ADAPTER.md).

---

## Phase 4 — Comprehensive audit (five layers)

A complete audit enumerates:

1. **Content types / CPTs** (GraphQL)
2. **All pages** + template assignments
3. **Builder templates** (headers, footers, singles, archives, loop-items, title-areas)
4. **Template CPTs** (`thegemTemplate`, `thegemTitle`, `thegemFooter`)
5. **Media** (featured + inline)

Crawl every discovered URL, run the census, write per-URL manifest + site-wide aggregate.

**This repo (homepage + GraphQL inventory):**

```bash
npm run wp:audit-source -- http://dameluthas.local/
npm run wp:verify-custom-menus
```

**Reference — full-site audit script** (Playwright + GraphQL; adapt paths to `data/audit/`):

```ts
// scripts/audit-wp-full.ts (reference)
// Usage: npx tsx scripts/audit-wp-full.ts http://dameluthas.local thegem
// Layers: discoverUrls → GraphQL inventory → per-URL census → allWidgetTypes aggregate
// Output: audit/full-site-audit.json
```

Per-URL census must wait for load (`networkidle` + `[data-widget_type]` selector) to avoid empty-page timing artifacts.

---

## Phase 5 — Extract design tokens (generic)

One Playwright pass captures fonts, colors, responsive sizes, spacing, hovers at every breakpoint. Works on any theme.

```bash
npm run wp:extract-design-system
# → data/extracted/design-system.json
# SSOT hand-tuned: src/shared/lib/design-tokens.ts
```

**Site 1 measured tokens (TheGem / Dame Luthas):**

| Token | Value |
|-------|-------|
| bg | `#0F0F0F` |
| text | `#FFF` |
| muted | `rgba(255,255,255,.7)` |
| accent | `#8F93F1` |
| accentHover | `#3C3950` |
| yellow | `#F7DF3D` |
| lavender | `#CECEE8` |
| buttonDark | `#2B2B2B` |
| fonts | **Outfit** (400/500/600/800) + **Cardo** serif |
| heroH1 | `clamp(40px,6.5vw,100px)` / 800 / uppercase (100→50@1024→40@767) |
| bigHeading | `clamp(36px,4.8vw,70px)` / 800 / uppercase |
| button | 19px / 600 / uppercase / radius 25px |
| container | max **1170px**, section padding-x **21px** |

---

## Phase 6 — Extract content (GraphQL + HTML-parse)

```bash
npm run wp:extract-content              # live GraphQL
npm run wp:extract-content -- --fixture # offline: data/fixtures/page-375.html
npm run wp:migrate                      # legacy content.json bundle
```

- Query `page(id:<front>) { content }` + CPTs (`thegemPfItems`, etc.)
- HTML-parse services, clients, testimonials from rendered markup
- Write `src/content/*.ts` + `data/migrated/content.json`
- Prefer structured GraphQL where typed fields exist; HTML-parse only free-form bands
- **Full testimonial quotes** require `_elementor_data` from Phase 2 (rendered HTML truncates them)

Parsers: `scripts/wp/lib/parsers/*`  
Emit: `scripts/wp/lib/emit-content.ts`

---

## Phase 7 — Copy assets (converted, FSD)

**Do not copy raw WP uploads into the app.** Convert via sharp → `public/assets/{domain}/`.

```bash
npm run assets:convert              # sharp webp + FSD paths + rewrite src/content
npm run assets:copy-portfolio-video # portfolio hero .webm
npm run assets:verify-bindings      # component binding gate
npm run assets:pipeline             # all of the above + manifest rebuild
npm run wp:codegen                  # extract-content → assets:convert
```

Domains: `clients`, `services`, `portfolio`, `site`, `pages` — see [MIGRATION-BACKLOG.md](./tasks/MIGRATION-BACKLOG.md) (`task_luthas_wp_033`).

Reference pipeline: `damieus-workflow-agents/tools/image-processing/wp-media-pipeline.mjs`

---

## Phase 8 — Build (registry-driven)

For each `WIDGET_REGISTRY` entry with a non-null `component`, build the React widget under `src/widgets/`.

- Reuse shared `AnimatedHeading` + `useInViewTrigger` so motion classes (`thegem-motion-ready` / `-animated`) apply
- Build templates from `TEMPLATE_REGISTRY` (header, footer, single, archive, loop, title)
- Assemble each page per its `perUrlCensus` manifest and template assignment
- Apply Phase 5 tokens globally (Outfit + dark `#0F0F0F`) — **do not** leave framework defaults (Geist / white)
- Native shell: `src/shared/design/thegem/` remix CSS — **no** runtime `/api/wp-content` proxy

**Build gates:**

```bash
npx tsc --noEmit && npm run lint && npm run build
npm run test:parity
```

---

## Phase 9 — Census-diff verifier (completeness gate)

Compares source audit against what the Next app renders. Any source widget absent from the registry or target = gap.

```bash
npm run wp:verify-widget-census
```

**Reference — census-diff script:**

```ts
// scripts/census-diff.ts (reference)
// npx tsx scripts/census-diff.ts http://localhost:3000
import audit from "../data/audit/source-audit.json";
import { WIDGET_REGISTRY } from "./wp/lib/widget-registry";

const sourceWidgets = Object.keys(audit.widgetCounts ?? {});
const unmapped = sourceWidgets.filter((w) => !(w in WIDGET_REGISTRY));
const mappedButNoComponent = sourceWidgets.filter(
  (w) => WIDGET_REGISTRY[w] && WIDGET_REGISTRY[w].component === null,
);

console.log("— CENSUS DIFF —");
if (unmapped.length) console.log(`❌ UNMAPPED:\n  ${unmapped.join("\n  ")}`);
else console.log("✅ Every source widget type has a registry entry.");
console.log(`ℹ️  Intentional skips: ${mappedButNoComponent.length}`);
```

Optional: crawl localhost with Playwright and diff rendered component set per URL.

---

## Phase 10 — Final parity check (browser)

Run live scorecard against source + target at desktop and mobile:

- Theme: Outfit font, `#0F0F0F` background
- Hero H1: 800 / uppercase, responsive 100 / 50 / 40
- Every section / template present and in order
- Motion classes firing; no regressions

```bash
npm run wp:visual-parity-audit   # requires localhost:3000 + source site
```

Then commit. See [SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md](./SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md) for agent orchestration.

---

## Per-theme adapter summary

| Layer | TheGem (complete) | JNews (scaffolded) |
|-------|-------------------|---------------------|
| Builder | Elementor (+ Pro) | WPBakery / Gutenberg + JNews modules |
| Census marker | `data-widget_type` | `jeg_*` / `jnews_*` / `vc_*` classes, shortcodes |
| Template CPTs | `thegemTemplate` / `thegemTitle` / `thegemFooter` | JNews theme-options / template builder |
| Content model | Page-centric | Category / post-centric (grids, carousels) |
| GraphQL extra | `_elementor_data` meta | JNews block meta / theme-options |
| Hard part | Elementor widget settings | JNews block attributes in shortcodes |
| Registry | `WIDGET_REGISTRY` (Phase 3) | `BLOCK_REGISTRY` (TBD) |

**Reusable as-is across all sites:** Phases 1, 5, 7, 9, 10 and the ten-phase structure. Only **Phase 2 GraphQL adapter** and **Phase 3 census + registry** swap for JNews.

---

## Dame Luthas reference stack (site 1)

```
Theme:   thegem-elementor
Builder: elementor + elementor-pro
Custom:  thegem-elements-elementor   ← all thegem-* widgets
```

High-count homepage widgets:

| Widget type | ~Count | Component |
|-------------|--------|-----------|
| `thegem-animated-heading.default` | 47 | `AnimatedHeading` |
| `thegem-styledimage.default` | 14 | `StyledImage` |
| `thegem-custom-menu.default` | 11 | `ServiceCard` |
| `thegem-styledbutton.default` | 10 | `AnimatedButton` |
| `thegem-clients.default` | 2 | `LogoMarquee` |

---

## Open items

| Item | Phase | Status |
|------|-------|--------|
| Full testimonial quotes via `_elementor_data` | 2, 6 | Open |
| JNews adapter (GraphQL + `BLOCK_REGISTRY`) | 2, 3 | Needs live JNews site audit — [JNEWS-ADAPTER.md](./adapters/JNEWS-ADAPTER.md) |
| `verify:public-routes` | 1b | Planned |
| Native pages: contact, case-studies, portfolio singles | 8 | Backlog `task_luthas_wp_035`–`039` |
| Remix `thegem-hovers.css` | 8 | P8 |
| Commit animation-trigger fix | 8 | P12 when approved |

---

## Related docs

| Doc | Purpose |
|-----|---------|
| [adapters/JNEWS-ADAPTER.md](./adapters/JNEWS-ADAPTER.md) | JNews scaffold — census, GraphQL, registry (sites 2 & 3) |
| [SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md](./SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md) | Agent orchestration, gates, commands |
| [LESSONS-LEARNED-DAME-LUTHAS-WP-MIGRATION.md](./LESSONS-LEARNED-DAME-LUTHAS-WP-MIGRATION.md) | Pilot errors — read before site 2 |
| [architecture/HOMEPAGE-GRAPHQL-CODEGEN-TSA.md](./architecture/HOMEPAGE-GRAPHQL-CODEGEN-TSA.md) | Homepage codegen architecture |
| [tasks/MIGRATION-BACKLOG.md](./tasks/MIGRATION-BACKLOG.md) | Routes, media FSD, de-WP tasks |
| `scripts/wp/lib/widget-registry.ts` | Widget → component map (keep in sync with Phase 3 table) |

---

## Why containers went missing (summary)

Elementor renders blocks from **widget types** (`data-widget_type`). Extractors that only handle a subset drop the rest without error. The fix is **site-wide widget census + registry guardrail** so every type is mapped or explicitly skipped before migration starts — not more ad-hoc scripts.

## Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-06-25 | — | Initial version |
