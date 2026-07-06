---
title: Career Portfolio Delivery — Implementation Plan
doc_type: plan
repo: dame-luthas-app
session_id: career-portfolio-20260706
created: 2026-07-06
status: active
tags: [dame-luthas-app, portfolio, case-studies, e2e, a11y, automation, implementation-plan]
---

# Career Portfolio Delivery — Implementation Plan

> **Status:** Active · **Owner:** Portfolio Delivery Lead · **Last updated:** 2026-07-06
> **Doc type:** Plan (strategic, sequenced) · **Scope:** `dame-luthas-app` ONLY — the public Career Portfolio surface (case studies, portfolio detail pages, contact). No cortex/maximus infrastructure, no cluster/swarm framing — agents below are named by role.
> **CI model:** local quality gates own merge readiness. GitHub Actions are **RETIRED** as a governance gate for this workspace — a residual `.github/workflows/ci.yml` may still exist in-repo and can surface as a required check on GitHub's side; it is vestigial and is overridden with `--admin` at merge time where it blocks, never treated as the gate of record.

Every wave below carries an implementation **Detail** block, a **Prompt card** (the exact agent prompt + routing + commands), a pre-assigned **Worktree & branch**, an **Automation** tag, and a **Gate**, so a downstream agent can execute without re-deriving context.

---

## Value & Intent

### Goals
Make the Career Portfolio (case studies + portfolio detail pages + contact) fully green on the local critical-route suite, keep it refreshed against the latest career-corpus evidence without manual copy/paste, make each case study traceable to a cited evidence bundle, and hold accessibility/performance to a checked budget — all gated by the local suite, not by GitHub Actions.

### User intention
Dame wants a portfolio site that reliably renders every case study and portfolio page (no silent 400/500s), stays in sync with the underlying career-corpus evidence as it evolves, lets a visitor (or Dame) trace any claim in a case study back to its source bundle, and meets a baseline accessibility/performance bar — without hand-maintaining any of that.

### New features
- **F1** root-caused fix for the 8 failing local Playwright critical-route checks on `/case-studies` and `/portfolio/*`.
- **F2** per-case-study citation footer linking back to its source career-corpus bundle id.
- **F3** scheduled citation↔corpus refresh loop (new bridge script keeps `sourceBundleId` current as bundles evolve — does not touch the WP-sourced content bundle).
- **F4** local a11y + Lighthouse-budget gate wired into the pre-commit/pre-merge suite (no new GitHub Actions).

### User improvements
A portfolio that doesn't quietly 400 on its two most important content routes; case studies that stay current without manual re-authoring after every corpus refresh; visible provenance per case study (which bundle backs which claims); a baseline a11y/perf floor enforced automatically, locally.

### Overall improvements
Restores trust in the local Playwright suite as a real merge signal (it currently reports failures without a verified cause); closes the loop between `career-corpus` (evidence) and `dame-luthas-app` (presentation) so the two never drift silently; adds a lightweight provenance layer that also strengthens the truthfulness posture used elsewhere in the Dame Luthas career tooling; converts "gate via CI" into "gate via local suite," consistent with GitHub Actions being retired.

### Agents used
| Role | Responsibility | Waves |
|---|---|---|
| Portfolio Delivery Lead | sequencing, routing, final gate sign-off | all |
| Route Diagnostics Engineer | reproduces and root-causes the Playwright failures | 1 |
| Case Study Author | implements the per-case-study citation footer | 2 |
| Content Pipeline Engineer | builds/schedules the citation↔corpus refresh loop | 3 |
| Accessibility & Performance Auditor | wires the a11y + Lighthouse-budget local gate | 4 |
| Independent Reviewer | reviews each wave's diff before merge (separation of duties) | all |

### Scripts used
- `scripts/e2e/discover-routes.mts` — regenerates `reports/route-manifest.json` consumed by `e2e/fixtures/routes.ts` (Wave 1)
- `e2e/route-health.spec.ts` (`npm run test:e2e:critical`) — the failing critical-route suite being root-caused (Wave 1)
- `e2e/browser-devtools.spec.ts` (`npm run test:devtools`) — existing console/network/a11y-basics layer, extended in Wave 4
- `scripts/wp/ensure-migrated-content.mts` (`npm run prebuild`) — guarantees `data/migrated/content.json` presence before every build (Wave 1 diagnostic input)
- `scripts/checkpoint.mts` — session checkpoint writer, used to log wave completion state (all waves)
- `scripts/pre-commit-gate.mts` — local pre-commit gate, extended in Wave 4 with the a11y/Lighthouse budget check
- `scripts/run-ci-parity.mts` (`npm run ci:parity`) — local stand-in for CI parity, used as the Wave 4 gate runner
- `../career-corpus/enriched/bundles/INDEX.md` (upstream, read-only) + a new `scripts/corpus/sync-bundle-citations.mts` — the citation↔corpus refresh loop (Wave 3); deliberately does NOT reuse `wp:build-content`/`assets:pipeline`, which are verified WP-only (see Wave 3 finding)
- `scripts/supabase/seed-from-wp-bundle.mts` (`npm run db:seed`) — reference pattern for a repeatable, idempotent script; Wave 3's bridge script follows this shape
- `scripts/design/audit-contrast.mts` — existing contrast auditor, reused as an input to the Wave 4 a11y gate

### Monetary value
`revenue_impact: enables-direct` — the portfolio is Dame's primary proof-of-work surface for landing interviews and consulting engagements; it does not bill directly, but a broken or stale portfolio directly suppresses conversion on every inbound link (job applications, recruiter outreach, consulting inquiries). Maintenance cost is low: all four waves are deterministic TypeScript scripts plus one scheduled loop, no new paid infrastructure.

---

## Sequenced waves

A wave starts only after the prior wave's gate passes, except Wave 4 (a11y/Lighthouse), which is independent of Waves 2/3 content changes and may run in parallel once Wave 1 is green.

> [!IMPORTANT]
> **forensic-auditing finding (DAG dependency order).** The corpus-sync loop (citation-bundle sync) reads the `sourceBundleId` field that the citation-footer wave introduces — syncing citations before that field exists is a broken dependency. Fixed: the citation footer is sequenced as **Wave 2** (data model + UI) and the corpus↔citation sync loop as **Wave 3** (depends on Wave 2's field), so every wave only depends on strictly prior waves — no forward references.

### Wave 1 — Root-cause the critical-route failures · blast **low** · no auth
**Detail.** `npm run test:e2e:critical` currently reports 8 failing checks against `/case-studies` and `/portfolio/*` (HTTP ≥ 400). A prior investigation claimed this was caused by a gitignored `data/migrated/content.json` — that claim is **false**: `.gitignore` contains an explicit un-ignore (`!/data/migrated/content.json`), and `git ls-files` confirms the file is tracked and committed. The real cause is unknown. This wave reproduces the failures locally with a clean build (`npm run prebuild && npm run build && npm run start`, then `npm run test:e2e:critical`), captures the actual HTTP status/stack per failing route, checks `isMigratedAvailable()` gating in `src/shared/lib/migrated/content.ts` and the `resolveCaseStudy` path in `src/shared/lib/migrated/resolve-case-study.ts` and `src/content/case-studies/registry.ts`, and produces a verified root cause (or a short list of verified candidate causes ranked by evidence) — not a restatement of the disproven explanation. Realizes `task_dla_playwright_local_failures_rootcause_20260706`.
**Worktree & branch.** worktree `.claude/worktrees/dla-playwright-rootcause` on branch `fix/dla-playwright-rootcause` (specification only — not created by this plan).
**Automation.** workflow pipeline (sequential: reproduce → isolate → verify → fix)
**Routing.** Role: Route Diagnostics Engineer · model **sonnet-5** (needs real debugging judgment, not mechanical) · reviewer: Independent Reviewer. Blast radius: `e2e/*`, `src/shared/lib/migrated/*`, `src/content/case-studies/*` reads plus a targeted fix; rls_risk: none (no DB).
**Gate.** `npm run test:e2e:critical` — all critical-route checks pass (0 failing) AND the root cause is stated with direct evidence (log line, stack trace, or diff) — no unverified causal claims permitted AND `npx tsc --noEmit` 0 errors.

**Prompt card**
```
Reproduce and root-cause the 8 failing local Playwright critical-route checks in dame-luthas-app
(routes: /case-studies and /portfolio/*, HTTP >= 400). Do NOT reuse or restate the prior "gitignored
content.json" explanation — verify it is false first (git check-ignore -v data/migrated/content.json;
git ls-files data/migrated/content.json) before looking elsewhere.

Steps:
1. npm run prebuild && npm run build && npm run start (in one terminal)
2. npm run discover:routes to regenerate reports/route-manifest.json
3. npm run test:e2e:critical -- --reporter=list, capture the exact status code / stack per failing route
4. Trace the failure path: src/app/case-studies/page.tsx -> isMigratedAvailable() in
   src/shared/lib/migrated/content.ts -> resolveCaseStudy() in
   src/shared/lib/migrated/resolve-case-study.ts -> src/content/case-studies/registry.ts
5. Fix the verified root cause. Re-run npm run test:e2e:critical until green.
6. npx tsc --noEmit must be 0.

Return: verified root cause (with evidence — log line, stack, or diff, not speculation), the fix,
and the full green test:e2e:critical output. dame-luthas-app only.
```

### Wave 2 — Per-case-study citation footer · blast **low** · no auth
**Detail.** Case studies currently render via `PortfolioDetail` (`src/widgets/portfolio/PortfolioDetail.tsx`) with content resolved through `resolveCaseStudy()` / `src/content/case-studies/registry.ts`, but nothing on the rendered page indicates which career-corpus evidence bundle (`ai-systems`, `ai-applied`, `portfolio-fullstack`, `portfolio-vertical` — see `../career-corpus/enriched/bundles/INDEX.md`) backs the case study's claims. This wave adds a small citation footer component to `PortfolioDetail` (and the underlying `ResolvedCaseStudy` type in `src/shared/types/case-study.ts`) that renders the source bundle id and a link/reference, sourced from a new field on the case-study registry entries — not fabricated per page, and not guessed if a case study has no clear bundle mapping (leave it explicitly unattributed rather than invent a source).
**Worktree & branch.** worktree `.claude/worktrees/dla-case-study-citations` on branch `feat/dla-case-study-citations` (specification only — not created by this plan).
**Automation.** goal (single bounded deliverable, not recurring)
**Routing.** Role: Case Study Author · model **sonnet-5** · reviewer: Independent Reviewer. Blast radius: `src/widgets/portfolio/PortfolioDetail.tsx`, `src/shared/types/case-study.ts`, `src/content/case-studies/registry.ts`; rls_risk: none.
**Gate.** All three existing portfolio detail routes (`united-nations-cloud-migration-fobos`, `amazon-labor-union-digital-transformation`, `gatorade-embraces-generative-ai-powered-bottle-design`) render a citation footer with a real bundle id (or an explicit "unattributed" state, never a fabricated one) AND `npm run test:e2e:critical` stays green AND `npx tsc --noEmit` 0.

**Prompt card**
```
Add a per-case-study citation footer to dame-luthas-app's portfolio detail pages. Source of truth
for bundle ids is ../career-corpus/enriched/bundles/INDEX.md (ai-systems, ai-applied,
portfolio-fullstack, portfolio-vertical).

Steps:
1. Add an optional `sourceBundleId` field to the case-study entries in
   src/content/case-studies/registry.ts (this is a single registry file, not a directory --
   map each of the 3 existing case studies to the bundle that actually backs it -- verify against
   the bundle's own content, do not guess; if no bundle maps cleanly, leave sourceBundleId
   undefined).
2. Thread sourceBundleId through ResolvedCaseStudy (src/shared/types/case-study.ts) and
   resolveCaseStudy() (src/shared/lib/migrated/resolve-case-study.ts).
3. Render a small citation footer in PortfolioDetail (src/widgets/portfolio/PortfolioDetail.tsx):
   "Source evidence: <bundle id>" when present, or nothing (not a fake placeholder) when absent.
4. npm run test:e2e:critical must stay green. npx tsc --noEmit must be 0.

Return: the 3 case study -> bundle mappings (with justification), the diff, and the gate results.
dame-luthas-app only (read ../career-corpus/enriched/bundles/ for reference, do not modify it).
```

> [!WARNING]
> **forecast-scrutiny / doc-forensic-inventory finding.** `npm run wp:build-content` (`wp:snapshot && wp:migrate`) and `npm run assets:pipeline` (`assets:convert` etc.) are verified to read from the **WordPress migration snapshot and local WP uploads path** (see `scripts/wp/build-snapshot.mts`, `scripts/media/convert-wp-assets.mts` — both source from the WP local/backup pipeline, not from `../career-corpus`). No script in this repo currently ingests `career-corpus` bundle output into portfolio content — treating `wp:build-content`/`assets:pipeline` as "the portfolio rebuild half" of a corpus sync would silently produce a loop that never touches corpus data, giving false confidence that corpus↔portfolio sync is closed. Fixed: this wave's first deliverable is a new, narrowly-scoped bridge script that syncs only the `sourceBundleId` citation field (added in Wave 2) from corpus bundle metadata — it explicitly does not touch `data/migrated/content.json` (which stays WP-sourced) and does not repurpose `wp:build-content`/`assets:pipeline`.

### Wave 3 — Citation↔corpus refresh loop · blast **medium** · no auth
**Detail.** Wave 2 added `sourceBundleId` to the case-study registry as a one-time, hand-verified mapping. This wave keeps that mapping current as `../career-corpus/enriched/bundles/` evolves, without a manual re-check every time. It adds a new script, `scripts/corpus/sync-bundle-citations.mts`, that reads `../career-corpus/enriched/bundles/INDEX.md` plus the relevant bundle JSON files and re-verifies/updates only the `sourceBundleId` fields in `src/content/case-studies/registry.ts` (never touching `data/migrated/content.json`, which remains sourced from the WP migration pipeline — see the finding above). This is a recurring **loop**, not a one-shot script: it re-runs on a schedule and must be idempotent — a run against an unchanged corpus produces zero file diff, which this wave verifies explicitly via `git status --porcelain` before/after a dry run. After each loop iteration, `npm run test:e2e:critical` runs as a smoke check (a bad citation sync must not silently break a route), and `scripts/checkpoint.mts` records the run. If the bridge script fails partway (e.g., corpus reachable but a bundle file malformed), it must exit non-zero and leave `registry.ts` unmodified (no partial writes) so a failed run can never leave the citation state inconsistent.
**Worktree & branch.** worktree `.claude/worktrees/dla-corpus-refresh-loop` on branch `feat/dla-corpus-refresh-loop` (specification only — not created by this plan).
**Automation.** loop (scheduled, recurring — use the `/schedule` skill or `scheduled-tasks` MCP for the cron registration)
**Routing.** Role: Content Pipeline Engineer · model **haiku-4-5** (mechanical, repeatable script chaining) · reviewer: Independent Reviewer. Blast radius: new `scripts/corpus/sync-bundle-citations.mts` + `src/content/case-studies/registry.ts` (`sourceBundleId` fields only); rls_risk: none (no DB tables owned by this repo touched).
**Gate.** The bridge script exists and, on a dry run against the current corpus state, produces zero diff to `registry.ts` (proving Wave 2's mappings are still accurate) AND a second dry run against a deliberately stale/edited local copy of a bundle file produces the expected `sourceBundleId` update AND a mid-run failure (simulated) leaves `registry.ts` unmodified AND the schedule is registered AND `npm run test:e2e:critical` stays green AND a checkpoint is written confirming the run.

**Prompt card**
```
Build and register the citation<->corpus sync loop for dame-luthas-app. This depends on Wave 2
(the sourceBundleId field on src/content/case-studies/registry.ts) already existing -- confirm it
does before starting.

1. Create scripts/corpus/sync-bundle-citations.mts:
   - Read ../career-corpus/enriched/bundles/INDEX.md + the relevant bundle JSON files (read-only,
     never modify career-corpus).
   - Re-verify/update ONLY the sourceBundleId fields in src/content/case-studies/registry.ts.
     Never touch data/migrated/content.json (that stays WP-sourced via wp:build-content, which
     this script must not call).
   - On any read/parse failure, exit non-zero and write nothing (no partial updates to registry.ts).
2. Dry-run it against the current corpus state -- confirm zero diff (git status --porcelain clean),
   proving Wave 2's mappings are still accurate.
3. Dry-run it again after editing a local scratch copy of one bundle file -- confirm the expected
   sourceBundleId change is produced, then discard the scratch edit.
4. npm run test:e2e:critical must stay green after any registry.ts change.
5. npx tsx scripts/checkpoint.mts to record the run.
6. Use the /schedule skill (or scheduled-tasks MCP) to register this as a weekly cron loop
   (Sun 06:00 America/New_York).

Return: the new script path, both dry-run outputs (clean-diff run + changed-bundle run), the
simulated-failure test (registry.ts left untouched), schedule/routine id, checkpoint confirmation.
dame-luthas-app only (read ../career-corpus/enriched/bundles/ for reference, do not modify it).
```

### Wave 4 — A11y pass + Lighthouse budget as a local gate · blast **low** · no auth
**Detail.** Accessibility checks today are limited to "a11y basics" inside `e2e/browser-devtools.spec.ts`. This wave runs a full accessibility pass across the critical routes (reusing `scripts/design/audit-contrast.mts` for contrast, extending `browser-devtools.spec.ts` for landmark/heading/alt-text checks) and adds a Lighthouse performance/a11y budget check, wired into `scripts/pre-commit-gate.mts` / `scripts/run-ci-parity.mts` as a **local** gate. GitHub Actions are retired for this workspace — this is explicitly a MALFIG-run local gate, not a new `.github/workflows/*` file; no workflow YAML is added or modified.
**Worktree & branch.** worktree `.claude/worktrees/dla-a11y-lighthouse-gate` on branch `feat/dla-a11y-lighthouse-gate` (specification only — not created by this plan).
**Automation.** goal (single bounded deliverable), gate itself runs as part of the existing pre-commit/local-CI loop going forward
**Routing.** Role: Accessibility & Performance Auditor · model **sonnet-5** · reviewer: Independent Reviewer. Blast radius: `scripts/design/audit-contrast.mts`, `e2e/browser-devtools.spec.ts`, `scripts/pre-commit-gate.mts`, `scripts/run-ci-parity.mts`; rls_risk: none.
**Gate.** Contrast audit clean on all critical routes AND extended a11y checks (landmarks, heading order, image alt text) pass on `/`, `/case-studies`, `/contact`, and all 3 `/portfolio/*` routes AND a defined Lighthouse budget (perf/a11y scores, thresholds recorded in the script) passes AND the check is invoked from `scripts/pre-commit-gate.mts` / `npm run ci:parity` — no `.github/workflows/*` file added or modified.

**Prompt card**
```
Add a local a11y + Lighthouse-budget gate to dame-luthas-app. GitHub Actions are RETIRED for this
workspace -- do NOT add or edit any file under .github/workflows/. This gate runs locally via
scripts/pre-commit-gate.mts and npm run ci:parity only.

Steps:
1. npx tsx scripts/design/audit-contrast.mts across all critical routes (/, /case-studies,
   /contact, and the 3 /portfolio/* routes) -- fix any contrast failures found.
2. Extend e2e/browser-devtools.spec.ts (npm run test:devtools) with landmark / heading-order /
   image-alt-text checks on the same route set.
3. Add a Lighthouse run (perf + a11y categories) against the same routes with an explicit budget
   (record thresholds in the script, e.g. perf >= 85, a11y >= 95) -- fail the gate if under budget.
4. Wire steps 1-3 into scripts/pre-commit-gate.mts and scripts/run-ci-parity.mts so `npm run
   ci:parity` exercises the full local gate.

Return: contrast audit results, extended a11y test output, Lighthouse scores vs budget, and
confirmation no .github/workflows/* file was touched. dame-luthas-app only.
```

---

## PR references
- **This plan** — filed on branch `docs/portfolio-delivery-plan-20260706`. PR: _to be filled on open_.
- Prior repo work referenced for context (not owned by this plan): dame-luthas-app #8 (`302993d`, Luthas Enterprise design system V3).

## Lessons learned
- **Verify causal explanations before writing them.** A prior "8 failures are caused by gitignored `content.json`" explanation was false: `.gitignore` explicitly un-ignores `!/data/migrated/content.json`, and the file is tracked (`git ls-files` confirms it). Wave 1 is scoped as an open root-cause investigation, not a pre-written fix, specifically to avoid repeating this mistake.
- **Loops need explicit idempotency checks.** Wave 3's citation↔corpus refresh is a recurring schedule, not a one-shot script; its gate requires a clean no-op run (no upstream changes → no diff) before registration, so a broken loop doesn't silently corrupt registry state on every cron tick.
- **Provenance must degrade honestly.** Wave 2's citation footer must render nothing rather than a fabricated bundle id when a case study has no clean bundle mapping — matching the workspace-wide "never fabricate" posture applied to this portfolio's own case-study content.
- **Don't let an existing script's name imply integration it doesn't have.** `wp:build-content` and `assets:pipeline` sound like they could be "the portfolio half" of any content refresh, but both are verified to be WP-migration-only. Wave 3 is scoped as a new, narrow bridge script rather than repurposing them — an audit-fix-plan finding on the first draft of this doc, corrected before merge.
- **Sequencing must form a strict DAG.** The first draft numbered the corpus-refresh loop before the citation footer it depends on. Corrected by reordering (citation footer = Wave 2, corpus sync loop = Wave 3) rather than leaving a forward reference.

## Live task list (snapshot)
_Snapshot 2026-07-06 — mirrors the task tracker; the tracker is authoritative if this drifts._

| ID | Status | Pri | Wave |
|---|---|---|---|
| `task_dla_playwright_local_failures_rootcause_20260706` | pending | P1 | 1 |
| `task_dla_case_study_citation_footer_20260706` | pending | P2 | 2 |
| `task_dla_portfolio_corpus_refresh_loop_20260706` | pending | P2 | 3 |
| `task_dla_a11y_lighthouse_local_gate_20260706` | pending | P2 | 4 |
| `task_dla_project_overview_doc_drift_20260706` | pending | P3 | (follow-up, doc-forensic-inventory finding) |

## Governance violations
None recorded for this plan. Guardrails asserted and unchanged: no fabricated root causes (Wave 1 requires evidence), no fabricated citations (Wave 2 degrades to unattributed rather than invented), no fabricated integration points (Wave 3's bridge script is new and narrowly scoped rather than silently repurposing WP-only scripts), no new GitHub Actions workflows (Wave 4 gate is local-only), separation of duties (authoring role does not self-approve — Independent Reviewer signs off each wave before merge).

### audit-fix-plan pass (this document)
Four findings from the 50x audit (forensic-auditing, forecast-scrutiny, doc-forensic-inventory) were identified and fixed before merge, inline `[!WARNING]`/`[!IMPORTANT]` callouts mark where:
1. Wave 3 (then-Wave 2) implied `wp:build-content`/`assets:pipeline` bridge career-corpus into the portfolio; verified false — both are WP-migration-only. Fixed by scoping a new, narrow bridge script instead.
2. Waves 2/3 formed a broken DAG (corpus sync depended on a field the citation-footer wave hadn't introduced yet). Fixed by reordering.
3. The Wave 3 (then-Wave 2) idempotency claim had no verification step. Fixed by adding an explicit `git status --porcelain` clean-diff check to the gate.
4. `src/content/case-studies/registry` was referenced as a directory; verified it is a single file, `registry.ts`. Fixed throughout Wave 2/3 references. A fifth, doc-forensic-inventory finding — `docs/PROJECT-OVERVIEW.md` documents the current route/content architecture and will drift once Waves 2–4 land — is tracked as a follow-up task in the Live task list below rather than expanded inline here, since it is a downstream update, not a defect in this plan's own content.

## Change Log
| Version | Date | Author | Change |
|---|---|---|---|
| 1.1 | 2026-07-06 | Claude (opus 4.8) | audit-fix-plan pass: reordered Wave 2/3 to fix a broken DAG dependency, scoped a new narrow bridge script instead of implying `wp:build-content`/`assets:pipeline` integrate with career-corpus (verified false), added explicit idempotency verification to the refresh-loop gate, corrected `registry.ts` file references (was described as a directory), added a follow-up task for `PROJECT-OVERVIEW.md` drift. |
| 1.0 | 2026-07-06 | Claude (opus 4.8) | Initial strategic plan: 8 Value & Intent sub-blocks, 4 sequenced waves (Playwright root-cause, corpus refresh loop, citation footer, a11y/Lighthouse local gate) with Detail + Prompt card + Worktree/branch + Automation + Routing + Gate per wave. |
