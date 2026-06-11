#!/usr/bin/env npx tsx
/**
 * Remove Rank Math redirect loop on Amazon portfolio slug.
 *
 * Run when /pf/amazon-labor-union-digital-transformation/ returns ERR_TOO_MANY_REDIRECTS.
 * Requires Local site dameluthas.local (ZSxUXGBjq) running.
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");
const config = JSON.parse(
  readFileSync(join(root, "scripts/wp/local-wp.config.json"), "utf8"),
) as { siteDomain: string; localSshEntryScript: string };

const domain = config.siteDomain ?? "dameluthas.local";
const shell = config.localSshEntryScript;
const evalPhp = join(root, "scripts/wp/lib/fix-rank-math-amazon-redirect.php");

execSync(`bash "${shell}" <<'EOF'\nwp eval-file "${evalPhp}"\nEOF`, {
  stdio: "inherit",
  shell: "/bin/bash",
  env: { ...process.env, DAME_LUTHAS_DOMAIN: domain },
});

const check = execSync(
  `curl -sI -L --max-redirs 3 "http://${domain}/pf/amazon-labor-union-digital-transformation/" | grep -E '^HTTP|^Location' || true`,
  { encoding: "utf8" },
);
console.log(check.trim() || "(no response — is Local site running?)");
