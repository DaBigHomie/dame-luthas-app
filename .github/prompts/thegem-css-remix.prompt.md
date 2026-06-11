---
description: "Run The Gem 50-file CSS remix sprint — audit manifest, assign css/animation agents, implement next batch. Use when: /thegem-css-remix or starting native stylesheet migration from WP pilot."
---

# The Gem CSS Remix (50x)

Orchestrator: `@thegem-css-orchestrator`  
Review agents: `@thegem-css-audit` · `@thegem-animation-audit`

## Preflight

```bash
cd ~/management-git/dame-luthas-app
npx tsx scripts/thegem/audit-css-manifest.mts
npm run build
```

## Batch workflow

1. Read `src/features/thegem-remix/model/manifest.ts` — pick next `pending` or `in_progress` batch (max 8 files).
2. Remix pilot rules into `src/shared/design/thegem/remix/{domain}.css` using `--dl-gem-*` tokens.
3. Wire classes into affected widgets (`Header`, `Footer`, `ContactFormBlock`, etc.).
4. Import `@/shared/design/thegem/index.css` in `app/layout.tsx` when batch touches global styles.
5. Run `@thegem-css-audit` + `@thegem-animation-audit` on the batch.
6. Capture screenshots: `npm run wp:screenshots:next` — compare to `data/screenshots/wp-reference/`.
7. Update manifest entry status → `remixed` or `verified`.

## FSD layout

| Path | Role |
|------|------|
| `src/features/thegem-remix/` | Manifest, catalog, pipeline status |
| `src/shared/design/thegem/` | Native remixed CSS output |
| `src/widgets/` | Consumers (Header, Footer, ContactFormBlock) |

## Agent assignments (default)

| Step | Agent | Task |
|------|-------|------|
| 1 | thegem-css-orchestrator | Select batch, update manifest |
| 2 | (implement) | Remix CSS + widget classes |
| 3 | thegem-css-audit | Formatting, tokens, screenshot parity |
| 4 | thegem-animation-audit | Hovers, menu underline, reduced motion |
| 5 | code-review | FSD import direction + pre-commit |

## Current P0 widgets

- Footer bottom bar (white strip + social icons) — `FooterBottomBar.tsx`
- Contact form block — yellow/lavender split
- Header menu hover underline
