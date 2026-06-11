#!/usr/bin/env npx tsx
/**
 * Health-check the local headless WordPress GraphQL endpoint.
 *
 * Usage:
 *   npx tsx scripts/wp/verify-headless.mts
 *   WP_HEADLESS_GRAPHQL_URL=http://localhost:10008/graphql npx tsx scripts/wp/verify-headless.mts
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

import { HEADLESS_CONFIG } from "./config";
import { GraphQLClient } from "./lib/graphql-client";
import {
  formatLocalSiteDiagnostics,
  getLocalSiteInfo,
} from "./lib/local-site";
import { HEALTH_QUERY, INTROSPECTION_QUERY } from "./lib/queries";

function loadLocalSiteId(): string {
  try {
    const configPath = join(__dirname, "local-wp.config.json");
    const config = JSON.parse(readFileSync(configPath, "utf8")) as {
      localSiteId?: string;
    };
    return config.localSiteId ?? "cfEOO-2XZ";
  } catch {
    return "cfEOO-2XZ";
  }
}

async function main(): Promise<void> {
  const endpoint = HEADLESS_CONFIG.graphql.endpoint;
  console.log(`🔍 Verifying headless WP GraphQL\n   ${endpoint}\n`);

  const localSite = getLocalSiteInfo(loadLocalSiteId());
  if (localSite) {
    console.log(formatLocalSiteDiagnostics(localSite));
    console.log("");
  }

  const client = new GraphQLClient(endpoint);

  try {
    const health = await client.query<{
      generalSettings: { title: string; url: string };
    }>(HEALTH_QUERY);
    console.log(`✅ Site: ${health.generalSettings.title}`);
    console.log(`   URL:  ${health.generalSettings.url}`);
  } catch (error) {
    console.error("❌ GraphQL unreachable or WPGraphQL not active");
    console.error(`   ${error instanceof Error ? error.message : error}`);

    if (localSite?.status === "halted") {
      console.error("\n   Blocker: Local site is stopped.");
      console.error("   → Open Local app and click Start on dameluthas-com-restore");
      console.error("   → Then re-run: npx tsx scripts/wp/verify-headless.mts");
    } else {
      console.error("\n   Ensure wp-graphql is active:");
      console.error("   wp plugin activate wp-graphql wpgraphql-acf");
    }

    process.exit(1);
  }

  try {
    await client.query(INTROSPECTION_QUERY);
    console.log("✅ GraphQL introspection enabled");
  } catch {
    console.warn(
      "⚠️  GraphQL introspection disabled (OK — using field probes)",
    );
  }

  console.log("\n📊 Content field probe:");
  const resolved: Record<string, string | null> = {};

  for (const item of HEADLESS_CONFIG.contentQueries) {
    const field = await client.resolveField(item.graphqlField, item.fallbacks);
    resolved[item.key] = field;

    if (field) {
      console.log(`   ✅ ${item.label}: ${field}`);
    } else {
      console.log(`   ⚠️  ${item.label}: not exposed in GraphQL`);
    }
  }

  const portfolioOk = resolved.portfolio !== null;
  const pagesOk = resolved.pages !== null;

  if (!pagesOk) {
    console.error("\n❌ pages query unavailable — extraction cannot proceed");
    process.exit(1);
  }

  if (!portfolioOk) {
    console.warn(
      "\n⚠️  Portfolio CPT not in GraphQL — enable show_in_graphql on thegem_pf_item in WP admin",
    );
  }

  console.log("\n✅ Headless endpoint ready for extraction");
  console.log("   Run: npx tsx scripts/wp/extract-content.mts");
}

main().catch((error) => {
  console.error("❌ Verify failed:", error);
  process.exit(1);
});
