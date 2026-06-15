#!/usr/bin/env npx tsx
/**
 * Prime Gate — Cursor stop hook (.mts only).
 * Emits followup_message ONLY for actionable automation (open PR review).
 * Session close is @exit / prime_close — never a passive stop-hook reminder.
 */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

function findAgentKb(repoRoot: string): string | null {
  let dir = repoRoot;
  for (let i = 0; i < 24; i++) {
    const c = join(dir, '.agent-kb');
    if (existsSync(c)) return c;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

async function main(): Promise<void> {
  const agentKb = findAgentKb(REPO_ROOT);
  if (!agentKb) {
    process.stdout.write('{}');
    process.exit(0);
  }

  const hooks = await import(join(agentKb, 'anvil/lib/prime-gate-hooks.mts'));
  const stopPayload = await hooks.readStopHookStdin();

  if (stopPayload.status && stopPayload.status !== 'completed') {
    process.stdout.write('{}');
    process.exit(0);
  }

  let repoSlug: string;
  try {
    const ws = await hooks.loadHookWorkspace(REPO_ROOT);
    repoSlug = ws.repoSlug;
  } catch {
    repoSlug = hooks.inferRepoSlugFromRoot(REPO_ROOT);
  }

  const activeSessionId = hooks.getActiveSessionId(repoSlug);
  if (!activeSessionId) {
    process.stdout.write('{}');
    process.exit(0);
  }

  const parts: string[] = [];

  try {
    const { openPrimeGateDb } = await import(join(agentKb, 'anvil/lib/prime-gate-db.mts'));
    const { getSessionPrUrls, buildBackgroundPrReviewFollowup } = await import(
      join(agentKb, 'anvil/lib/prime-gate-pr-review.mts')
    );
    const db = openPrimeGateDb();
    try {
      const prUrls = getSessionPrUrls(db, repoSlug, activeSessionId);
      const prFollowup = buildBackgroundPrReviewFollowup(prUrls);
      if (prFollowup) parts.push(prFollowup);
    } finally {
      db.close();
    }
  } catch {
    /* PR review assignment is best-effort */
  }

  if (parts.length === 0) {
    process.stdout.write('{}');
    process.exit(0);
  }

  process.stdout.write(JSON.stringify({ followup_message: parts.join('\n\n') }));
  process.exit(0);
}

main().catch(() => {
  process.stdout.write('{}');
  process.exit(0);
});
