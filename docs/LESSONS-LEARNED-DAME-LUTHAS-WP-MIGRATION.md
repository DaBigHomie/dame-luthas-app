# Lessons Learned — Dame Luthas WP → Next.js Migration

> **Session arc:** `sess_luthas_wp_react_20260607` → `sess_dame_luthas__20260611`  
> **Primary repo:** `dame-luthas-app`  
> **Tasks:** `task_luthas_wp_006` (parent), `task_luthas_wp_020`–`031` (spawned)  
> **Transcript:** [136c1a39-9b65-436b-8f82-8d8fc39b4389](136c1a39-9b65-436b-8f82-8d8fc39b4389)  
> **Related docs:** [MIGRATION-PLAYBOOK.md](./MIGRATION-PLAYBOOK.md) · [SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md](./SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md) · [WIDGET-PARITY-TASKS.md](./tasks/WIDGET-PARITY-TASKS.md) · [MIGRATION-BACKLOG.md](./tasks/MIGRATION-BACKLOG.md) · [HOMEPAGE-GRAPHQL-CODEGEN-TSA.md](./architecture/HOMEPAGE-GRAPHQL-CODEGEN-TSA.md)

This document catalogs **every significant error, false start, and architectural pivot** from the Dame Luthas headless migration session. It is written for engineers and agents who will repeat this work on **Luthas Center**, **Luthas Org**, or other Elementor/TheGem sites.

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Infrastructure & Local WP errors](#2-infrastructure--local-wp-errors)
3. [GraphQL & extraction errors](#3-graphql--extraction-errors)
4. [Pilot / CSS / snapshot mode errors](#4-pilot--css--snapshot-mode-errors)
5. [Next.js app & visual parity errors](#5-nextjs-app--visual-parity-errors)
6. [Widget registry & census errors](#6-widget-registry--census-errors)
7. [Codegen & emit pipeline errors](#7-codegen--emit-pipeline-errors)
8. [Turbopack & build errors](#8-turbopack--build-errors)
9. [Tooling & workflow mistakes](#9-tooling--workflow-mistakes)
10. [False starts & dead ends](#10-false-starts--dead-ends)
11. [What worked vs what did not](#11-what-worked-vs-what-did-not)
12. [Open issues at session end](#12-open-issues-at-session-end)
13. [Mitigation checklist for next site](#13-mitigation-checklist-for-next-site)

---

## 1. Executive summary

The Dame Luthas migration attempted to move an Elementor + TheGem WordPress homepage to native Next.js React widgets fed by a **codegen pipeline** (`scripts/wp/*` → `src/content/*.ts` → `src/widgets/home/*`).

**The dominant failure modes were:**

| Category | Symptom | Root cause |
|----------|---------|------------|
| **Silent data loss** | Missing homepage sections | Unmapped `data-widget_type` in registry |
| **False confidence** | Tests PASS, screenshots wrong | Text-grep parity ≠ layout parity |
| **Truncated content** | Testimonials end with `…` | HTML render uses excerpts, not `post_content` |
| **Local WP fragility** | GraphQL `fetch failed`, WP-CLI hangs | Site halted, stale paths, ssh-entry stalls |
| **Build performance** | 4 Turbopack warnings, ~88s builds | Static `path.join(process.cwd(), "local-wp/...")` in Next bundle |
| **Dual SSOT drift** | Extract updates `services.ts`, page uses `service-blocks.ts` | Partial emit pipeline; hand-curated blocks not codegen'd |

**Strategic pivot that saved the project:** Treat WordPress as **extract-only** (GraphQL + Cheerio at dev time), not a runtime headless CMS. Ship committed TypeScript content modules + native React widgets.

---

## 2. Infrastructure & Local WP errors

### 2.1 Stale Local WP path in ssh-entry script

**When:** Early session, every WP-CLI attempt  
**Error message:**
```
/Users/dame/Library/Application Support/Local/ssh-entry/cfEOO-2XZ.sh: line 28: cd: /Users/dame/management-git/wordpress-local/dameluthas-com-restore/app/public: No such file or directory
```

**Root cause:** Site moved from `management-git/wordpress-local/` to `~/Unused Repos/wordpress-local/`. Local's ssh-entry script retained the old path.

**Fix applied:**
- `scripts/wp/sync-local-wp-path.mts`
- Canonical config: `scripts/wp/local-wp.config.json`
- Symlink + patched ssh-entry script

**Lesson:** Before any WP-CLI or Local shell work, run `npm run wp:sync-local` and verify `publicPath` in config matches disk.

---

### 2.2 GraphQL `fetch failed` while site appeared configured

**When:** L122–150 (verify-headless, extract attempts)  
**Error:** `"Nothing listening (fetch failed)"` against `http://dameluthas.local/graphql`

**Root cause:** Local site was **halted** or stuck in **starting** — not a GraphQL plugin misconfiguration.

**Fix applied:**
- Improved diagnostics in `scripts/wp/verify-headless.mts`
- Check `site-statuses.json` / Local app status **before** chasing schema issues

**Manual step:** Stop → Start site in Local WP app.

---

### 2.3 Nginx stuck in `starting`

**When:** L146–150  
**Root cause:** Missing directory:
```
/Users/dame/Library/Application Support/Local/run/cfEOO-2XZ/nginx/logs/
```

**Fix:** Create logs dir; `wp:sync-local` ensures it on future runs.

**Lesson:** If Local site won't reach "running", check nginx/php logs dirs exist under `~/Library/Application Support/Local/run/{site-id}/`.

---

### 2.4 Wrong WordPress hostname confusion

**When:** Early session  
**Sites involved:**
- `dameluthas-com-restore.local` (legacy restore)
- `dameluthas.local` (live multisite front)

**Root cause:** Config pointed at wrong hostname while debugging.

**Fix:** All extractors and `.env.example` standardized on `dameluthas.local`.

**Lesson:** Document canonical local URL in `local-wp.config.json` + `.env.example`. Never assume backup site slug = production slug.

---

### 2.5 Disk full (ENOSPC)

**When:** PR #1 build (L379)  
**Error:** Build failed with ENOSPC; ~116 MB free on disk  
**Symptoms:** Turbopack SST write failures during long `npm run dev` (~11h)

**Fix applied:** Cleared `.next`; build succeeded after freeing space.

**Lesson:** Keep ≥5 GB free before `npm run build`. Kill stale dev servers; prefer `npm run build && npm run start` for QA over multi-hour `dev`.

---

### 2.6 Stale Turbopack dev process (500 errors)

**When:** L461, L468  
**Symptoms:** Dev server 500; manifest errors after long runtime  
**Fix:** Kill PID, `rm -rf .next`, use production build for verification.

---

## 3. GraphQL & extraction errors

### 3.1 REST page-meta locked (404)

**When:** TSA discovery phase  
**Error:** REST endpoints return 404; no `_elementor_data` via REST

**Root cause:** Security hardening on source WP — meta not exposed via REST.

**Workaround:** WPGraphQL + custom mu-plugin (`scripts/wp/templates/dameluthas-headless-graphql.php`).

**Lesson:** Do not plan on REST for Elementor meta. Probe REST early; pivot to GraphQL mu-plugin if blocked.

---

### 3.2 Wrong homepage page ID (14 vs 375)

**When:** L326  
**Root cause:** Page 14 appeared in early probes; actual front page is **375** (`isFrontPage: true`).

**Fix:** All extractors, TSA, and fixtures target page **375**.

**Lesson:** Run `npm run wp:probe-schema` — never assume slug or first page ID. Confirm with:
```graphql
{ pages(where: { isFrontPage: true }) { nodes { databaseId slug } } }
```

---

### 3.3 Service cards assumed to be WP nav menus

**When:** L339, L353  
**Wrong assumption:** `menuItems` GraphQL query returns service carousel cards.

**Reality:** `dameluthas-main-menu` has 3 nav items. Service cards are **`thegem-custom-menu`** Elementor widgets in page HTML.

**Fix:** Cheerio parser `parse-custom-menus.ts` walks `.thegem-menu-custom--vertical` DOM.

**Lesson:** GraphQL `menus` ≠ Elementor widget content. Audit `data-widget_type` first.

---

### 3.4 Clients/testimonials not standalone CPTs in rendered HTML

**When:** L339  
**Root cause:** Clients and testimonials embedded in page 375 Elementor HTML, not separate queryable collections (initially).

**Fix:** HTML-parse fallback in `extract-wp-content.mts`; later GraphQL for testimonial bodies.

---

### 3.5 Testimonial quotes truncated in HTML

**When:** L436, L468, L1080  
**Symptom:** Quotes end with `&hellip;` / `…` in rendered HTML  
**Example (fixture):**
```html
<div class="post-content styled-subtitle">Before Dame Luthas joined our cause, ... Google&hellip;</div>
```

**Root cause:** TheGem carousel renders excerpt-length text in DOM, not full `post_content`.

**Fix (`task_luthas_wp_022`):**
- Mu-plugin: `dameluthasTestimonialQuotes` root query + `thegem_testimonial` CPT registration
- `fetch-testimonials-graphql.ts` overrides HTML parse on live extract
- Install: `npm run wp:install-graphql`

**Verified:** Live extract produces 693+ char quotes with no truncation in `src/content/testimonials.ts`.

**Pitfall:** `npm run wp:extract-content -- --fixture` **skips GraphQL** → re-emits truncated quotes. Always use live extract before committing testimonials.

---

### 3.6 `thegemTestimonials` GraphQL connection empty

**When:** Schema probe phase  
**Symptom:** `thegemTestimonials { nodes { ... } }` returns empty; CPT not in `contentTypes` list

**Root cause:** CPT not registered for GraphQL until mu-plugin installed + cache flush.

**Workaround:** Custom root resolver `dameluthasTestimonialQuotes` using `get_posts()` directly — bypasses connection layer.

**Lesson:** After `wp:install-graphql`, run `npm run wp:probe-schema`. If connection queries fail, add custom root fields.

---

### 3.7 WP-CLI hung ~14 minutes / aborted

**When:** L302, L647  
**Attempts:**
- About page Elementor meta via Local ssh-entry
- Testimonial body fetch via `wp post meta get`

**Root cause:** Local `ssh-entry` bootstrap stalls on non-interactive `wp` commands.

**Resolution:** **Abandoned WP-CLI path** for codegen. GraphQL mu-plugin is the durable approach.

**Lesson:** Do not depend on WP-CLI for extraction pipelines. If CLI needed for one-off ops, run interactively in Local's shell — never in CI or agent loops.

---

### 3.8 About page empty Elementor body

**When:** L230–247  
**Root cause:** Page 11257 has empty Elementor body; content lives in TheGem templates/footer.

**Fix:** Native `AboutPage.tsx` + `thegem_templates` GraphQL query.

**Lesson:** Not every page is extractable from `page.content`. Check template CPTs and footer assignments.

---

### 3.9 CORTEX cloud FK error

**When:** L353  
**Symptom:** Foreign key error when syncing tasks to cloud DB  
**Impact:** Cosmetic — local SQLite is source of truth for session tasks.

---

## 4. Pilot / CSS / snapshot mode errors

### 4.1 Snapshot mode: plugins inactive

**When:** Early pilot (L69)  
**Symptom:** SQL dump → JSON snapshot has no PHP runtime; shortcodes dead, plugin CSS paths 404

**By design:** Snapshot is offline reference, not styling source.

**Pivot:** Native React widgets + design token remix OR live WP CSS proxy for pilot phase only.

---

### 4.2 Plugin/theme CSS 404 in pilot

**When:** L69  
**Symptom:** `/wp-content/plugins/elementor/assets/css/frontend.min.css` → 404 in Next app

**Fix:**
- `/api/wp-content/[[...path]]/route.ts` filesystem proxy
- `WpPilotStyles.tsx` + rewrite in `next.config.ts`: `/wp-content/*` → `/api/wp-content/*`

---

### 4.3 CF7 / WooCommerce shortcodes dead in pilot

**When:** L69  
**Status:** **Open** — needs native React replacements (ContactFormBlock got fallback during review).

---

## 5. Next.js app & visual parity errors

### 5.1 Missing containers (silent drops)

**When:** L518, L542  
**Root cause:** No registry handler for `data-widget_type` (e.g. `thegem-styledimage`, `thegem-clients`)

**Fix:** `widget-registry.ts` + 6-phase playbook; census gate.

**Lesson:** This is the **primary bug class** — unmapped widget = missing DOM subtree in React.

---

### 5.2 Parity audit false PASS

**When:** L518  
**Symptom:** Text-presence checks passed; layout/animation clearly wrong in user screenshots

**Fix:** `scripts/wp/visual-parity-audit.mts` + screenshot-driven fixes

**Lesson:** Never ship on grep-only parity. Require computed styles, section order, and visual audit.

---

### 5.3 AnimatedHeading mid-word letter breaks

**When:** L541  
**Root cause:** `letters-slide-up` split individual characters without word-group boundaries

**Fix:** Word-group letter structure in `AnimatedHeading.tsx`

---

### 5.4 Wrong hero copy hardcoded

**When:** L541  
**Root cause:** `migrate-content.mts` had `"Hi, I'm Dame Luthas."` instead of WP copy

**Fix:** `parse-hero.ts` from page 375 HTML

---

### 5.5 Wrong homepage section order

**When:** L541  
**Fix:** Reordered `src/app/page.tsx` to match DOM walk

---

### 5.6 Service grid vs stagger layout

**When:** L541, L548, `task_luthas_wp_020`  
**Symptom:** Registry mapped `StyledImage×14` but UI rendered simplified 3-column grid

**Fix:** `ServiceStaggerRow.tsx`, `ServiceBlockSection.tsx` refactor, `StyledImage.tsx` TheGem markup

**Lesson:** Registry entry names a component — **implementation depth** tracked separately in `WIDGET-PARITY-TASKS.md`.

---

### 5.7 Header/Footer 500 without migrated JSON

**When:** L468  
**Root cause:** Components assumed `data/migrated/content.json` always present

**Fix:** `isMigratedAvailable()` fallbacks; native shell via `isNativeSiteShellEnabled()`

---

### 5.8 Hero H1 wrong breakpoints

**When:** L514  
**Symptom:** `clamp()` gave 66px/49px vs WP 50px/40px

**Fix:** Explicit media queries in `globals.css`

---

### 5.9 WP reference audit partial fail (lazy-loaded sections)

**When:** L514  
**Status:** **Open** — audit script needs deeper scroll for below-fold content

---

### 5.10 PortfolioFilterMenu useEffect error in stale dev

**When:** L430 (PR #2)  
**Fix:** Resolved in merged PR; stale dev masked fix.

---

### 5.11 ContactFormBlock deploy crash

**When:** L489 (MALFIG review)  
**Root cause:** No fallback when migrated JSON absent  
**Fix:** Added fallback during review.

---

## 6. Widget registry & census errors

### 6.1 Registry PASS ≠ visual PASS

**When:** L548, L1567  
**Symptom:** `npm run wp:verify-widget-census` exits 0; homepage still visually diverges

**Mechanism:** `auditWidgetTypes()` only checks registry **presence**, not component fidelity:

```typescript
// scripts/wp/lib/widget-registry.ts — census checks mapping only
if (!entry) {
  gaps.push({ reason: "No registry entry — container will drop silently during extract" });
}
```

**Fix (process, not code):** Split gates:
| Gate | Command | Guarantees |
|------|---------|------------|
| Registry census | `wp:verify-widget-census` | No silent drops |
| Visual parity | `wp:visual-parity-audit`, `test:parity` | Layout fidelity |
| Implementation backlog | `WIDGET-PARITY-TASKS.md` | Depth tracking |

---

### 6.2 Fixture vs live custom-menu count (8 vs 11)

**When:** L640, verify-custom-menus  
**Counts:**

| Source | `thegem-custom-menu.default` |
|--------|-------------------------------|
| Live audit (`source-audit.json`) | **11** |
| Fixture (`page-375.html`) | **8** |
| Parsed menus (extract report) | **8** |

**Root cause:** Fixture stale — missing carousel slides 02/03 widgets present on live site.

**Gate behavior:** `verify-custom-menus.mts` PASS at ≥8, **warns** at <11.

**Extract warning too weak:** Only warns if `< 7` custom menus parsed.

**Status:** **Open** — refresh fixture from live GraphQL.

---

## 7. Codegen & emit pipeline errors

### 7.1 `emit-content.ts` overwrites `index.ts` exports

**When:** L417, L985  
**Symptom:** Manual exports (`site-nav`, `social-links`) lost after extract

**Mechanism:** `emitContentModules()` always rewrites `src/content/index.ts` with fixed export list.

**Fix applied:** Re-added exports in emit template after incident.

**Recommended long-term fix:** Split barrels — `index.generated.ts` + hand-curated `index.ts`.

---

### 7.2 Dual SSOT for services

**Files:**
- `src/content/services.ts` — **auto-generated**, legacy 3-column shape
- `src/content/service-blocks.ts` — **hand-curated**, used by `page.tsx`

**Symptom:** `wp:codegen` updates `services.ts` but homepage reads `serviceBlocks`.

**Status:** `task_luthas_wp_027` **partial** — emit from `parse-custom-menus.ts` not implemented.

---

### 7.3 `customMenus` parsed but never emitted

**Evidence:** `ParsedHomepage.customMenus` populated; no `writeModule()` for it in `emit-content.ts`.

**Status:** Open — part of wp_027.

---

### 7.4 `parse-widget-walk.ts` not wired into extract

**Status:** Used in pre-commit gate only; not in `extract-wp-content.mts` orchestrator.

---

### 7.5 Three testimonial code paths (confusion risk)

| Path | File | Status |
|------|------|--------|
| HTML Cheerio | `parse-testimonials.ts` | Truncated — fixture fallback |
| GraphQL root query | `fetch-testimonials-graphql.ts` | **Active** on live extract |
| GraphQL by ID | `fetch-testimonials-by-id.ts` | **Unused** — rejects `…` suffix |

**Lesson:** Document extract mode in commit messages. Deprecate unused path.

---

## 8. Turbopack & build errors

### 8.1 Four "Overly broad patterns" warnings

**When:** User build log (Next.js 16.2.7 Turbopack)  
**Warnings:**

| # | Location | Pattern | Files matched |
|---|----------|---------|---------------|
| 1 | `wp-content-paths.ts:9` | `/ROOT/local-wp/app/public/wp-content` | 61,430 |
| 2 | `wp-content-paths.ts:15` | `.../wp-content/plugins` | 57,700 |
| 3 | `wp-content-paths.ts:21` | `/ROOT/temp/plugins` | 57,701 |
| 4 | `wp-media/route.ts:31` | uploads + dynamic segments | 20,088 |

**Root cause:** Static `path.join(process.cwd(), "local-wp/...")` in modules imported by `layout.tsx` and API routes. Turbopack treats these as bundler inputs.

**Import traces:**
```
layout.tsx → WpPilotStyles → wp-content-paths → (local-wp tree)
api/wp-content/route.ts → wp-content-paths
api/wp-media/route.ts → uploadsRoot()
```

---

### 8.2 Fixes attempted (chronological)

| Attempt | Result |
|---------|--------|
| Hardcoded `local-wp/` + `temp/` paths | ❌ 4 warnings, ~51s compile |
| Read `local-wp.config.json` in Next module | ❌ 2 warnings remain, ~88s compile (regression) |
| `server-only` package on unrelated modules | ❌ No effect on path warnings |
| Dynamic `import()` in API routes + `PilotStylesGate` | ✅ Partial — 4→2 warnings, wp-media warning gone |
| Env-only `LOCAL_WP_PUBLIC_PATH` (no config in bundle) | ✅ Correct architecture; 2 warnings if env points in-repo |
| `outputFileTracingExcludes` for `local-wp/**`, `temp/**` | ✅ Vercel deploy hygiene; does not fix Turbopack |
| `turbopack.ignoreIssue` in `next.config.ts` | ✅ **0 warnings**, ~23–55s compile |

**Final pattern:**
- `src/shared/lib/headless/wp-content-root.ts` — env only, stub to `public/wp-migrated` when unset
- `scripts/wp/lib/load-local-wp-env.ts` — config JSON for Node scripts only
- `PilotStylesGate.tsx` — async dynamic import of `WpPilotStyles`
- API routes — dynamic import of path helpers inside `GET`

---

### 8.3 Pitfalls for other projects

1. **`tsconfig exclude` ≠ bundler exclude** — excluding `local-wp` in tsconfig does not stop Turbopack.
2. **`.gitignore` does not stop Turbopack** — gitignored dirs on disk still get scanned if paths appear in code.
3. **Dynamic import is not a silver bullet** — Turbopack still analyzes reachable server modules.
4. **Best fix:** Store Local WP **outside** repo; set `LOCAL_WP_PUBLIC_PATH` to external absolute path.
5. **Target end state:** Codegen pilot CSS manifest — remove runtime `readdirSync` from layout graph.

---

## 9. Tooling & workflow mistakes

| Mistake | Impact | Correction |
|---------|--------|------------|
| Diagnosing GraphQL before Local site status | Wasted hours on plugin config | Check Local app running first |
| ESLint over full repo including `local-wp/` | Multi-minute hang, aborted | `eslint.config.mjs` ignores `local-wp/**`, `temp/**`, `data/**` |
| Text-only parity tests | False confidence | Visual audit + Playwright parity |
| Registry census without layout QA | "PASS" with wrong layout | `WIDGET-PARITY-TASKS.md` depth tracking |
| Hand-maintained `service-blocks.ts` | Drift from WP | Complete wp_027 auto-emit |
| Stale fixture HTML | 8/11 menu false PASS | Refresh from live GraphQL |
| Committing with disk full | ENOSPC build failure | Monitor disk; clear `.next` |
| Long-running background `npm run dev` | SST failures, stale 500s | Kill + rebuild for QA |
| Agents copied without repo fit | 17 agents from atb-migration-gate | Audit which agents apply per repo |
| Double `scripts/scripts/` path reference | Wrong extract script location | Use in-repo `scripts/wp/*` only |

---

## 10. False starts & dead ends

| Attempt | Why it failed | Replacement |
|---------|---------------|-------------|
| Full headless WP runtime | Strategic pivot to full migration | GraphQL extract-only + codegen |
| Live GraphQL while site halted | `fetch failed` | Stop→Start Local site |
| Snapshot pilot as final styling | No plugins, dead shortcodes | Native widgets + CSS remix |
| REST / page-meta for Elementor | 404 locked down | WPGraphQL mu-plugin |
| Homepage page ID 14 | Wrong page | Page **375** |
| Service cards via `menuItems` | Nav only, not carousel | `thegem-custom-menu` Cheerio parse |
| About page Elementor extract | Empty body | Native AboutPage + templates GraphQL |
| WP-CLI for meta/testimonials | Hung/aborted 14 min | `dameluthasTestimonialQuotes` GraphQL |
| Text-only parity tests | Passed, looked wrong | Visual parity audit |
| Static `local-wp/` in Next bundle | 60k Turbopack scan | Env-based paths + ignoreIssue |
| Production GraphQL at dameluthas.com | Not local extract target | `dameluthas.local/graphql` only |

---

## 11. What worked vs what did not

### Worked ✅

| Decision | Evidence |
|----------|----------|
| Full migration (not ongoing headless WP) | Aligns with Luthas Center path |
| WPGraphQL + mu-plugin extensions | Page 375 HTML, templates, portfolio, testimonials |
| Codegen → `src/content/*.ts` | Repeatable `wp:extract-content` / `wp:codegen` |
| Cheerio HTML-parse for TheGem widgets | Services, clients where no CPT |
| 6-phase playbook + widget registry | Census PASS (15 types mapped) |
| WP CSS proxy for pilot phase | `/api/wp-content` + pilot stylesheet manifest |
| `AnimatedHeading` + CSS remix | Motion parity progress |
| Env-based WP path resolution | Turbopack 0 warnings |
| Pre-commit gate + CI | `.githooks/pre-commit`, `.github/workflows/ci.yml` |
| MALFIG / Scrutiny on PRs | PR #2 merged with quality gates |

### Did not work (needed pivot) ❌

| Decision | Why | Pivot |
|----------|-----|-------|
| Snapshot-only pilot as endpoint | No plugins, partial CSS | Native widgets + codegen |
| Structured GraphQL for everything | Many widgets are HTML-only | Hybrid Cheerio + GraphQL |
| WP menus = service cards | Menus are nav only | Parse Elementor widgets |
| Text-based e2e parity alone | Missed layout gaps | Visual audit |
| Registry entry = done | Mapping ≠ layout | WIDGET-PARITY-TASKS |
| Static local-wp in Next bundle | 60k-file scan | Env + lazy imports |
| WP-CLI via Local ssh-entry | Hangs | GraphQL mu-plugin |
| Rendered HTML for testimonial bodies | Excerpt truncation | `post_content` via GraphQL |

---

## 12. Open issues at session end (updated 2026-06-11)

| ID | Issue | Priority |
|----|-------|----------|
| Resend env | Contact form wired; fails without `RESEND_API_KEY` on Vercel | P1 |
| Vercel shell env | Stray `VERCEL_PROJECT_ID` pointed at workflow-agents — pin in shell | P1 |
| Structured prose | Gatorade/UN detail still uses HTML parse + `MigratedContent` | P2 |
| `task_luthas_wp_027` | Auto-emit `service-blocks.ts` from widget walk | P2 |
| Fixture drift | Refresh `data/fixtures/page-375.html` (8→11 menus) | P2 |
| `task_luthas_wp_029`–`031` | Button skins, P8 hovers, sites 2&3 | P2–P3 |
| Visual audit scroll | Below-fold lazy sections not audited | P2 |
| CF7/Woo shortcodes | Native replacements needed | P3 |
| Pilot CSS runtime walks | Codegen manifest to remove `readdirSync` from build graph | P3 |
| Split content barrels | Prevent emit clobbering manual exports | P2 |

**Closed 2026-06-11:** `task_luthas_wp_032`–`034` (de-WP runtime, media FSD, public routes); `task_luthas_wp_035`–`039` (contact, case-studies, portfolio detail); case-studies Gatorade bodyHtml leak; Vercel deploy hijack via manifest pin.

### 12.1 Session 2026-06-11 — case studies & deploy

| Lesson | Detail |
|--------|--------|
| **Index page bodyHtml** | WP exported full Gatorade article into `case-studies` page — index must not render `MigratedContent` for listing routes |
| **Vercel project drift** | Shell `VERCEL_PROJECT_ID` overrode CLI link — read org/project from `.codebase-manifest.json` and warn on mismatch |
| **content.json in CI** | Gitignore blocked build on Vercel — commit bundle + `prebuild` ensure script |
| **About route** | Live WP nav had no `/about` — block slug + remove nav rather than ship orphan page |
| **Structured case studies** | Registry merges with HTML parse — ship meta/testimonials first, prose migration second |

---

## 13. Mitigation checklist for next site

Before starting **Luthas Center** or **Luthas Org** migration, verify:

- [ ] Local WP restored; `npm run wp:sync-local` succeeds
- [ ] `LOCAL_WP_PUBLIC_PATH` in `.env.local` (prefer path **outside** Next repo)
- [ ] `npm run wp:install-graphql` + `wp:probe-schema` on source site
- [ ] Front page ID confirmed (not assumed from slug)
- [ ] `npm run wp:audit-source -- http://SITE.local/` → registry 100% mapped
- [ ] Fixture HTML captured from live GraphQL after any WP layout change
- [ ] Extract uses **live GraphQL** for full testimonial bodies (not fixture-only)
- [ ] Census + visual parity both run before merge
- [ ] No `path.join(process.cwd(), "local-wp")` in `src/` — env only
- [ ] `git config core.hooksPath .githooks` enabled
- [ ] Disk space ≥5 GB before build
- [ ] Do not use WP-CLI in automated extract pipelines

**Follow the step-by-step agent playbook:** [SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md](./SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md)

---

## Appendix A — Task ID outcome map

| Task ID | Scope | Outcome |
|---------|-------|---------|
| `task_luthas_wp_006` | Dame Luthas migration shell | In progress → PRs merged |
| `task_luthas_wp_020` | StyledImage stagger | ✅ Complete |
| `task_luthas_wp_021` | Custom-menu widget walk | ✅ Complete |
| `task_luthas_wp_022` | Full testimonials GraphQL | ✅ Complete |
| `task_luthas_wp_023`–`026` | Social, watermark, portfolio, nav | ✅ Complete |
| `task_luthas_wp_027` | Auto-emit service-blocks | ⏳ Partial |
| `task_luthas_wp_028` | CI workflow | ✅ Complete |
| `task_luthas_wp_029`–`031` | Buttons, hovers, sites 2&3 | Pending |
| `task_luthas_wp_032`–`039` | De-WP, media FSD, public routes, contact/case-studies/portfolio | Pending |

---

## Appendix B — Key file index

```
scripts/wp/
  sync-local-wp-path.mts      # Fix stale Local paths
  verify-headless.mts         # GraphQL smoke check
  extract-wp-content.mts      # Homepage codegen CLI
  lib/widget-registry.ts      # Widget census SSOT
  lib/emit-content.ts         # TS module emitter
  lib/parsers/                # Cheerio + GraphQL parsers
  templates/dameluthas-headless-graphql.php
  visual-parity-audit.mts
  verify-widget-census.mts
  verify-custom-menus.mts
  pre-commit-gate.mts         # via .githooks/pre-commit

src/shared/lib/headless/
  wp-content-root.ts          # Turbopack-safe path resolution
  wp-content-paths.ts         # Pilot CSS manifest

docs/
  MIGRATION-PLAYBOOK.md
  SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md
  LESSONS-LEARNED-DAME-LUTHAS-WP-MIGRATION.md  (this file)
  tasks/WIDGET-PARITY-TASKS.md
  architecture/HOMEPAGE-GRAPHQL-CODEGEN-TSA.md
```

---

*Generated from session transcript + four deep-dive agent audits, 2026-06-11.*

## Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-06-25 | — | Initial version |
