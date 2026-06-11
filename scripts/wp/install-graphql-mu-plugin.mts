#!/usr/bin/env npx tsx
/**
 * Install headless GraphQL mu-plugin into the active local WP tree.
 *
 * Usage: npx tsx scripts/wp/install-graphql-mu-plugin.mts
 */

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { HEADLESS_CONFIG } from "./config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE = join(__dirname, "templates/dameluthas-headless-graphql.php");

function main(): void {
  const publicPath = HEADLESS_CONFIG.paths.localWpPublic;
  if (!publicPath || !existsSync(publicPath)) {
    throw new Error(
      "localWpPublic not found — run wp:sync-local or set LOCAL_WP_PUBLIC_PATH",
    );
  }

  const muDir = join(publicPath, "wp-content/mu-plugins");
  mkdirSync(muDir, { recursive: true });

  const dest = join(muDir, "dameluthas-headless-graphql.php");
  copyFileSync(TEMPLATE, dest);

  console.log("✅ Installed WPGraphQL mu-plugin");
  console.log(`   ${dest}`);
  console.log("   Reload http://dameluthas.local/graphql to pick up changes");
}

main();
