#!/usr/bin/env tsx
/**
 * Local prebuilt Vercel deploy pipeline.
 * Bypasses git webhook builds (vercel.json ignoreCommand) via CLI prebuild + --prebuilt.
 *
 * Usage:
 *   npx tsx scripts/deploy-vercel.mts [preview|production]
 *
 * Link project first (interactive — do not use --yes on vercel link):
 *   vercel link   # target org: dame-luthas
 */
import { spawnSync } from "node:child_process";
import process from "node:process";

type DeployEnvironment = "preview" | "production";

function fail(message: string): never {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    fail(`Command failed: ${command} ${args.join(" ")}`);
  }
}

const raw = process.argv[2] ?? "preview";
if (raw !== "preview" && raw !== "production") {
  fail("Usage: npx tsx scripts/deploy-vercel.mts [preview|production]");
}

const environment = raw as DeployEnvironment;
const vercelEnvironment = environment === "production" ? "production" : "preview";
const isProd = environment === "production";

console.log(
  `Deploying dame-luthas-app (${vercelEnvironment}) via local prebuilt pipeline`,
);

run("npx", ["vercel", "pull", "--yes", `--environment=${vercelEnvironment}`]);

const buildArgs = ["vercel", "build"];
if (isProd) {
  buildArgs.push("--prod");
}
run("npx", buildArgs);

const deployArgs = ["vercel", "deploy", "--yes", "--prebuilt"];
if (isProd) {
  deployArgs.push("--prod");
}
run("npx", deployArgs);

console.log(`Done: ${vercelEnvironment} deploy submitted.`);
