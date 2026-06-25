# Checkpoint: migration-playbook-widget-census

**Date:** 2026-06-11 1305  
**Branch:** main

## Recent commits

```
8915705 feat(homepage): GraphQL codegen pipeline and 8 section widgets (#2)
31103ea Merge pull request #1 from DaBigHomie/feat/thegem-animations-graphql-tsa
3d68ae1 feat(migration): TheGem motion system, CSS remix, and GraphQL codegen TSA
965757a feat(migration): native WP content shell, The Gem CSS remix FSD, and review agents
6a0b805 fix(docs): update script paths — moved to damieus-workflow-agents/scripts/
```

## Diff stat

```
.github/agents/README.md                           |   19 +
 .gitignore                                         |    4 +
 data/fixtures/page-375.html                        | 1004 ++++++++++++++++++++
 e2e/parity.spec.ts                                 |   34 +
 next.config.ts                                     |    7 +
 package-lock.json                                  |  342 ++++++-
 package.json                                       |   12 +
 playwright.config.ts                               |   18 +
 public/wp-migrated/2025/02/home-03.webp            |  Bin 0 -> 61408 bytes
 public/wp-migrated/2025/02/home-04.webp            |  Bin 0 -> 57798 bytes
 public/wp-migrated/2025/02/home-05.webp            |  Bin 0 -> 70846 bytes
 public/wp-migrated/2025/02/quote-dark.png          |  Bin 0 -> 4183 bytes
 public/wp-migrated/2025/05/glg-logo-white-1.png    |  Bin 0 -> 15319 bytes
 public/wp-migrated/2025/05/msg-logo-1.png          |  Bin 0 -> 146906 bytes
 public/wp-migrated/2025/05/un-logo-1a.png          |  Bin 0 -> 139773 bytes
 public/wp-migrated/2025/05/unicef-logo-white-1.png |  Bin 0 -> 55307 bytes
 public/wp-migrated/2025/05/unwomen-logo.png        |  Bin 0 -> 14505 bytes
 public/wp-migrated/2025/05/who-logo-500px.png      |  Bin 0 -> 41930 bytes
 scripts/deploy-vercel.mts                          |   61 ++
 scripts/wp/audit-page-html.mts                     |   48 +
 scripts/wp/copy-wp-assets.mts                      |  146 +++
 scripts/wp/extract-design-system.mts               |   70 ++
 scripts/wp/extract-wp-content.mts                  |  127 +++
 scripts/wp/lib/emit-content.ts                     |   95 ++
 scripts/wp/lib/parsers/normalize-url.ts            |   18 +
 scripts/wp/lib/parsers/parse-clients.ts            |   29 +
 scripts/wp/lib/parsers/parse-homepage.ts           |   44 +
 scripts/wp/lib/parsers/parse-rotating-text.ts      |   22 +
 scripts/wp/lib/parsers/parse-sections.ts           |   73 ++
 scripts/wp/lib/parsers/parse-service-cards.ts      |   80 ++
 scripts/wp/lib/parsers/parse-testimonials.ts       |   35 +
 scripts/wp/lib/parsers/types.ts                    |   19 +
 scripts/wp/migrate-content.mts                     |   38 +-
 src/app/fonts.ts                                   |   15 +
 src/app/globals.css                                |   96 +-
 src/app/layout.tsx                                 |   28 +-
 src/app/page.tsx                                   |   28 +-
 src/content/availability.ts                        |   10 +
 src/content/clients.ts                             |   29 +
 src/content/hero-fallback.ts                       |    8 +
 src/content/index.ts                               |   10 +
 src/content/meta.ts                                |    7 +
 src/content/rotating.ts                            |   14 +
 src/content/sections.ts                            |   30 +
 src/content/service-blocks.ts                      |  131 +++
 src/content/services.ts                            |  108 +++
 src/content/testimonials.ts                        |   30 +
 src/content/text-bands.ts                          |   18 +
 src/content/types.ts                               |   71 ++
 .../design/thegem/remix/heading-animations.css     |    4 +
 src/shared/lib/design-tokens.ts                    |   75 ++
 src/shared/ui/AnimatedHeading.tsx                  |   32 +-
 src/widgets/ContactFormBlock.tsx                   |   13 +-
 src/widgets/Footer.tsx                             |   22 +-
 src/widgets/Header.tsx                             |   48 +-
 src/widgets/Hero.tsx                               |  101 +-
 src/widgets/home/AdvisorSection.tsx                |   17 +
 src/widgets/home/BigHeadingSection.tsx             |   18 +
 src/widgets/home/ClientsMarquee.tsx                |   40 +
 src/widgets/home/ManifestoBand.tsx                 |   26 +
 src/widgets/home/ServiceBlockSection.tsx           |   48 +
 src/widgets/home/ServiceCard.tsx                   |   58 ++
 src/widgets/home/TestimonialsCarousel.tsx          |   61 ++
 src/widgets/home/index.ts                          |    9 +
 vercel.json                                        |    4 +
 65 files changed, 3421 insertions(+), 133 deletions(-)
```

## Gates

- TypeScript: PASS


## Active backlog

See `docs/tasks/WIDGET-PARITY-TASKS.md` and `docs/MIGRATION-PLAYBOOK.md`.

## Next

1. `task_luthas_wp_020` — StyledImage stagger service layout
2. `task_luthas_wp_022` — Full testimonials via _elementor_data
3. `npm run wp:visual-parity-audit` after layout fixes

## Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-06-25 | — | Initial version |
