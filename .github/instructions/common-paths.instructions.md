---
applyTo: "**"
---

# Common Paths — Where to Put Things

> Managed by DaBigHomie/documentation-standards — do not edit in target repos.
> Synced via `scripts/push-rules.mts`.

This index tells agents WHERE to create/read different kinds of files. It is derived from observed conventions across `043`, `damieus`, `ffs`, `maximus`, and `audit-fix-ship`.

---

## 1. Top-Level Directory Map (Universal)

| Path | Contents | Required? |
|------|----------|-----------|
| `docs/` | All long-form documentation, plans, audits, handoffs | ✅ Always |
| `scripts/` | Automation scripts (`.mts` preferred, `.cjs`/`.sh` legacy) | ✅ Always |
| `src/` | Application source code | ✅ Always |
| `public/` | Static assets served as-is (images, fonts, robots.txt) | ✅ Always |
| `supabase/` | DB migrations + edge functions (if Supabase is used) | If applicable |
| `e2e/` or `tests/` | End-to-end Playwright specs | ✅ If tests exist |
| `email-templates/` | Transactional email markup | If applicable |
| `reports/` | Generated audit/scan output | Auto-created |
| `playwright-report/` | Playwright HTML report | Auto-created (gitignored) |
| `.github/` | Workflows, instructions, agents, prompts, issue templates | ✅ Always |

> Do NOT create files outside the workspace directory (no `/tmp/`, `~/Desktop/`). Always extend the structure above.

---

## 2. `docs/` — Documentation

| Subpath | Purpose |
|---------|---------|
| `docs/` (root) | Top-level plans, audits, handoffs (one file per topic) |
| `docs/active/` | Current sprint context (preferred over loose root files for new work) |
| `docs/archive/` | Stale/superseded docs (don't delete — move here) |
| `docs/handoff/` | Numbered implementation guides (`00-MASTER-INDEX.md`, `01-…`, `02-…`) |
| `docs/prompts/` | `.prompt.md` files for cloud agents (preferred location for new prompts) |
| `docs/agent-prompts/` | Legacy alias of `docs/prompts/` (some repos use this) |
| `docs/context-manifests/` | Timestamped session handoff manifests (`YYYY-MM-DD/`) |
| `docs/agent-guide/` | Agent-facing runbooks (numbered: `00-QUICK-START.md`, `01-…`) |

**Rule**: For NEW work, prefer `docs/active/` + `docs/prompts/`. Use root `docs/*.md` only for one-off audits or executive summaries.

---

## 3. `scripts/` — Automation

| File pattern | Purpose |
|--------------|---------|
| `*.mts` | **Preferred** — TypeScript ESM, run via `npx tsx` |
| `*.cjs` | Legacy CommonJS (e.g., `apply-migration-via-rest.cjs`) |
| `*.sh` | Shell — only for OS-level ops, never for app logic |
| `audit-*.mts` | Read-only scanners (output to `reports/`) |
| `fix-*.mts` | Mutating fixers (always have a `--dry-run` flag) |
| `apply-migration-*.{mts,cjs}` | Supabase migration appliers |

**Rule**: NEW automation MUST be `.mts`. See `core-directives.instructions.md`.

---

## 4. `src/` — Source Code (FSD When Possible)

### Next.js / App Router (043, maximus)
```
src/
├── app/         # Next.js routes (pages, layouts, API)
├── widgets/     # Composed UI blocks (page sections)
├── features/    # Business logic slices (one folder per domain)
├── entities/    # Domain models (product, order, user, …)
└── shared/      # Utilities, config, types, design system, UI primitives
```

### Vite / React (damieus, ffs, atl-tequila-week, etc.)
```
src/
├── pages/       # Route components (React Router)
├── components/  # Shared UI components
├── features/    # FSD-style feature folders (preferred for new work)
├── hooks/       # Custom React hooks
├── lib/         # External API wrappers + utilities
├── integrations/supabase/  # Generated Supabase client + types.ts
└── contexts/    # React contexts
```

### Node CLI / Skill (audit-fix-ship, ugwtf, image-gen-30x-cli)
```
src/
├── config/      # Type definitions + constants
├── lib/         # Core services
├── prompts/     # Prompt manifests (TS, not markdown)
└── {entry}.ts   # CLI entry points
```

**Import direction (one-way only)**:
```
app → widgets → features → entities → shared → lib
```
Never import upward, never cross-feature.

---

## 5. `supabase/` — Database

| Subpath | Purpose |
|---------|---------|
| `supabase/migrations/` | `YYYYMMDDHHMMSS_description.sql` — append-only |
| `supabase/functions/` | Edge functions (Deno) |
| `supabase/config.toml` | Project config (CLI v2.x format) |
| `src/integrations/supabase/types.ts` (Vite) | Generated types — DO NOT edit |
| `src/shared/types/database.ts` (Next.js) | Generated types — DO NOT edit |

Regenerate types after every migration:
```bash
npx supabase gen types typescript --project-id <PROJECT_ID> > <PATH/TO/types.ts>
```

---

## 6. `.github/` — Repo Automation

| Subpath | Purpose |
|---------|---------|
| `.github/copilot-instructions.md` | Repo-wide rules (loaded by Copilot Chat) |
| `.github/instructions/*.instructions.md` | Path-scoped rules (use `applyTo:` frontmatter) |
| `.github/agents/*.agent.md` | Agent specs (system prompts) |
| `.github/prompts/*.prompt.md` | Slash-command prompts for Copilot Chat |
| `.github/workflows/*.yml` | GitHub Actions |
| `.github/scripts/` | Helper scripts called by workflows |
| `AGENTS.md` or `AGENT_INSTRUCTIONS.md` (repo root, depending on repo) | Primary agent reference (architecture, gotchas) |

**Rule**: Universal `*.instructions.md` files are auto-synced by `documentation-standards/scripts/push-rules.mts`. Never edit those locally — add repo-specific rules in NEW files instead.

---

## 7. Manifests (Single Source of Truth Per Concern)

| Manifest | Location | Purpose |
|----------|----------|---------|
| `package.json` | repo root | Dependencies + npm scripts |
| `tsconfig.json` | repo root | TypeScript config |
| `tailwind.config.{ts,js}` | repo root | Design tokens (when not using Tailwind v4 CSS-first) |
| `next.config.{js,ts}` | repo root | Next.js config |
| `vite.config.{ts,js}` | repo root | Vite config |
| `playwright.config.ts` | repo root | E2E config |
| `eslint.config.{mjs,js}` | repo root | ESLint flat config |
| `supabase/config.toml` | `supabase/` | Supabase project settings |
| Image-job manifest | `src/prompts/manifest.ts` | Image gen pipeline |
| Prompt-chain manifest | `projects/<repo>/prompt-chain.json` (UGWTF) | Chain orchestration |

---

## 8. Quick Decision Tree

| What are you creating? | Where? |
|------------------------|--------|
| New audit/plan doc | `docs/active/<name>.md` (preferred) or `docs/<NAME>.md` |
| Prompt for cloud agent | `docs/prompts/<name>.prompt.md` |
| Automation script | `scripts/<verb>-<noun>.mts` |
| Repo-wide rule | `.github/copilot-instructions.md` |
| Scoped rule (`applyTo:`) | `.github/instructions/<scope>.instructions.md` |
| Agent spec | `.github/agents/<name>.agent.md` |
| Slash command | `.github/prompts/<name>.prompt.md` |
| GitHub workflow | `.github/workflows/<name>.yml` |
| Generated report | `reports/<name>-<date>.{json,md}` |
| Migration | `supabase/migrations/YYYYMMDDHHMMSS_<desc>.sql` |
| Test (E2E) | `e2e/specs/<feature>.spec.ts` or `tests/e2e/...` |
| Test (unit) | colocated `*.test.ts` next to the source file |

---

## 9. Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|------|
| `~/Desktop/audit.md` | `docs/active/audit.md` |
| `/tmp/script.sh` | `scripts/script.mts` |
| `src/utils.ts` (root grab-bag) | `src/shared/utils/<purpose>.ts` |
| `feature-A/` importing `feature-B/` | extract shared logic to `entities/` or `shared/` |
| Renaming `data-testid` without updating E2E | rename in same commit as spec update |
| New `*.sh` automation | new `*.mts` automation |
| Ad-hoc backup folders (`backup-2025-12-31/`) | use git branches/tags |
