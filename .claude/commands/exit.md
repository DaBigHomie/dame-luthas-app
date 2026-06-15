# /exit — Dame Luthas session teardown

Follow **`documentation-standards/skills/exit/SKILL.md`** and repo checkpoint script.

## 1. Quality gates

```bash
cd ~/management-git/dame-luthas-app
npx tsc --noEmit && npm run lint && npm run build
```

## 2. Checkpoint + manifest

```bash
npx tsx scripts/checkpoint.mts "short-session-title"
```

Write or update manifest:

`documentation-standards/docs/context-manifests/YYYY-MM-DD_dame-luthas-*.md`

## 3. CORTEX close + artifact seed

```bash
npx tsx ../.agent-kb/anvil/run.mts close --session=$(jq -r '._meta.sessionId // .session.id' .cortex-boot.json) --repo=dame-luthas-app
```

Seed checkpoint/manifest to `knowledge` per `.cortex-boot.json` → `knowledge.artifactProtocol`.

## 4. Slack handoff (Management workspace)

```bash
cd ~/management-git/documentation-standards
source ~/management-git/.env.mcp 2>/dev/null
node scripts/post-handoff-to-slack.mjs --file docs/context-manifests/<manifest>.md --kind handoff
```

## 5. 40x verify (read-only)

```bash
cd ~/management-git/documentation-standards
node scripts/verify-workspace-40x.mjs
```

## 6. Git

Commit only when requested. Note WIP in manifest if dirty.

**Do not** use `HANDOVER.md` as SSOT — use CORTEX + context manifest.
