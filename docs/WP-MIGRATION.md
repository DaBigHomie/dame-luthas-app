# WordPress Migration — Dame Luthas

**Last updated:** 2026-06-11

## Source: dameluthas.com

### Content mapping (native shell)

| WordPress | Next route | Content source |
|-----------|------------|----------------|
| Home (page 375) | `/` | `src/content/*` + widgets |
| Case studies index | `/case-studies` | `CaseStudiesPage` + `PortfolioGrid` |
| Portfolio singles (`/pf/*`) | `/portfolio/[slug]` | `data/migrated/content.json` → `resolveCaseStudy()` |
| Contact | `/contact` | `ContactPage` + `aboutPage` in JSON |
| About | — | **Removed** — not on live site |

Legacy WP pages (calculators, demos) remain in `content.json` `pages[]` but are not linked from nav.

### Extraction pipeline (current)

```bash
# Local WP (dameluthas.local)
npm run wp:sync-local
npm run wp:install-graphql
npm run wp:extract-live          # optional GraphQL refresh
npm run wp:build-content         # snapshot + migrate → content.json

# Assets
npm run assets:pipeline

# Verify
npm run wp:verify-widget-census
npm run verify:public-routes
npm run ci:parity
```

**Git / Vercel builds:** `data/migrated/content.json` is committed. `npm run prebuild` runs `scripts/wp/ensure-migrated-content.mts` — fails fast if JSON missing.

### Media assets

- Converted WebP/SVG under `public/assets/{clients,services,portfolio,site,pages}/`
- No `/api/wp-media/` in shipped `src/` — rewrite at render for legacy HTML in JSON only
- Binding gate: `npm run assets:verify-bindings`

### Deploy

- Vercel project pinned in `.codebase-manifest.json` → `vercel` block
- `scripts/deploy-vercel.mts` overrides stray shell `VERCEL_PROJECT_ID`
- Production: https://dame-luthas-app.vercel.app

### Supabase (future)

Schema tables listed in `.codebase-manifest.json` — not wired in native shell yet. See [WEBAPP-BUILD.md](./WEBAPP-BUILD.md) Phase 4.
