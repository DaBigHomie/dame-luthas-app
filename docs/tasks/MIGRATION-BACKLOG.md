# Dame Luthas migration — route & platform backlog

Tracks **non-homepage** migration work, **media/asset architecture**, and **de-WP runtime cleanup**. Homepage widget parity lives in [WIDGET-PARITY-TASKS.md](./WIDGET-PARITY-TASKS.md).

**Audit requirement (new scope):** Phase 1 audit and Phase 7 parity must include **public Next.js routes** — not only the homepage. Each row below maps a WP source URL to the expected Next endpoint and current status.

---

## Public endpoint audit matrix

| WP source (ground truth) | Expected Next route | Status | Task ID |
|--------------------------|---------------------|--------|---------|
| `http://dameluthas.local/` | `/` | ✅ Native shell | — |
| `http://dameluthas.local/contact/` | `/contact` | ❌ Not migrated (needs native widget + content extract) | `task_luthas_wp_035` |
| `http://dameluthas.local/case-studies/` | `/case-studies` | ❌ Route missing / not implemented | `task_luthas_wp_036` |
| `http://dameluthas.local/pf/united-nations-cloud-migration-fobos/` | `/portfolio/united-nations-cloud-migration-fobos` (+ redirect from `/pf/*`) | ❌ Not completed | `task_luthas_wp_037` |
| `http://dameluthas.local/pf/amazon-labor-union-digital-transformation/` | `/portfolio/amazon-labor-union-digital-transformation` | ❌ Not completed | `task_luthas_wp_038` |
| `http://dameluthas.local/pf/gatorade-embraces-generative-ai-powered-bottle-design/` | `/portfolio/gatorade-embraces-generative-ai-powered-bottle-design` | ❌ Not completed | `task_luthas_wp_039` |

**Audit command (planned):** `npm run verify:public-routes` — compare HTTP status + title/H1 presence on WP vs Next for every row above. See [MIGRATION-PLAYBOOK.md](../MIGRATION-PLAYBOOK.md) Phase 1b.

**WP portfolio slug prefix:** Source uses `/pf/{slug}/`; Next app uses `/portfolio/{slug}`. Accept either permanent redirect (`/pf/*` → `/portfolio/*`) or Next rewrite in `next.config.ts`.

---

## Platform / architecture backlog

| ID | Priority | Area | Problem | Target state | Acceptance |
|----|----------|------|---------|--------------|------------|
| `task_luthas_wp_032` | **P1** | De-WP runtime | App still exposes `wp` prefix in routes, paths, and APIs (`/api/wp-content`, `/api/wp-media`, `public/wp-migrated`, `WpPilotStyles`, `rewrite-wp-urls.ts`) | **Zero `wp` references in shipped runtime** — scripts under `scripts/wp/` are dev-only extract tooling | No `wp-*` paths in `src/` public URLs; pilot CSS proxy removed or renamed; grep `src/` for `\bwp[-/]` returns 0 in production bundle |
| `task_luthas_wp_033` | **P1** | Media FSD | Assets copied to `public/wp-migrated/`; content modules mix `/wp-content/uploads/…` and `/wp-migrated/…`; not in FSD-aligned locations | FSD layout: `public/assets/{images,media}/…` or `src/shared/assets/` for static imports; codegen emits site-relative paths only | All homepage + route pages load images from `/assets/…`; `copy-wp-assets` writes to FSD paths; no broken images on `/`, `/contact`, `/case-studies`, portfolio detail |
| `task_luthas_wp_034` | **P1** | Public endpoint audit | `wp:audit-source` only audits homepage URL passed in; no Next-side route matrix | Extend audit: WP URL list → expected Next path → status (200/404/content diff) | Script exits 1 if any public route missing or 404 on Next; documented in playbook Phase 1b |

---

## Route migration backlog (detail)

### `task_luthas_wp_035` — Contact page

- **WP:** [view-source:http://dameluthas.local/contact/](http://dameluthas.local/contact/)
- **Gap:** `[slug]/page.tsx` renders `ContactPage` only when `data/migrated/content.json` exists; native shell path not implemented
- **Work:** GraphQL/Cheerio extract → `src/content/contact.ts` → native `ContactPage` widget (CF7 replacement for form)
- **Depends on:** `task_luthas_wp_033` (contact hero/media paths)

### `task_luthas_wp_036` — Case studies

- **WP:** [view-source:http://dameluthas.local/case-studies/](http://dameluthas.local/case-studies/)
- **Gap:** No `src/app/case-studies/page.tsx` or slug handler
- **Work:** Audit widget census on page → registry → extract → widget(s) → route

### `task_luthas_wp_037` — UN Cloud Migration (portfolio)

- **WP:** [view-source:http://dameluthas.local/pf/united-nations-cloud-migration-fobos/](http://dameluthas.local/pf/united-nations-cloud-migration-fobos/)
- **Gap:** Portfolio detail not extracted to native content; `/portfolio/[slug]` requires migrated JSON or live GraphQL item
- **Work:** Extract `thegemPfItem` body + media → `src/content/portfolio/{slug}.ts` or shared portfolio index

### `task_luthas_wp_038` — Amazon Labor Union

- **WP:** [view-source:http://dameluthas.local/pf/amazon-labor-union-digital-transformation/](http://dameluthas.local/pf/amazon-labor-union-digital-transformation/)

### `task_luthas_wp_039` — Gatorade Gen-AI

- **WP:** [view-source:http://dameluthas.local/pf/gatorade-embraces-generative-ai-powered-bottle-design/](http://dameluthas.local/pf/gatorade-embraces-generative-ai-powered-bottle-design/)

---

## Media FSD migration notes (`task_luthas_wp_033`)

**Current state (incorrect):**

| Location | Example | Issue |
|----------|---------|-------|
| `public/wp-migrated/` | `/wp-migrated/2025/02/home-04.webp` | `wp` prefix; not FSD |
| `src/content/clients.ts` | `/wp-content/uploads/2025/05/un-logo-1a.png` | Proxied WP path, not migrated file |
| `src/content/services.ts` | `/wp-content/uploads/2025/02/home-03.webp` | Same |
| `src/content/service-blocks.ts` | `/wp-migrated/2025/02/…` | Mixed with clients.ts |
| `ContactFormBlock.tsx` | `/api/wp-media/2025/02/circle-dark.svg` | Runtime WP proxy |

**Target FSD layout (proposed):**

```
public/
  assets/
    images/          # raster: webp, png, jpg
    media/           # svg, video
    clients/         # logo strip
    portfolio/       # case study heroes
    pages/           # contact, case-studies inline assets
```

**Codegen rule:** `copy-wp-assets.mts` + `emit-content.ts` rewrite all `src` fields to `/assets/images/…` at extract time. Delete `public/wp-migrated/` after migration.

---

## De-WP runtime notes (`task_luthas_wp_032`)

**Remove or rename (production):**

| Current | Replacement |
|---------|-------------|
| `/api/wp-content/*` | Remove (pilot only) or `/api/pilot-styles/*` dev-only |
| `/api/wp-media/*` | Remove — serve from `public/assets/` |
| `public/wp-migrated/` | `public/assets/` |
| `src/shared/lib/headless/wp-content-*` | Delete after pilot CSS retired |
| `WpPilotStyles`, `PilotStylesGate` | Delete when native remix CSS complete |
| `rewrite-wp-urls.ts`, `rewrite-media.ts` | Delete — no WP URLs in HTML at runtime |

**Keep (dev-only, not in `src/`):** `scripts/wp/*` — extract tooling may retain `wp` naming.

---

## Commands (when implemented)

```bash
npm run verify:public-routes     # WP vs Next public endpoint matrix
npm run wp:audit-source          # homepage widget census (existing)
npm run assets:migrate-fsd       # planned: wp-migrated → public/assets
```

---

## Cross-references

- [LESSONS-LEARNED-DAME-LUTHAS-WP-MIGRATION.md](../LESSONS-LEARNED-DAME-LUTHAS-WP-MIGRATION.md)
- [SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md](../SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md)
- [WIDGET-PARITY-TASKS.md](./WIDGET-PARITY-TASKS.md)
