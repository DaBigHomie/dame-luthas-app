# /start — Dame Luthas session boot (CORTEX + Prime Gate)

Run at the **start of every session** on `dame-luthas-app`.

## 1. CORTEX boot (SSOT — not chat recap)

```bash
cd ~/management-git/dame-luthas-app
npx tsx ../.agent-kb/anvil/cortex-boot.mts --repo=dame-luthas-app --agent=181 --force
```

Read `.cortex-boot.json` → `tasks`, `knowledge.recentEntries`, `plans.activeCheckpoints`.

Optional ANVIL open:

```bash
npx tsx ../.agent-kb/anvil/run.mts open --repo=dame-luthas-app --agent=181
```

## 2. Git state

```bash
git branch --show-current && git status --short && git log --oneline -5
```

## 3. Quality gate snapshot (before edits)

```bash
npx tsc --noEmit && npm run lint
```

## 4. Docs load order

1. `.codebase-manifest.json`
2. `docs/PROJECT-OVERVIEW.md`
3. `docs/WEBAPP-BUILD.md` (phase checklist)
4. Latest `docs/checkpoints/*.md`

## 5. Report back

- Session id from `.cortex-boot.json`
- CORTEX pending / in-progress tasks (DB truth)
- Git branch + last commit
- Production URL: https://dameluthas.damieus.app
- Recommended next task (priority order)

**Rule:** Continuity lives in **CORTEX SQLite** (`sessions`, `tasks`, `knowledge`). Do not treat chat summaries or stale `.cortex-boot.json` alone as SSOT — re-run boot if file is older than last commit.
