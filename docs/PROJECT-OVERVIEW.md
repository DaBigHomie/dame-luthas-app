# Dame Luthas — Project Overview

**Last updated:** 2026-06-11

## Summary

Personal portfolio and consulting site — case studies, services, contact. Migrated from WordPress (TheGem + Elementor) to a native Next.js shell with committed content bundle.

## Migration source

| Item | Value |
|------|--------|
| WordPress | dameluthas.com (Local: `dameluthas.local`) |
| Backup | UpdraftPlus (Google Drive) |
| Production | https://dame-luthas-app.vercel.app |
| Vercel project | `prj_SF0avm0b1fTz5sWtyRdsaoG1hLtv` (`dame-luthas/dame-luthas-app`) |
| Dev domain | dameluthas.damieus.app |

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, native TheGem remix CSS |
| Content | `data/migrated/content.json` (committed; `prebuild` ensures presence) |
| Architecture | Feature-Sliced Design (widgets → shared → content) |
| Deploy | Vercel prebuilt CLI (`npm run deploy:prod`) + Git integration |
| Contact | Resend server action (requires `RESEND_API_KEY` on Vercel) |

## Public routes (native shell)

| Route | Status | Notes |
|-------|--------|-------|
| `/` | Live | Native Hero, services, portfolio grid, testimonials |
| `/case-studies` | Live | Canonical portfolio index; no stray WP HTML |
| `/portfolio` | Redirect | 308 → `/case-studies` |
| `/portfolio/[slug]` | Live | 3 case studies; structured sections + HTML fallback |
| `/pf/[slug]` | Redirect | 308 → `/portfolio/[slug]` |
| `/contact` | Live | Native `ContactPage` + Resend form |
| `/about` | Removed | Not on live WP nav; returns 404 |
| `/[slug]` | Legacy | WP demo pages only; blocked slugs 404 |

## Status (2026-06-11)

- [x] WordPress content extracted → `content.json`
- [x] Native homepage + case studies + portfolio detail
- [x] Public route verification + Playwright `@critical`
- [x] Vercel production deploy
- [x] Hero profile headshot (not demo hoodie)
- [x] Portfolio CSS batch 6 (card hover, lightbox)
- [x] Custom domain `dameluthas.damieus.app` attached
- [x] Resend env on Vercel
- [ ] Full HTML removal on case-study detail (structured schema only)
- [x] Supabase schema migrations (`supabase/migrations/`) — pending remote link + seed

## Key commands

```bash
npm run dev
npm run ci:parity              # tsc, lint, build, routes, e2e @critical
npm run wp:migrate             # refresh content.json from snapshot/graphql
npm run deploy:prod            # pinned Vercel project via .codebase-manifest.json
npm run verify:public-routes   # WP vs Next matrix
```

See [SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md](./SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md) and [WEBAPP-BUILD.md](./WEBAPP-BUILD.md).

## Career Intelligence stack (related repos)

This site is the **public portfolio surface** for Dame Luthas. The job-search and evidence pipeline lives in sibling repos:

| Repo | Role | Doc |
|------|------|-----|
| career-corpus | Cited evidence SSOT → resume bundles | [CORPUS-SOLUTION.md](../../career-corpus/docs/CORPUS-SOLUTION.md) |
| project-polaris | Scout, 40x tailor, assisted apply | [POLARIS-SOLUTION.md](../../project-polaris/docs/POLARIS-SOLUTION.md) |
| **Platform map** | Federated topology + Vercel registry | [CAREER-INTELLIGENCE-PLATFORM-SOLUTION.md](../../project-polaris/docs/CAREER-INTELLIGENCE-PLATFORM-SOLUTION.md) |

**Identity:** Dame Luthas on this site; **Damieus** is the agency brand (damieus.com). Resume tailoring uses the same rule in Polaris `contact-profile.json`.

## Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-06-25 | — | Initial version |
