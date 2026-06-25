# Session Checkpoint — GraphQL codegen architecture (homepage parity)

**Date:** 2026-06-11 13:52  
**Branch:** `main`  
**Session:** `sess_dame_luthas__20260611_dfd07f`  
**CORTEX task:** `task_luthas_wp_006` → `in_progress`  
**Agent:** 181 (Composer)

---

## Objective

Checkpoint WPGraphQL schema probe findings and publish the **Technical Solution Architecture** for homepage section codegen (page 375 → typed `src/content/` + asset copy). Unblocks implementation of `extract-wp-content.mts` and `copy-wp-assets.mts`.

---

## Accomplished this session

1. **CORTEX boot** — `npx tsx ../.agent-kb/anvil/cortex-boot.mts --repo=dame-luthas-app --agent=181` → `.cortex-boot.json`
2. **Schema probe** — `scripts/wp/probe-schema.mts` + `npm run wp:probe-schema`
3. **Homepage ID confirmed** — Page **375** (`isFrontPage: true`), not 14
4. **Data source classification:**
   - Structured: `thegemPfItems`, `menus` (nav only), templates/footers
   - HTML-parse required: service cards (`thegem-menu-custom`), clients (`gem-client`), testimonials, rotating text
   - Service cards are **not** WP `menuItems` (only `dameluthas-main-menu` with 3 items)
5. **TSA document** — `docs/architecture/HOMEPAGE-GRAPHQL-CODEGEN-TSA.md`
6. **Context manifest** — `documentation-standards/docs/context-manifests/2026-06-11_dame-luthas-graphql-codegen-checkpoint.md`

---

## Key technical decisions

| Decision | Rationale |
|---|---|
| Codegen, not runtime WP | Static React sections; diffable parity; no prod WP dependency |
| Parse `content` over `builderContent` | 156 KB rendered HTML matches browser; builder is supplementary |
| Cheerio for 5 section types | No GraphQL CPT for clients/testimonials/services columns |
| Keep animation layer hand-wired | `TheGemMotionRoot` + `AnimatedHeading` already fixed |
| Defer Supabase (`task_luthas_db_009`) | Static content sufficient for homepage parity |

---

## Git state (uncommitted)

**Last commit:** `965757a` feat(migration): native WP content shell, The Gem CSS remix FSD, and review agents

**Modified / new (high level):**
- Animation system: `AnimatedHeading`, `AnimatedButton`, `TheGemMotionRoot`, `use-in-view-trigger`
- TheGem CSS remix (~8/50 manifest files), `homepage-inventory.ts`, `p8-hovers-scope.ts`
- `scripts/wp/probe-schema.mts`, `package.json` (`wp:probe-schema`)
- `docs/architecture/HOMEPAGE-GRAPHQL-CODEGEN-TSA.md` (this checkpoint)

---

## Pending implementation (P1–P4)

| Priority | Task |
|---|---|
| P1 | `scripts/wp/extract-wp-content.mts` — GraphQL + Cheerio → `src/content/*.ts` |
| P2 | `scripts/wp/copy-wp-assets.mts` — media → `public/wp-migrated/` |
| P3 | `src/widgets/home/*` + `page.tsx` — wire 8 homepage sections |
| P4 | Commit animation fixes + probe + codegen (on user request) |

---

## Commands reference

```bash
# CORTEX
npx tsx ../.agent-kb/anvil/cortex-boot.mts --repo=dame-luthas-app --agent=181

# Probe
npm run wp:probe-schema

# Existing pipeline
npm run wp:install-graphql
npm run wp:extract-live && npm run wp:migrate

# Future (per TSA)
npm run wp:codegen   # extract-content + copy-assets
```

---

## Blockers

None. Local WP at `dameluthas.local` required for live extract runs; HTML fixture path documented for offline parser dev.

---

## Next agent

1. Read `docs/architecture/HOMEPAGE-GRAPHQL-CODEGEN-TSA.md`
2. Implement Phase B (codegen scripts) per section 10
3. Implement Phase C widgets
4. Run `wp:screenshots:next` for parity sign-off

## Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-06-25 | — | Initial version |
