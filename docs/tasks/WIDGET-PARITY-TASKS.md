# Homepage widget parity — implementation backlog

Generated from `scripts/wp/lib/widget-registry.ts` partial notes + visual audit vs `dameluthas.local`.

**Methodology:** `docs/MIGRATION-PLAYBOOK.md` — registry maps widget types; this file tracks **implementation depth** (registry ≠ done).

| ID | Priority | Widget / area | Gap | Acceptance |
|----|----------|---------------|-----|------------|
| `task_luthas_wp_020` | ~~P1~~ done | `thegem-styledimage` ×14 | ~~Service sections use one banner + 3-col grid~~ | `StyledImage.tsx` + stagger rows in `ServiceBlockSection` (7 service images + testimonial quote images separate) |
| `task_luthas_wp_021` | ~~P1 done~~ | `thegem-custom-menu` ×11 | ~~HTML parse only~~ | `parse-custom-menus.ts` widget walk + `wp:verify-custom-menus` (fixture 8, live 11) |
| `task_luthas_wp_022` | ~~P1 done~~ | `thegem-testimonials` ×1 | ~~Quotes truncated~~ | `dameluthasTestimonialQuotes` GraphQL + live extract |
| `task_luthas_wp_023` | ~~P2 done~~ | `social-icons` ×3 | ~~LinkedIn only~~ | `SocialIcons` + `social-links.ts` in header/footer |
| `task_luthas_wp_024` | ~~P2 done~~ | Service sections | ~~Missing watermark~~ | Watermark + `ScrollParallax` on styled images |
| `task_luthas_wp_025` | ~~P2 done~~ | `thegem-portfolio` ×2 | ~~Grid differs~~ | Homepage `columns="2"` + `#work` anchor |
| `task_luthas_wp_026` | ~~P2 done~~ | `thegem-template-menu` ×2 | ~~Nav mismatch~~ | `site-nav.ts` WP-aligned header nav |
| `task_luthas_wp_027` | partial | Extract pipeline | HTML anchors | `parse-widget-walk.ts` + custom menu walk (service-blocks emit pending) |
| `task_luthas_wp_028` | ~~P2 done~~ | Phase 6 verify | manual | `.github/workflows/ci.yml` + pre-commit custom-menu gate |
| `task_luthas_wp_029` | P3 | `thegem-styledbutton` ×10 | CTA styling approximations | Outline/flat skins match TheGem `gem-button` variants |
| `task_luthas_wp_030` | P3 | P8 hovers | Deferred TheGem hover remix | Complete `p8-hovers-scope.ts` items |
| `task_luthas_wp_031` | P3 | Sites 2 & 3 | Not audited | Run `wp:audit-source` per site; extend registry |
| `task_luthas_wp_032` | **P1** | De-WP runtime | `wp` prefix in app routes/paths/APIs | Zero `wp` in shipped `src/` URLs — see [MIGRATION-BACKLOG.md](./MIGRATION-BACKLOG.md) |
| `task_luthas_wp_033` | **P1** | Media FSD | Assets in `public/wp-migrated/`, mixed `/wp-content/` paths | Migrate to `public/assets/` FSD layout; codegen emits `/assets/…` only |
| `task_luthas_wp_034` | **P1** | Public route audit | Audit homepage-only | `verify:public-routes` — WP vs Next for all public endpoints |
| `task_luthas_wp_035` | **P1** | `/contact` | Not native-migrated | Extract + native `ContactPage` (WP: `dameluthas.local/contact/`) |
| `task_luthas_wp_036` | **P1** | `/case-studies` | Route missing | Full page migration (WP: `dameluthas.local/case-studies/`) |
| `task_luthas_wp_037` | **P1** | Portfolio detail | UN Fobos case study | `/portfolio/united-nations-cloud-migration-fobos` |
| `task_luthas_wp_038` | **P1** | Portfolio detail | Amazon Labor Union | `/portfolio/amazon-labor-union-digital-transformation` |
| `task_luthas_wp_039` | **P1** | Portfolio detail | Gatorade Gen-AI | `/portfolio/gatorade-embraces-generative-ai-powered-bottle-design` |

Full route matrix: [MIGRATION-BACKLOG.md](./MIGRATION-BACKLOG.md)

## Commands

```bash
npm run wp:audit-source
npm run wp:verify-widget-census
npm run wp:visual-parity-audit
```

## Registry cross-reference

See `scripts/wp/lib/widget-registry.ts` — entries with `note` field are partial until closed in this table.
