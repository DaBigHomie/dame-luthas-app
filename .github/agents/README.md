# Dame Luthas — Agent Index

| Agent | ID | Use when |
|-------|-----|----------|
| [thegem-css-orchestrator](./thegem-css-orchestrator.agent.md) | TG-ORCH-001 | Assign 50-file CSS remix batches |
| [thegem-css-audit](./thegem-css-audit.agent.md) | TG-CSS-001 | CSS formatting + parity review |
| [thegem-animation-audit](./thegem-animation-audit.agent.md) | TG-ANIM-001 | Motion / hover / reduced-motion review |
| [code-review](./code-review.agent.md) | SCR-001 | Pre-merge FSD + token gate |
| [malfig-gatekeeper](./malfig-gatekeeper.agent.md) | MLF-001 | Policy gate |
| [forge-orchestrator](./forge-orchestrator.agent.md) | FRG-ORCH-001 | Content pipeline (legacy MIH scope) |

## The Gem CSS remix sprint

Prompt: `.github/prompts/thegem-css-remix.prompt.md`

```bash
npm run thegem:audit-css
npm run wp:screenshots:next
```

Invoke: `@thegem-css-orchestrator` → assigns `@thegem-css-audit` + `@thegem-animation-audit`.
