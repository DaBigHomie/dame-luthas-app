# Homepage widget parity — implementation backlog

Generated from `scripts/wp/lib/widget-registry.ts` partial notes + visual audit vs `dameluthas.local`.

**Methodology:** `docs/MIGRATION-PLAYBOOK.md` — registry maps widget types; this file tracks **implementation depth** (registry ≠ done).

| ID | Priority | Widget / area | Gap | Acceptance |
|----|----------|---------------|-----|------------|
| `task_luthas_wp_020` | P1 | `thegem-styledimage` ×14 | Service sections use one banner + 3-col grid; WP uses **staggered alternating image+category cards** | `StyledImage.tsx` + `ServiceBlockSection` matches WP layout; 14 image widgets accounted for in census |
| `task_luthas_wp_021` | P1 | `thegem-custom-menu` ×11 | Menus parsed from HTML, not widget settings; badge pills approximate | Extract from `_elementor_data` or improved HTML parser; rotating subtitles per category |
| `task_luthas_wp_022` | P1 | `thegem-testimonials` ×1 | Quotes truncated in rendered HTML | Register `_elementor_data` in WP GraphQL; emit full bodies in `src/content/testimonials.ts` |
| `task_luthas_wp_023` | P2 | `social-icons` ×3 | Header/footer only LinkedIn | All WP social networks + icon parity |
| `task_luthas_wp_024` | P2 | Service sections | Missing **SERVICES** watermark + scroll parallax | Background typography matches WP `#232323` watermark |
| `task_luthas_wp_025` | P2 | `thegem-portfolio` ×2 | Grid layout / filters differ from WP **Work** section | Portfolio filters + 2×2 grid parity |
| `task_luthas_wp_026` | P2 | `thegem-template-menu` ×2 | Nav items don't match WP header | Full menu from template extract |
| `task_luthas_wp_027` | P2 | Extract pipeline | HTML text anchors vs **widget-type walk** | `extract-wp-content` walks `data-widget_type` in DOM order; emits per-widget JSON |
| `task_luthas_wp_028` | P2 | Phase 6 verify | Visual audit manual | `wp:visual-parity-audit` in pre-commit or CI when both URLs available |
| `task_luthas_wp_029` | P3 | `thegem-styledbutton` ×10 | CTA styling approximations | Outline/flat skins match TheGem `gem-button` variants |
| `task_luthas_wp_030` | P3 | P8 hovers | Deferred TheGem hover remix | Complete `p8-hovers-scope.ts` items |
| `task_luthas_wp_031` | P3 | Sites 2 & 3 | Not audited | Run `wp:audit-source` per site; extend registry |

## Commands

```bash
npm run wp:audit-source
npm run wp:verify-widget-census
npm run wp:visual-parity-audit
```

## Registry cross-reference

See `scripts/wp/lib/widget-registry.ts` — entries with `note` field are partial until closed in this table.
