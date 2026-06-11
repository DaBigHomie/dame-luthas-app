# Checkpoint: case-studies-deploy-exit

**Date:** 2026-06-11  
**Branch:** main  
**Session:** `sess_dame_luthas__20260611_dfd07f`  
**Production:** https://dame-luthas-app.vercel.app

## For Jay

Dame Luthas's portfolio site now runs on a modern stack and is live on Vercel. Visitors see a professional headshot on the homepage (not placeholder product images), a clean Case Studies page with three client stories (Amazon, Gatorade, UN), and working navigation to Contact. The old WordPress quirks—like a full Gatorade article accidentally showing on the case studies list—are fixed. The contact form is wired for email delivery once Resend credentials are added in Vercel.

## Diagram

```mermaid
flowchart LR
  WP[WordPress extract] --> JSON[content.json in git]
  JSON --> Next[Next.js site]
  Next --> Vercel[dame-luthas-app.vercel.app]
  Visitor[Visitor] --> Vercel
  Vercel --> CS[/case-studies]
  Vercel --> Detail[/portfolio/slug]
  Vercel --> Contact[/contact]
```

Diagram link: https://mermaid.live/edit#pako:eNqNkU1uwjAMha9C5QqJk7ZdV1W9QDe7dF0HqKq6iZNYxE5sR7Y79nISpE0L3SS-_D75yU5y0YpWqJQ2WmN0Bq0xOqPTe6c1Rmd0PqPTe6c1Rmd0PqM

## Related links

- Production: https://dame-luthas-app.vercel.app
- Case studies: https://dame-luthas-app.vercel.app/case-studies
- Repo: https://github.com/dame-luthas/dame-luthas-app

## Recent commits

```
cb59ee2 feat(site): remove /about, commit content bundle, and P2 polish
59f99bd feat(case-studies): native index, redirects, and structured detail sections
52e805b feat(home): use profile headshot on hero instead of demo hoodie
```

## Shipped

- Native `/case-studies` index (no stray WP HTML)
- `/portfolio/[slug]` for 3 case studies + structured registry
- Redirects: `/portfolio` → `/case-studies`, `/pf/*` → `/portfolio/*`
- Hero profile headshot; service block real assets
- Vercel deploy pinned via `.codebase-manifest.json`
- `content.json` committed; `prebuild` gate
- `/about` removed (404); nav: Home, Case Studies, Contact
- Portfolio CSS batch 6; Resend contact scaffold

## Gates

- TypeScript / lint / build: PASS (pre-push)
- Production smoke: `/case-studies`, `/portfolio/amazon-*` verified

## Next

1. **Manual:** `RESEND_API_KEY` + `RESEND_FROM` on Vercel
2. **Manual:** Shell `VERCEL_PROJECT_ID=prj_SF0avm0b1fTz5sWtyRdsaoG1hLtv`
3. **Manual:** Custom domain `dame-luthas.damieus.app`
4. Migrate Gatorade/UN prose into structured registry
5. Phase 1 Stitch designs — see `docs/WEBAPP-BUILD.md`
