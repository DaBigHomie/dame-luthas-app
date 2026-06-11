#!/usr/bin/env npx tsx
/**
 * Local CI parity for dame-luthas-app (when GitHub Actions unavailable).
 *
 *   npm run ci:parity
 *   npm run ci:parity -- --skip-e2e
 *   npm run ci:parity -- --e2e-full
 *   npm run ci:parity -- --skip-install
 */
import { type ChildProcess, execSync, spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = (process.env.NEXT_URL ?? "http://localhost:3000").replace(/\/$/, "");
const port = Number(new URL(baseUrl).port || "3000");

function run(label: string, cmd: string): void {
  console.log(`\n━━ ${label} ━━\n`);
  execSync(cmd, { cwd: root, stdio: "inherit", env: process.env });
}

async function isReachable(): Promise<boolean> {
  try {
    const res = await fetch(baseUrl, { signal: AbortSignal.timeout(3_000) });
    return res.status < 500;
  } catch {
    return false;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureNextServer(): Promise<() => void> {
  if (await isReachable()) {
    console.log(`Next server already running at ${baseUrl}`);
    return () => undefined;
  }

  console.log(`Starting Next server at ${baseUrl} ...`);
  const child: ChildProcess = spawn("npm", ["run", "start"], {
    cwd: root,
    stdio: "pipe",
    detached: true,
    env: { ...process.env, PORT: String(port) },
  });

  child.unref();

  for (let attempt = 0; attempt < 45; attempt += 1) {
    if (await isReachable()) {
      console.log(`Next server ready (${attempt + 1}s)`);
      return () => {
        if (child.pid) {
          try {
            process.kill(-child.pid, "SIGTERM");
          } catch {
            try {
              process.kill(child.pid, "SIGTERM");
            } catch {
              /* already stopped */
            }
          }
        }
      };
    }
    await sleep(1_000);
  }

  throw new Error(`Next server did not become ready at ${baseUrl} within 45s`);
}

async function main(): Promise<void> {
  const args = new Set(process.argv.slice(2));
  const skipE2e = args.has("--skip-e2e");
  const e2eFull = args.has("--e2e-full");
  const skipInstall = args.has("--skip-install");

  console.log("Dame Luthas — CI parity (local)");
  if (skipInstall) console.log("  (skip npm ci)");
  if (skipE2e) console.log("  (skip E2E)");
  else if (e2eFull) console.log("  (E2E full suite)");
  else console.log("  (E2E critical subset)");

  if (!skipInstall) run("npm ci", "npm ci");

  run("TypeScript", "npx tsc --noEmit");
  run("ESLint", "npm run lint");
  run("Production build", "npm run build");
  run("Asset bindings", "npm run assets:verify-bindings");

  const stopServer = await ensureNextServer();
  try {
    run("Public routes (fetch)", "npm run verify:public-routes");

    if (!skipE2e) {
      run("Route manifest", "npm run discover:routes");
      const e2eCmd = e2eFull ? "npx playwright test" : "npm run test:e2e:critical";
      run(e2eFull ? "Playwright (full)" : "Playwright (critical)", e2eCmd);
    }
  } finally {
    stopServer();
  }

  console.log("\n✅ CI parity complete.\n");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
