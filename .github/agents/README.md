# Dame Luthas — Agent Index

| Agent | ID | Use when |
|-------|-----|----------|
| [thegem-css-orchestrator](./thegem-css-orchestrator.agent.md) | TG-ORCH-001 | Assign 50-file CSS remix batches |
| [thegem-css-audit](./thegem-css-audit.agent.md) | TG-CSS-001 | CSS formatting + parity review |
| [thegem-animation-audit](./thegem-animation-audit.agent.md) | TG-ANIM-001 | Motion / hover / reduced-motion review |
| [code-review](./code-review.agent.md) | SCR-001 | Pre-merge FSD + token gate |
| [malfig-gatekeeper](./malfig-gatekeeper.agent.md) | MLF-001 | Policy gate |
| [forge-orchestrator](./forge-orchestrator.agent.md) | FRG-ORCH-001 | Content pipeline (legacy MIH scope) |
| [playwright-runner](./playwright-runner.agent.md) | PW-RUN-001 | Run e2e / parity specs |
| [playwright-orchestrator](./playwright-orchestrator.agent.md) | PW-ORCH-001 | Coordinate visual QA batches |
| [playwright-fixer](./playwright-fixer.agent.md) | PW-FIX-001 | Fix failing Playwright tests |
| [migration-tracker](./migration-tracker.agent.md) | MIG-TRK-001 | WP → Next migration progress |
| [deploy-gate](./deploy-gate.agent.md) | DEP-GATE-001 | Pre-deploy quality gate |
| [vercel-doctor](./vercel-doctor.agent.md) | VCL-DOC-001 | Vercel config / deploy issues |
| [ds-token-auditor](./ds-token-auditor.agent.md) | DS-TOK-001 | Design token drift |
| [ds-animation](./ds-animation.agent.md) | DS-ANIM-001 | Motion / animation parity |
| [test-gap](./test-gap.agent.md) | TST-GAP-001 | Missing test coverage |
| [dom-sleuth](./dom-sleuth.agent.md) | DOM-SLH-001 | DOM / widget census debugging |
| [regression-detector](./regression-detector.agent.md) | REG-DET-001 | Visual / build regressions |

## Pre-commit

```bash
git config core.hooksPath .githooks
```

Runs `scripts/pre-commit-gate.mts` (tsc + lint; widget census when registry changes).

## The Gem CSS remix sprint

Prompt: `.github/prompts/thegem-css-remix.prompt.md`

```bash
npm run thegem:audit-css
npm run wp:screenshots:next
```

Invoke: `@thegem-css-orchestrator` → assigns `@thegem-css-audit` + `@thegem-animation-audit`.
