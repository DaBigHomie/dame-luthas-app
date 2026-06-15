# /checkpoint — Dame Luthas session checkpoint

```bash
cd ~/management-git/dame-luthas-app
npx tsx scripts/checkpoint.mts "title-slug-here"
```

Include in checkpoint when closing a slice:

- **For Jay** — plain-language stakeholder summary (optional)
- **Diagram** — mermaid or link (optional)
- **Related links** — PR, production URL, manifest path

After writing, seed to CORTEX:

```bash
sqlite3 ../.agent-kb/db/agent_kb.sqlite "
INSERT OR REPLACE INTO knowledge (key, repo, value, updated_at)
VALUES (
  'artifact:dame_luthas:' || date('now') || ':checkpoint',
  'dame-luthas-app',
  json_object('type','checkpoint','path','docs/checkpoints/<file>.md','status','complete'),
  datetime('now')
);"
```

Cross-ref: `documentation-standards/docs/PRIME-GATE-AGENT-REVIEW.md` §9 session workflow.
