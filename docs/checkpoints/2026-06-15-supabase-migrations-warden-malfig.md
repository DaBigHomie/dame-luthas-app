# Checkpoint: Supabase migrations + WARDEN/MALFIG gate

**Date:** 2026-06-15  
**Repo:** dame-luthas-app  
**SHA:** ea97d11 (pushed to origin/main)

## WARDEN

```bash
cd documentation-standards && npx tsx scripts/warden.mts --repo dame-luthas-app --json
```

- **Verdict:** REWORK (1 blocker — pre-existing `docs/architecture/HOMEPAGE-GRAPHQL-CODEGEN-TSA.md` banned name)
- **Quality gate:** PASS (tsc via warden)
- **Deferred:** `.system/warden/2026-06-15T17-36-38-380Z.json`

## Supabase auditor (static)

- 6 migrations, chronological, no `.skip`
- 12/12 tables RLS + policies
- Project `mygbzfvoctlvnxvzivso`

## Migrations applied

Applied to `mygbzfvoctlvnxvzivso` via Supabase Management API (`/v1/projects/{ref}/database/query`), PAT from `.env.mcp` `SUPABASE_ACCESS_TOKEN_LUTHAS_CENTER` — **not** `db push` / **not** `db reset` (CORTEX P0).

| Migration | Status |
|-----------|--------|
| auth_profiles | OK |
| media_and_settings | OK |
| portfolio_case_studies_services | OK |
| pages_posts_testimonials | OK |
| forms_menus_subscribers | OK |
| storage_buckets | OK |

## MALFIG (G5 on ea97d11..e031e68)

| Gate | Status |
|------|--------|
| G5 tsc + lint + build | PASS |
| G9 P0 | None in this diff |

**Verdict:** PASS for schema/env commits. WARDEN doc-place blocker is out of scope for this PR slice.

## Vercel env pull

`.vercel/project.json` links `dame-luthas-app` but `vercel env pull` still downloads `damieus-workflow-agents` env — **CLI/dashboard mismatch**. Workaround: merge repo-pinned block from `.env` after every pull (see `.env.example`).

## Seed

Blocked until extract bundle exists:

```bash
npm run wp:extract && npm run wp:map && npm run db:seed
```

## Change Log

| Date | Change |
|------|--------|
| 2026-06-15 | Initial checkpoint |
