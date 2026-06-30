# JNews adapter (scaffolded)

> **Status:** Fill in after a **live audit** of a JNews source site (sites 2 & 3).  
> **Canonical process:** [MIGRATION-PLAYBOOK.md](../MIGRATION-PLAYBOOK.md) — phases 1, 5, 7, 9, 10 are unchanged; only Phase 2 (GraphQL) and Phase 3 (census + registry) use this adapter.

## When to use

```
/wp-content/themes/jnews/   → jnews adapter
```

JNews sites use **WPBakery Page Builder** and/or **Gutenberg** with JNews modules — **not** Elementor. Do not use `data-widget_type` census or `WIDGET_REGISTRY` from the TheGem playbook.

---

## Phase 2 — GraphQL (JNews)

Install **WPGraphQL** on the source. Generic fields work on any theme: `contentTypes`, `menus`, `posts { content excerpt featuredImage }`, `pages`, `categories`, `tags`.

**JNews-specific (TBD):**

- Post `content` field returns rendered article HTML (primary extract path)
- Register JNews block meta / theme-options for GraphQL as needed
- Audit a JNews site live to finalize meta keys and CPT names

```php
// TBD — example pattern after live audit:
// register_post_meta('post', '_jnews_block_*', ['show_in_graphql' => true, ...]);
```

---

## Phase 3 — Census detector (JNews)

**Marker:** `jeg_*` / `jnews_*` / `vc_*` CSS classes + WPBakery shortcodes in rendered HTML.

```ts
export const censusJNews = () => {
  const blocks: Record<string, number> = {};
  document
    .querySelectorAll('[class*="jeg_"],[class*="jnews"],[class*="vc_"]')
    .forEach((el) => {
      el.className
        .toString()
        .split(/\s+/)
        .forEach((c) => {
          if (/^(jeg_|jnews_|vc_)/.test(c)) {
            blocks[c] = (blocks[c] || 0) + 1;
          }
        });
    });
  return { blocks };
};
```

**Per-URL census selector (full-site audit):**

```ts
const sel = '[class*="jeg_"],[class*="jnews"],[class*="vc_"]';
// waitForSelector: '[data-widget_type], .jeg_main, main'  — use .jeg_main for JNews
```

---

## Phase 3 — `BLOCK_REGISTRY` (TBD)

Replace TheGem `WIDGET_REGISTRY` with a JNews block map after live census:

```ts
// lib/block-registry.ts — PLACEHOLDER
export const BLOCK_REGISTRY: Record<
  string,
  { component: string | null; source: string }
> = {
  // Fill from audit/full-site-audit.json allWidgetTypes / blocks aggregate
  // Example entries (hypothetical — verify on source):
  // 'jeg_postblock':           { component: 'PostBlock', source: 'jnews' },
  // 'jeg_slider':              { component: 'HeroSlider', source: 'jnews' },
  // 'vc_row':                  { component: null, source: 'wpbakery' },
};
```

**Exit gate:** same as TheGem — any census marker without a registry entry (mapped or explicit `null` skip) fails the audit.

---

## JNews vs TheGem (quick reference)

| Layer | TheGem | JNews |
|-------|--------|-------|
| Builder | Elementor (+ Pro) | WPBakery / Gutenberg + JNews modules |
| Census marker | `data-widget_type` | `jeg_*` / `jnews_*` / `vc_*` classes, shortcodes |
| Template CPTs | `thegemTemplate`, `thegemTitle`, `thegemFooter` | JNews theme-options / template builder |
| Content model | Page-centric | Category / post-centric (article grids, carousels) |
| GraphQL extra | `_elementor_data` meta | JNews block meta / theme-options |
| Hard part | Elementor widget settings JSON | JNews block attributes in shortcodes |
| Registry file | `scripts/wp/lib/widget-registry.ts` | `BLOCK_REGISTRY` (TBD) |

---

## Next steps (sites 2 & 3)

1. Run Phase 1 endpoint discovery on the JNews source URL
2. Run Playwright census with `adapter: 'jnews'` on every public URL
3. Write `audit/full-site-audit.json` aggregate → populate `BLOCK_REGISTRY`
4. Finalize Phase 2 GraphQL meta registration from discovered block keys
5. Reuse Phases 5, 7, 9, 10 from the main playbook unchanged

See [MIGRATION-PLAYBOOK.md](../MIGRATION-PLAYBOOK.md) for shared phases and [SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md](../SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md) for agent roles.

## Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-06-25 | — | Initial version |
