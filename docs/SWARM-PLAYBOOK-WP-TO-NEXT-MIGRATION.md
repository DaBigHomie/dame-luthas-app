# Swarm Playbook — WP → Next.js Migration (Agent Orchestration)

> **Purpose:** Step-by-step instructions for AI agents and engineers migrating Elementor/TheGem WordPress sites to native Next.js — based on the Dame Luthas pilot (`dame-luthas-app`, session 2026-06-07 → 2026-06-11).  
> **Audience:** Cursor agents, Copilot agents, and humans running **Luthas Center** (`luthas-center-app`), **Luthas Org** (`luthas-org-app`), or greenfield Elementor migrations.  
> **Prerequisites doc:** [LESSONS-LEARNED-DAME-LUTHAS-WP-MIGRATION.md](./LESSONS-LEARNED-DAME-LUTHAS-WP-MIGRATION.md) — read before starting to avoid known failure modes.  
> **Canonical process:** [MIGRATION-PLAYBOOK.md](./MIGRATION-PLAYBOOK.md)  
> **Cross-site context:** [MIGRATION-WALKTHROUGH.md](./MIGRATION-WALKTHROUGH.md)

---

## How to use this playbook

1. **Copy** `scripts/wp/` tooling from `dame-luthas-app` into the target Next.js repo (or symlink via monorepo).
2. **Assign** agent roles below per phase — phases are sequential; do not skip Phase 1.
3. **Run verification gates** at each phase boundary — failing gates block the next phase.
4. **Log blockers** to CORTEX / task tracker with `task_{site}_wp_{NNN}` IDs.
5. **Never treat registry census PASS as migration complete** — always run visual parity before merge.

---

## Architecture target state

```
┌─────────────────────────────────────────────────────────────────┐
│  SOURCE: Local WordPress (Elementor + TheGem)                     │
│  - Rendered HTML = ground truth for widget census               │
│  - WPGraphQL + mu-plugin = structured CPTs + full post bodies   │
└───────────────────────────┬─────────────────────────────────────┘
                            │ DEV-TIME ONLY (not production runtime)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  EXTRACTION: scripts/wp/*.mts                                   │
│  Phase 1 audit → Phase 4 codegen → Phase 5 design tokens      │
└───────────────────────────┬─────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  SSOT: src/content/*.ts (committed, typed, static)              │
│  ASSETS: public/wp-migrated/                                    │
└───────────────────────────┬─────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  UI: src/widgets/home/* composed in src/app/page.tsx            │
│  DESIGN: src/shared/design/thegem/ (CSS remix, not WP proxy)    │
└───────────────────────────┬─────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  DEPLOY: Vercel — zero dependency on dameluthas.local           │
└─────────────────────────────────────────────────────────────────┘
```

**Non-negotiable:** Production must not call local WordPress. GraphQL is extract-only.

---

## Agent swarm roles

| Role | Agent type | Responsibility | Key outputs |
|------|------------|----------------|-------------|
| **Infra Scout** | `explore` / shell | Local WP path, site status, disk space, nginx logs | `local-wp.config.json`, `.env.local` |
| **Audit Agent** | `explore` | Phase 1 widget census, registry gap analysis | `data/audit/source-audit.json` |
| **Schema Agent** | `generalPurpose` | Mu-plugin, GraphQL probes, CPT registration | `dameluthas-headless-graphql.php` adapted |
| **Parser Agent** | `generalPurpose` | Cheerio parsers for HTML-only widgets | `scripts/wp/lib/parsers/*.ts` |
| **Codegen Agent** | `generalPurpose` | Emit pipeline, content modules | `src/content/*.ts` |
| **Widget Agent** | implementation | React widgets matching registry | `src/widgets/home/*.tsx` |
| **Design Agent** | `ds-*` / manual | CSS remix, tokens, motion | `src/shared/design/thegem/` |
| **Parity Agent** | Playwright / `explore` | Visual + e2e gates | parity reports, screenshots |
| **Build Agent** | shell | Turbopack, tsc, lint, CI | clean `npm run build` |
| **Review Agent** | `code-review` | PR gate before merge | PASS/FAIL with file refs |

**Parallelization rules:**
- Infra Scout + Audit Agent can run in parallel **after** Local WP is running.
- Parser Agent + Schema Agent can run in parallel **after** Phase 1 audit completes.
- Widget Agent + Design Agent run **after** codegen emits content modules.
- Build Agent + Parity Agent run **before every PR**.

---

## Phase 0 — Bootstrap (Infra Scout)

### 0.1 Prerequisites

```bash
# Target repo root
cd /path/to/{target-app}
node -v          # ≥ 20
npm ci
cp .env.example .env.local
```

### 0.2 Local WordPress

| Step | Command / action | Pass criteria |
|------|------------------|---------------|
| Restore backup | Local WP app → import UpdraftPlus | Site loads in browser |
| Sync paths | `npm run wp:sync-local` | `scripts/wp/local-wp.config.json` written |
| Verify public path | `ls "$LOCAL_WP_PUBLIC_PATH/wp-content"` | plugins, themes, uploads exist |
| Install GraphQL | WPGraphQL plugin active in WP admin | — |
| Set env | Edit `.env.local` | See env table below |

**Environment variables (required):**

| Variable | Example | Notes |
|----------|---------|-------|
| `WP_HEADLESS_GRAPHQL_URL` | `http://dameluthas.local/graphql` | Canonical local GraphQL |
| `LOCAL_WP_PUBLIC_PATH` | `/Users/.../app/public` | **Prefer outside Next repo** |
| `HEADLESS_PILOT_CSS` | `false` for native shell | `true` only during pilot phase |
| `NEXT_PUBLIC_SITE_URL` | staging/prod URL | Vercel domain |

### 0.3 Enable git hooks

```bash
git config core.hooksPath .githooks
```

### 0.4 Infra verification gate

```bash
npm run wp:verify                    # headless smoke
curl -sf "$WP_HEADLESS_GRAPHQL_URL" -X POST \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}' | head -c 200
```

**Blockers (stop swarm):**
- GraphQL `fetch failed` → check Local site **running**, not plugin config
- ssh-entry `cd` failure → run `wp:sync-local`
- Disk < 2 GB free → clear `.next`, `node_modules/.cache`

**Agent deliverable:** Comment in task tracker with site URL, page ID, GraphQL endpoint, public path.

---

## Phase 1 — Audit (Audit Agent)

### 1.1 Run source audit

```bash
npm run wp:audit-source
# Other sites:
npm run wp:audit-source -- http://luthas-center.local/
```

**Outputs:**
- `data/audit/source-audit.json`
- `data/audit/source-audit.md`

### 1.2 Identify front page

Do **not** assume page ID. Audit Agent must record:

```graphql
query {
  pages(where: { isFrontPage: true }) {
    nodes { databaseId slug title }
  }
}
```

Dame Luthas: **375** (page 14 was a red herring).

### 1.3 Registry gap fix loop

For every unmapped `data-widget_type` in audit:

1. Add entry to `scripts/wp/lib/widget-registry.ts`
2. Set `component: "WidgetName"` OR `component: null` (explicit skip)
3. Re-run audit until exit code 0

```bash
npm run wp:verify-widget-census
# Expect: "Census PASS — every widget type on source page has a registry entry."
```

### 1.4 Phase 1 gate

| Check | Command | Must pass |
|-------|---------|-----------|
| All widgets mapped | `npm run wp:audit-source` | Exit 0 |
| Census | `npm run wp:verify-widget-census` | Exit 0 |
| Audit artifact committed | `git status data/audit/` | JSON + MD tracked |

**Handoff to Schema Agent:** `source-audit.json` + list of CPTs needed.

---

## Phase 2 — GraphQL schema (Schema Agent)

### 2.1 Adapt mu-plugin template

Copy and customize:
```
scripts/wp/templates/dameluthas-headless-graphql.php
→ scripts/wp/templates/{site}-headless-graphql.php
```

Register for **your** site:
- TheGem CPTs (`thegemPfItem`, `thegemTemplate`, `thegemFooter`, etc.)
- Custom post types discovered in Phase 1
- `elementorData` / `builderContent` on `ContentNode` if needed
- **Custom root queries** for data that WPGraphQL connections miss (see testimonials pattern)

### 2.2 Install and probe

```bash
npm run wp:install-graphql
npm run wp:probe-schema
```

### 2.3 Schema verification queries

Run in GraphQL IDE (adapt IDs):

```graphql
query Phase2Gate {
  frontPage: page(id: "375", idType: DATABASE_ID) {
    databaseId
    content(format: RENDERED)
  }
  portfolio: thegemPfItems(first: 3) { nodes { title slug } }
  # Site-specific:
  testimonials: dameluthasTestimonialQuotes { author quote role }
}
```

### 2.4 Phase 2 gate

| Check | Pass criteria |
|-------|---------------|
| Mu-plugin active | `wp-content/mu-plugins/{site}-headless-graphql.php` exists on disk |
| Front page HTML | `content(format: RENDERED)` > 100 KB for Elementor homepage |
| CPT probes | Required types return nodes (not empty) |
| Custom root fields | Full bodies, not excerpts |

**If `thegemTestimonials { nodes }` empty:** Add custom root resolver (see Dame Luthas `dameluthasTestimonialQuotes`). Do not block on connection layer.

**Do not use WP-CLI** in automated schema phase — Local ssh-entry hangs.

---

## Phase 3 — Parsers (Parser Agent)

### 3.1 Capture fixture HTML

```bash
# Live capture → fixture (refresh after every WP layout change)
WP_HEADLESS_GRAPHQL_URL=http://SITE.local/graphql \
  npx tsx scripts/wp/capture-fixture.mts   # or manual save to data/fixtures/page-{ID}.html
```

**Critical:** Fixture must match live widget counts. Dame Luthas drift: **8 vs 11** custom menus.

### 3.2 Parser inventory

Create one parser per widget cluster:

| Widget type | Parser | Emits |
|-------------|--------|-------|
| `thegem-custom-menu` | `parse-custom-menus.ts` | → `service-blocks.ts` (pending wp_027) |
| `thegem-testimonials` | `parse-testimonials.ts` + GraphQL overlay | `testimonials.ts` |
| `thegem-clients` | `parse-clients.ts` | `clients.ts` |
| Hero band | `parse-hero.ts` | hero section in `sections.ts` |
| Generic census | `parse-widget-walk.ts` | extract report only |

Orchestrator: `scripts/wp/lib/parsers/parse-homepage.ts`

### 3.3 Testimonial rule

```
IF live GraphQL available:
  USE fetch-testimonials-graphql.ts  → full post_content
ELSE IF --fixture:
  USE parse-testimonials.ts            → TRUNCATED (warn in report)
```

Never commit truncated testimonials from fixture-only extract without documenting in PR.

### 3.4 Phase 3 gate

```bash
npm run wp:verify-custom-menus     # ≥ MIN_WIDGETS parsed
npm run wp:extract-content -- --dry-run   # if supported, else review extract-report.json
```

Compare parsed widget count vs `source-audit.json` counts — **must match within 0 for blocking widgets**.

---

## Phase 4 — Codegen (Codegen Agent)

### 4.1 Extract pipeline

```bash
# Live (preferred):
WP_HEADLESS_GRAPHQL_URL=http://SITE.local/graphql npm run wp:extract-content

# Offline (CI only — truncated testimonials):
npm run wp:extract-content -- --fixture

# Assets:
npm run wp:copy-assets

# Combined:
npm run wp:codegen
```

### 4.2 Review generated modules

```bash
git diff src/content/
git diff public/wp-migrated/
```

**Auto-generated (do not hand-edit):**
- `services.ts`, `clients.ts`, `testimonials.ts`, `rotating.ts`, `sections.ts`, `meta.ts`, `index.ts`

**Hand-curated (until wp_027 complete):**
- `service-blocks.ts`, `text-bands.ts`, `site-nav.ts`, `social-links.ts`

### 4.3 Emit pipeline rules

1. **Never run extract** expecting it to refresh hand-curated files without emit implementation.
2. **Split barrels** (recommended): generated exports in `index.generated.ts`; manual re-exports in `index.ts`.
3. **`customMenus` must be emitted** when wp_027 lands — until then, manual sync from parser output.

### 4.4 Phase 4 gate

| Check | Command |
|-------|---------|
| TypeScript | `npx tsc --noEmit` |
| Lint | `npm run lint` |
| Extract report clean | Review `data/extracted/extract-report.json` warnings |
| No truncated testimonials | Grep `…` in `testimonials.ts` — must be 0 on live extract |

---

## Phase 5 — Widgets (Widget Agent)

### 5.1 Map registry → components

For each registry entry with non-null `component`:

1. Create or extend `src/widgets/home/{Component}.tsx`
2. Import from `@/content` — never hardcode copy/images
3. Match DOM structure from fixture HTML (TheGem class names)
4. Track depth in `docs/tasks/WIDGET-PARITY-TASKS.md`

**Dame Luthas reference implementations:**

| Widget | Component | File |
|--------|-----------|------|
| `thegem-custom-menu` ×14 | ServiceBlockSection + stagger | `ServiceBlockSection.tsx`, `ServiceStaggerRow.tsx` |
| `thegem-styledimage` | StyledImage | `StyledImage.tsx` |
| `thegem-testimonials` | TestimonialsCarousel | `TestimonialsCarousel.tsx` |
| `thegem-clients` | LogoMarquee | `LogoMarquee.tsx` |
| Hero | Hero + AnimatedHeading | `Hero.tsx`, `AnimatedHeading.tsx` |

### 5.2 Compose homepage

Edit `src/app/page.tsx`:
- Section order matches `parse-widget-walk.ts` DOM order
- Anchor IDs match WP (`#services`, `#work`, etc.)
- Enable native shell when content modules exist (`isNativeSiteShellEnabled()`)

### 5.3 Phase 5 gate

```bash
npm run build
npm run start -- -p 3000 &
npm run test:parity
```

---

## Phase 6 — Design tokens (Design Agent)

```bash
npm run wp:extract-design-system    # → data/extracted/design-system.json
npm run thegem:audit-css            # remix manifest vs pilot CSS
```

**SSOT:** `src/shared/lib/design-tokens.ts`  
**Remix CSS:** `src/shared/design/thegem/`

Target: replace pilot CSS proxy with native remix before production deploy.

---

## Phase 7 — Parity & QA (Parity Agent)

### 7.1 Three-layer verification

| Layer | Command | What it proves |
|-------|---------|----------------|
| Registry | `npm run wp:verify-widget-census` | No silent widget drops |
| Custom menus | `npm run wp:verify-custom-menus` | Parser coverage |
| Visual | `npm run wp:visual-parity-audit` | Layout, fonts, colors, motion |
| Public routes | `npm run verify:public-routes` | Every WP public URL → Next 200 + H1 |
| E2E | `npm run test:parity` | Playwright homepage checks |

**Both servers required for visual audit:**
- Next: `http://localhost:3000`
- WP reference: `http://SITE.local/`

### 7.2 Pre-commit gate (automatic on commit)

`.githooks/pre-commit` → `scripts/pre-commit-gate.mts`:
1. `tsc --noEmit`
2. `lint`
3. `wp:verify-custom-menus` (if parser files changed)
4. `wp:verify-widget-census` (if registry changed)

### 7.3 CI gate (`.github/workflows/ci.yml`)

```yaml
- npm ci
- npx tsc --noEmit
- npm run lint
- npm run build
- npm run wp:verify-custom-menus
- npm run wp:verify-widget-census  # continue-on-error if no audit artifact
```

### 7.4 Phase 7 gate (merge blocker)

All must pass:
- [ ] `npm run build` — 0 Turbopack warnings (or documented suppressions)
- [ ] `npm run test:parity`
- [ ] `npm run wp:visual-parity-audit` — no P0 layout gaps
- [ ] `npm run verify:public-routes` — all public WP URLs have Next equivalents (when implemented)
- [ ] `WIDGET-PARITY-TASKS.md` + `MIGRATION-BACKLOG.md` updated for any partial implementations

---

## Phase 8 — Build hygiene (Build Agent)

### 8.1 Turbopack rules (mandatory)

**Never in `src/`:**
```typescript
// ❌ ANTI-PATTERN
path.join(process.cwd(), "local-wp/app/public/wp-content")
path.join(process.cwd(), "temp/plugins")
```

**Always:**
```typescript
// ✅ CORRECT — src/shared/lib/headless/wp-content-root.ts
const publicRoot = process.env.LOCAL_WP_PUBLIC_PATH?.trim();
if (!publicRoot) return buildStubContentDirs(); // public/wp-migrated
```

**Config JSON:** read only in `scripts/wp/lib/load-local-wp-env.ts` — never in Next bundle.

**next.config.ts must include:**
```typescript
turbopack: {
  ignoreIssue: [
    { path: "src/shared/lib/headless/wp-content-root.ts" },
    { path: "src/shared/lib/headless/wp-content-paths.ts" },
  ],
},
outputFileTracingExcludes: {
  "*": ["./local-wp/**", "./temp/**"],
},
```

### 8.2 Build verification

```bash
npm run build
# Expect: no "Overly broad patterns" warnings
# Expect: compile < 60s (with ignoreIssue + no in-repo local-wp in env during CI)
```

### 8.3 Production deploy checklist

- [ ] `LOCAL_WP_PUBLIC_PATH` **unset** on Vercel
- [ ] `public/wp-migrated/` assets committed or on CDN
- [ ] Native shell enabled (remix CSS, not pilot proxy)
- [ ] `HEADLESS_PILOT_CSS=false` in production env

---

## Site-specific fork guide

### Luthas Center (`luthas-center-app`)

| Step | Adaptation |
|------|------------|
| Copy tooling | `scripts/wp/` from dame-luthas-app |
| Audit URL | `npm run wp:audit-source -- http://luthascenter.local/` |
| Mu-plugin | Register LMS CPTs, course content types |
| Widget registry | New audit → new mappings (expect different widget mix) |
| Content modules | `src/content/` per site — do not share with dame-luthas |
| Supabase | May need DB-driven catalog (see damieus-com-migration patterns) |

### Luthas Org (`luthas-org-app`)

| Step | Adaptation |
|------|------------|
| Audit URL | `npm run wp:audit-source -- http://luthas.org.local/` |
| Expectation | More blog/post widgets, fewer TheGem portfolio widgets |
| Parsers | Post list, category nav — likely fewer custom-menu carousels |

### Dame Luthas (`dame-luthas-app`) — remaining work

| Task ID | Action |
|---------|--------|
| `task_luthas_wp_027` | Emit `service-blocks.ts` from `parseCustomMenus()` |
| Fixture refresh | Re-capture page 375 HTML (11 custom menus) |
| `task_luthas_wp_029` | `thegem-styledbutton` CTA skin parity |
| `task_luthas_wp_030` | P8 hover remix scope |

---

## Swarm execution timeline (recommended)

```
Day 1  │ Phase 0 Infra + Phase 1 Audit
       │ Deliverable: source-audit.json, registry 100%
       │
Day 2  │ Phase 2 Schema + Phase 3 Parsers (parallel)
       │ Deliverable: mu-plugin installed, fixture captured
       │
Day 3  │ Phase 4 Codegen + Phase 5 Widgets (start)
       │ Deliverable: src/content/*.ts, page.tsx skeleton
       │
Day 4  │ Phase 5 Widgets (complete) + Phase 6 Design
       │ Deliverable: homepage renders, remix CSS started
       │
Day 5  │ Phase 7 Parity + Phase 8 Build
       │ Deliverable: PR ready, visual audit PASS
       │
Day 6+ │ WIDGET-PARITY-TASKS depth items (P2/P3)
```

Adjust per site complexity. Dame Luthas homepage took ~5 active sessions due to infra blockers and visual parity iterations.

---

## Command quick reference

```bash
# Infrastructure
npm run wp:sync-local
npm run wp:install-graphql
npm run wp:probe-schema
npm run wp:verify

# Audit & registry
npm run wp:audit-source [-- URL]
npm run wp:verify-widget-census
npm run wp:verify-custom-menus

# Codegen
npm run wp:extract-content [-- --fixture]
npm run wp:copy-assets
npm run wp:codegen

# Design
npm run wp:extract-design-system
npm run thegem:audit-css

# QA
npm run build
npm run test:parity
npm run wp:visual-parity-audit

# Dev
npm run dev
npm run build && npm run start -- -p 3000

# Hooks
git config core.hooksPath .githooks
```

---

## PR template (agent fill-in)

```markdown
## Migration phase completed
- [ ] Phase N — {name}

## Widget census
- Front page ID: {ID}
- Widget types mapped: {N}/{N}
- Custom menus parsed: {N} (live census: {N})

## Extract mode
- [ ] Live GraphQL
- [ ] Fixture only (explain why)

## Gates run
- [ ] tsc --noEmit
- [ ] lint
- [ ] build (0 Turbopack warnings)
- [ ] wp:verify-custom-menus
- [ ] wp:verify-widget-census
- [ ] test:parity
- [ ] wp:visual-parity-audit

## WIDGET-PARITY-TASKS updates
- {task_id}: {status}

## Known gaps / follow-ups
- ...
```

---

## Escalation paths

| Symptom | First check | Escalate to |
|---------|-------------|-------------|
| GraphQL fetch failed | Local site running? | Infra Scout |
| Census FAIL | `source-audit.json` unmapped types | Audit Agent → registry edit |
| Truncated testimonials | Extract used `--fixture`? | Schema Agent → live extract |
| Build 60k file warnings | Static local-wp paths in src? | Build Agent → wp-content-root.ts |
| Visual FAIL, census PASS | Implementation depth | Widget Agent → WIDGET-PARITY-TASKS |
| WP-CLI hang | — | **Abandon CLI** → GraphQL mu-plugin |

---

## Related documents

| Document | Path |
|----------|------|
| Lessons learned (errors) | [LESSONS-LEARNED-DAME-LUTHAS-WP-MIGRATION.md](./LESSONS-LEARNED-DAME-LUTHAS-WP-MIGRATION.md) |
| 6-phase playbook | [MIGRATION-PLAYBOOK.md](./MIGRATION-PLAYBOOK.md) |
| Homepage TSA | [architecture/HOMEPAGE-GRAPHQL-CODEGEN-TSA.md](./architecture/HOMEPAGE-GRAPHQL-CODEGEN-TSA.md) |
| Implementation backlog | [tasks/WIDGET-PARITY-TASKS.md](./tasks/WIDGET-PARITY-TASKS.md) |
| Cross-site walkthrough | [MIGRATION-WALKTHROUGH.md](./MIGRATION-WALKTHROUGH.md) |

---

*Swarm playbook v1 — synthesized from Dame Luthas migration session + four deep-dive agent audits, 2026-06-11.*
