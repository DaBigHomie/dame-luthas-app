# Dame Luthas Webapp — Build Sequence

**Last updated:** 2026-06-11  
Cross-ref: [SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md](./SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md) (WP mechanics)

Check items off top to bottom. Stop if a gate fails.

---

## Phase 0 — Baseline (done 2026-06-11)

- [x] Clean build: `npx tsc --noEmit && npm run lint && npm run build`
- [x] Public routes 200: `/`, `/contact`, `/case-studies`, `/portfolio/[slug]`
- [x] `content.json` committed; `prebuild` gate
- [x] Vercel production deploy

## Phase 1 — Design (Stitch)

- [ ] Homepage bento redesign
- [ ] Resumes index + detail
- [ ] Blog index + detail
- [ ] Social feed
- [ ] Admin dashboard / blog editor

**Gate:** Five exports share tokens (`#0F0F0F`, Outfit/Cardo, `#F7DF3D` / `#8F93F1`, 1170px container).

## Phase 2 — Component decomposition (in progress)

- [x] Native widgets for home, contact, case studies, portfolio detail
- [x] Structured case-study registry (`src/content/case-studies/registry.ts`)
- [ ] Atomic layout tree (`components/ui`, `sections`, `layout`)
- [ ] Remove `MigratedContent` from portfolio detail + `[slug]` catch-all
- [ ] Allowlist `[slug]` to contact only

**Gate:** Visual parity vs Phase 0 snapshots; pages read as table of contents.

## Phase 3 — Integrate Stitch designs

- [ ] New routes: `/resumes`, `/blog`, `/dashboard`, social section
- [ ] Mock data shells only

## Phase 4 — Data (Supabase) + email (Resend)

- [x] Resend server action scaffold (`src/app/actions/contact.ts`)
- [ ] `RESEND_API_KEY` + verified domain on Vercel
- [x] Supabase migrations — `supabase/migrations/*` (portfolio, case studies, services, posts, RLS)
- [ ] Link remote project + apply migrations via Supabase MCP (see below; never `db reset` or `db push`)
- [ ] Dashboard post editor

### Supabase migrations (CORTEX / WARDEN)

**P0:** Never `supabase db reset`, `db push`, or destructive DB commands (`knowledge: ref:rules:never_run_db_reset`).

Apply each file in `supabase/migrations/` in order via **Supabase MCP** `apply_migration`:

- `project_id`: `mygbzfvoctlvnxvzivso` (from env / Vercel integration)
- `name`: snake_case migration name (e.g. `auth_profiles`)
- `query`: full SQL from the migration file

After all migrations: `npx supabase gen types typescript --project-id mygbzfvoctlvnxvzivso > src/shared/types/database.types.ts` (when wiring the client).

Seed (optional, after schema):

```bash
npm run wp:extract && npm run wp:map   # → data/extracted/supabase-seed.json
npm run db:seed                        # upsert via REST; needs .env.local keys
```

Loads `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` from `.env.local` (merge from `.env` after Vercel pull).

## Phase 5 — Social embeds

- [ ] LinkedIn / X / Instagram iframe organism (no API tokens)

## Phase 6 — Harden

- [ ] Auth middleware + `requireAdmin()` on dashboard
- [ ] Supabase RLS
- [ ] CSP allowlist for embed origins
- [ ] Turnstile on forms

## Phase 7 — Cloudflare (manual)

- [ ] SSL, WAF, Access on `/dashboard*`
- [ ] Cache static; bypass dashboard/auth

## Phase 8 — Launch check

- [ ] Lighthouse / visual diff
- [ ] All routes 200
- [ ] Custom domain live

---

## Session commands

```bash
npm run ci:parity
npm run deploy:prod
npx tsx scripts/checkpoint.mts "short-title"
```

## Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-06-25 | — | Initial version |
