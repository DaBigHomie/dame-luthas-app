# Dame Luthas migration — route & platform backlog

Tracks **non-homepage** migration work, **media/asset architecture**, and **de-WP runtime cleanup**. Homepage widget parity lives in [WIDGET-PARITY-TASKS.md](./WIDGET-PARITY-TASKS.md).

**Audit requirement (new scope):** Phase 1 audit and Phase 7 parity must include **public Next.js routes** — not only the homepage. Each row below maps a WP source URL to the expected Next endpoint and current status.

---

## Public endpoint audit matrix

| WP source (ground truth) | Expected Next route | Status | Task ID |
|--------------------------|---------------------|--------|---------|
| `http://dameluthas.local/` | `/` | ✅ Native shell | — |
| `http://dameluthas.local/contact/` | `/contact` | ✅ Native `ContactPage` + Resend action | `task_luthas_wp_035` |
| `http://dameluthas.local/case-studies/` | `/case-studies` | ✅ Native index; no stray WP bodyHtml | `task_luthas_wp_036` |
| `http://dameluthas.local/pf/united-nations-cloud-migration-fobos/` | `/portfolio/united-nations-cloud-migration-fobos` (+ redirect from `/pf/*`) | ✅ Live; structured registry + HTML fallback | `task_luthas_wp_037` |
| `http://dameluthas.local/pf/amazon-labor-union-digital-transformation/` | `/portfolio/amazon-labor-union-digital-transformation` | ✅ Live; testimonials + client meta | `task_luthas_wp_038` |
| `http://dameluthas.local/pf/gatorade-embraces-generative-ai-powered-bottle-design/` | `/portfolio/gatorade-embraces-generative-ai-powered-bottle-design` | ✅ Live; structured CTA/meta | `task_luthas_wp_039` |

**Audit command:** `npm run verify:public-routes` — compare HTTP status + title/H1 presence on WP vs Next for every row above. See [MIGRATION-PLAYBOOK.md](../MIGRATION-PLAYBOOK.md) Phase 1b.

**2026-06-11 session:** `/about` removed (404). `/portfolio` → `/case-studies`. Production: https://dame-luthas-app.vercel.app

**WP portfolio slug prefix:** Source uses `/pf/{slug}/`; Next app uses `/portfolio/{slug}`. Accept either permanent redirect (`/pf/*` → `/portfolio/*`) or Next rewrite in `next.config.ts`.

---

## Platform / architecture backlog

| ID | Priority | Area | Problem | Target state | Acceptance |
|----|----------|------|---------|--------------|------------|
| `task_luthas_wp_032` | **P1** | De-WP runtime | ~~App exposes wp routes~~ | **Done 2026-06-11** — removed `/api/wp-*`, pilot CSS proxy; static `/assets/` only | `grep -r 'api/wp-' src/` → 0 |
| `task_luthas_wp_033` | **P1** | Media FSD | ~~wp-migrated raw copies~~ | **Done 2026-06-11** — `npm run assets:pipeline`; 73 files in `public/assets/` | `assets:verify-bindings` passes |
| `task_luthas_wp_034` | **P1** | Public endpoint audit | ~~Homepage-only audit~~ | **Done 2026-06-11** — `npm run verify:public-routes` + Playwright `@critical` | Script + e2e cover public matrix |

---

## Route migration backlog (detail)

### `task_luthas_wp_035` — Contact page ✅ (2026-06-11)

- Native `src/app/contact/page.tsx` + `ContactPage` widget
- Resend server action wired; requires Vercel env (`RESEND_API_KEY`, `RESEND_FROM`)

### `task_luthas_wp_036` — Case studies ✅ (2026-06-11)

- `CaseStudiesPage` + `PortfolioGrid`; empty `bodyHtml` in migrate script (fixes Gatorade article leak)
- Canonical index at `/case-studies`; `/portfolio` redirects

### `task_luthas_wp_037`–`039` — Portfolio detail ✅ (2026-06-11)

- `/portfolio/[slug]` with `resolveCaseStudy()` + structured registry (Amazon, Gatorade, UN)
- `/pf/[slug]` → `/portfolio/[slug]` redirect
- **Follow-up:** migrate remaining prose off `MigratedContent` / HTML parse — **done 2026-06-11** (all 3 case studies use `nativeContent` registry)

---

## Media FSD migration notes (`task_luthas_wp_033`)

**Current state (2026-06-11 — pipeline added):**

| Location | Status |
|----------|--------|
| `public/assets/{clients,services,portfolio,site,pages}/` | Converted webp/svg only (sharp) |
| `data/extracted/converted-assets.json` | Component binding manifest (gitignored) |
| `public/wp-migrated/` | **Deprecated** — delete after verify passes |
| `src/content/*.ts`, widgets | Rewritten to `/assets/…` by `assets:convert` |

**Pipeline (replaces raw `wp:sync-media`):**

```bash
npm run assets:convert          # sharp webp + FSD paths + rewrite src/content
npm run assets:verify-bindings  # legacy path ban + disk + component manifest
npm run assets:pipeline         # both
npm run wp:codegen              # extract-content → assets:convert
```

Reference: `damieus-workflow-agents/tools/image-processing/wp-media-pipeline.mjs`

**Target FSD layout:**

```
public/
  assets/
    images/          # raster: webp, png, jpg
    media/           # svg, video
    clients/         # logo strip
    portfolio/       # case study heroes
    pages/           # contact, case-studies inline assets
```

**Codegen rule:** `assets:convert` rewrites all `src` fields to `/assets/{domain}/…`. Delete `public/wp-migrated/` after migration.

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
npm run assets:pipeline         # convert + verify bindings
```

---

## Cross-references

- [LESSONS-LEARNED-DAME-LUTHAS-WP-MIGRATION.md](../LESSONS-LEARNED-DAME-LUTHAS-WP-MIGRATION.md)
- [SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md](../SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md)
- [WIDGET-PARITY-TASKS.md](./WIDGET-PARITY-TASKS.md)
