# /cortex-dispatch — Dame Luthas task orchestrator

**SSOT:** CORTEX `tasks` table + fresh `.cortex-boot.json` (run `/start` boot first).

## Step 1 — Refresh boot file

```bash
cd ~/management-git/dame-luthas-app
npx tsx ../.agent-kb/anvil/cortex-boot.mts --repo=dame-luthas-app --agent=181 --force
```

## Step 2 — Dispatch table (from DB)

```bash
sqlite3 ../.agent-kb/db/agent_kb.sqlite "
SELECT priority, id, status, substr(description,1,72)
FROM tasks
WHERE repo='dame-luthas-app' AND status IN ('pending','in_progress')
ORDER BY priority, id;"
```

## Step 3 — Dame Luthas routing (current)

| Task area | Route |
|-----------|--------|
| `task_luthas_wp_*` | WP migration — `docs/SWARM-PLAYBOOK-WP-TO-NEXT-MIGRATION.md` |
| `task_luthas_db_*` | Supabase schema — `docs/WEBAPP-BUILD.md` Phase 4 |
| `task_luthas_ui_*` | Stitch / frontend — `docs/WEBAPP-BUILD.md` Phase 1–2 |
| `task_luthas_deploy_*` | Domain + env — `.codebase-manifest.json` `vercel` block |

## Step 4 — Mark complete after work

```bash
npx tsx ../.agent-kb/anvil/run.mts checkpoint --task=<task_id> --status=complete --repo=dame-luthas-app
```

Or update via SQL + `npx tsx ../.agent-kb/db/sync.mts --push` for cloud.

## Dry-run

Steps 1–2 only — no task mutations.
