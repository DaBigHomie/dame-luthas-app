#!/usr/bin/env tsx
/**
 * Local prebuilt Vercel deploy pipeline.
 * Bypasses git webhook builds (vercel.json ignoreCommand) via CLI prebuild + --prebuilt.
 *
 * Project target is pinned via .codebase-manifest.json so shell VERCEL_PROJECT_ID
 * cannot hijack deploys to another repo's project.
 *
 * Usage:
 *   npx tsx scripts/deploy-vercel.mts [preview|production]
 *
 * Link project first (interactive — do not use --yes on vercel link):
 *   vercel link --project dame-luthas-app --scope dame-luthas
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

type DeployEnvironment = "preview" | "production";

interface VercelManifest {
  projectId: string;
  orgId: string;
  projectName: string;
}

function fail(message: string): never {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function loadVercelTarget(): VercelManifest {
  const manifestPath = path.join(process.cwd(), ".codebase-manifest.json");
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch {
    fail(`Could not read ${manifestPath}`);
  }

  const vercel = (raw as { vercel?: VercelManifest }).vercel;
  if (!vercel?.projectId || !vercel?.orgId) {
    fail(
      "Missing vercel.projectId or vercel.orgId in .codebase-manifest.json",
    );
  }

  return vercel;
}

function vercelEnv(): NodeJS.ProcessEnv {
  const target = loadVercelTarget();
  const env = { ...process.env };

  if (
    env.VERCEL_PROJECT_ID &&
    env.VERCEL_PROJECT_ID !== target.projectId
  ) {
    console.warn(
      `Overriding VERCEL_PROJECT_ID=${env.VERCEL_PROJECT_ID} → ${target.projectId} (${target.projectName})`,
    );
  }

  env.VERCEL_PROJECT_ID = target.projectId;
  env.VERCEL_ORG_ID = target.orgId;
  return env;
}

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: vercelEnv(),
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
const target = loadVercelTarget();

console.log(
  `Deploying ${target.projectName} (${target.projectId}) [${vercelEnvironment}] via local prebuilt pipeline`,
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

console.log(`Done: ${vercelEnvironment} deploy submitted for ${target.projectName}.`);
