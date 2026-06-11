# WP → Next.js Migration Playbook (Elementor / TheGem)

Repeatable six-phase process for migrating Elementor-built WordPress sites to native Next.js. Use this on **every** site before writing components.

**Ground truth:** Elementor exposes widget identity as `data-widget_type` in rendered HTML. Unmapped widget types = missing containers. That is the entire bug class.

---

## Phase 1 — Audit (work manifest)

Run against the **source** site homepage (or any URL):

```bash
npm run wp:audit-source
# other sites:
npm run wp:audit-source -- http://site-two.local/
```

**Outputs:**

| File | Purpose |
|------|---------|
| `data/audit/source-audit.json` | Machine-readable census |
| `data/audit/source-audit.md` | Human-readable work manifest |

**Captures:** active plugins (from asset URLs), themes, every `data-widget_type` with counts, Elementor `data-element_type` structure, GraphQL content types.

**Exit code 1** if any widget type on the page is missing from `scripts/wp/lib/widget-registry.ts`.

---

## Phase 2 — Configure GraphQL (source WP)

Install/confirm **WPGraphQL**. Register Elementor post meta so widget settings (full testimonial bodies, etc.) are queryable:

```php
// wp-content/themes/{child-theme}/functions.php (SOURCE site only)
add_action('init', function () {
  register_post_meta('page', '_elementor_data', [
    'show_in_graphql' => true,
    'single'            => true,
    'type'              => 'string',
    'auth_callback'     => function () { return current_user_can('edit_posts'); },
  ]);
});
```

After deploy, verify in GraphQL IDE:

```graphql
query {
  page(id: "375", idType: DATABASE_ID) {
    elementorData: _elementorData  # field name may vary by WPGraphQL meta registration
  }
}
```

Install **WPGraphQL for ACF / Elementor** extensions when available so widget settings arrive structurally instead of only as rendered HTML.

Local helper (this repo):

```bash
npm run wp:install-graphql
npm run wp:probe-schema
```

---

## Phase 3 — Map widgets → components (registry guardrail)

**Single source of truth:** `scripts/wp/lib/widget-registry.ts`

Every `data-widget_type` found in Phase 1 must have an entry:

| `component` | Meaning |
|-------------|---------|
| `"StyledImage"` | Handled by named React widget |
| `null` | **Explicit skip** (template chrome, dividers) |

**Rule:** No registry entry = silent drop during HTML extract = missing container.

When adding a handler for site 2 or 3, extend the registry **first**, then build the component.

---

## Phase 4 — Extract content

GraphQL + HTML-parse pipeline (this repo):

```bash
npm run wp:extract-content -- --fixture   # offline: data/fixtures/page-375.html
npm run wp:extract-content              # live: dameluthas.local/graphql
npm run wp:copy-assets
npm run wp:codegen                        # extract + assets
npm run wp:migrate                        # legacy content.json bundle
```

Generated modules: `src/content/*.ts`  
Parsers: `scripts/wp/lib/parsers/*`

---

## Phase 5 — Extract design tokens

```bash
npm run wp:extract-design-system
```

Output: `data/extracted/design-system.json` (computed styles at breakpoints).

SSOT for hand-tuned tokens: `src/shared/lib/design-tokens.ts`

---

## Phase 6 — Verify (widget census + visual parity)

**Widget census** (registry coverage):

```bash
npm run wp:verify-widget-census
```

**Visual / theme parity** (Next vs WP):

```bash
npm run wp:visual-parity-audit
# requires localhost:3000 + source site up
```

**Build gates:**

```bash
npx tsc --noEmit && npm run lint && npm run build
npm run test:parity
```

Any widget type in `source-audit.json` but not in registry = named gap. Any registry `component` without a matching render on the homepage = implementation gap (track in registry `note`).

---

## Dame Luthas reference stack (site 1)

From homepage audit — expect roughly:

```
Theme:   thegem-elementor
Builder: elementor + elementor-pro
Custom:  thegem-elements-elementor   ← all thegem-* widgets
```

High-count widgets to implement (not skip):

| Widget type | Typical count | Component |
|-------------|---------------|-----------|
| `thegem-animated-heading.default` | ~47 | `AnimatedHeading` |
| `thegem-styledimage.default` | ~14 | `StyledImage` / service banners |
| `thegem-custom-menu.default` | ~11 | `ServiceCard` menus |
| `thegem-styledbutton.default` | ~10 | `AnimatedButton` |
| `thegem-clients.default` | ~2 | `LogoMarquee` |

---

## New site checklist (sites 2 & 3)

1. `npm run wp:audit-source -- http://NEW-SITE.local/` → fix registry gaps
2. Register `_elementor_data` in source WP `functions.php`
3. `npm run wp:probe-schema` → confirm CPTs + page ID
4. Extend `widget-registry.ts` for any new widget types
5. Add parsers / content emitters for site-specific HTML patterns
6. Build or reuse widgets under `src/widgets/home/`
7. `npm run wp:verify-widget-census && npm run wp:visual-parity-audit`

---

## Related docs

| Doc | Purpose |
|-----|---------|
| `docs/architecture/HOMEPAGE-GRAPHQL-CODEGEN-TSA.md` | Dame Luthas homepage codegen architecture |
| `scripts/wp/lib/widget-registry.ts` | Widget → component map |
| `scripts/wp/audit-wp-source.mts` | Phase 1 audit CLI |
| `scripts/wp/verify-widget-census.mts` | Phase 6 census CLI |

---

## Why containers went missing (summary)

Elementor renders blocks from **widget types** (`data-widget_type`). Extractors that only handle a subset of types drop the rest without error. The fix is not more ad-hoc scripts — it is **up-front widget census + registry guardrail** so every type is mapped or explicitly skipped before migration starts.
