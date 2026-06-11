#!/usr/bin/env npx tsx
/**
 * Session checkpoint — git state + build gates → docs/checkpoints/
 * Usage: npx tsx scripts/checkpoint.mts "migration-playbook-widget-census"
 */
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const title = (args[0] ?? "session-checkpoint").replace(/[^\w-]/g, "-");
const outDir = join(process.cwd(), "docs/checkpoints");

function run(cmd: string): string {
  try {
    return execSync(cmd, { encoding: "utf8", timeout: 120_000 }).trim();
  } catch {
    return "";
  }
}

const now = new Date();
const date = now.toISOString().slice(0, 10);
const time = now.toTimeString().slice(0, 5).replace(":", "");
const branch = run("git branch --show-current");
const lastCommits = run("git log -n 5 --oneline");
const diffStat = run("git diff --stat HEAD~1 2>/dev/null") || run("git diff --stat");
const tsc = run("npx tsc --noEmit 2>&1 | tail -8");
const tscOk = !tsc.toLowerCase().includes("error");

const body = `# Checkpoint: ${title}

**Date:** ${date} ${time}  
**Branch:** ${branch}

## Recent commits

\`\`\`
${lastCommits}
\`\`\`

## Diff stat

\`\`\`
${diffStat || "(clean)"}
\`\`\`

## Gates

- TypeScript: ${tscOk ? "PASS" : "FAIL"}
${tsc ? `\`\`\`\n${tsc}\n\`\`\`` : ""}

## Active backlog

See \`docs/tasks/WIDGET-PARITY-TASKS.md\` and \`docs/MIGRATION-PLAYBOOK.md\`.

## Next

1. \`task_luthas_wp_020\` — StyledImage stagger service layout
2. \`task_luthas_wp_022\` — Full testimonials via _elementor_data
3. \`npm run wp:visual-parity-audit\` after layout fixes
`;

mkdirSync(outDir, { recursive: true });
const file = join(outDir, `${date}-${title}-${time}.md`);
writeFileSync(file, body);
console.log(`Checkpoint: ${file}`);
