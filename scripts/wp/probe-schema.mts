#!/usr/bin/env npx tsx
import { GraphQLClient } from "./lib/graphql-client";

const client = new GraphQLClient(
  process.env.WP_HEADLESS_GRAPHQL_URL ?? "http://dameluthas.local/graphql",
);

const ct = await client.query<{
  contentTypes: {
    nodes: Array<{
      name: string;
      graphqlSingleName: string;
      graphqlPluralName: string;
    }>;
  };
}>(`{
  contentTypes(first: 50) {
    nodes { name graphqlSingleName graphqlPluralName }
  }
}`);

console.log("=== Content Types (gem/client/testimonial) ===");
for (const t of [...ct.contentTypes.nodes].sort((a, b) =>
  (a.name ?? "").localeCompare(b.name ?? ""),
)) {
  const blob = `${t.name}${t.graphqlSingleName}${t.graphqlPluralName}`;
  if (/client|testimonial|gem|pf|portfolio/i.test(blob)) {
    console.log(`${t.name} → ${t.graphqlSingleName} / ${t.graphqlPluralName}`);
  }
}

console.log("\n=== All content types ===");
for (const t of [...ct.contentTypes.nodes].sort((a, b) =>
  (a.graphqlPluralName ?? "").localeCompare(b.graphqlPluralName ?? ""),
)) {
  console.log(
    `${t.graphqlPluralName ?? "?"} (${t.name ?? "unnamed"})`,
  );
}

const page = await client.query<{
  page: {
    databaseId: number;
    title: string;
    isFrontPage: boolean;
    content: string | null;
    builderContent: string | null;
  };
}>(`{
  page(id: 375, idType: DATABASE_ID) {
    databaseId title isFrontPage
    content(format: RENDERED)
    builderContent
  }
}`);

console.log("\n=== Page 375 ===");
console.log(
  page.page.title,
  "front:",
  page.page.isFrontPage,
  "content:",
  page.page.content?.length ?? 0,
  "builder:",
  page.page.builderContent?.length ?? 0,
);

const menus = await client.query<{
  menus: {
    nodes: Array<{
      name: string;
      slug: string;
      count: number;
      menuItems: {
        nodes: Array<{
          label: string;
          description: string | null;
          url: string;
        }>;
      };
    }>;
  };
}>(`{
  menus(first: 20) {
    nodes {
      name slug count
      menuItems { nodes { label description url cssClasses } }
    }
  }
}`);

console.log("\n=== Menus (all) ===");
for (const m of menus.menus.nodes) {
  console.log(`${m.slug} (${m.count}) — ${m.name}`);
  for (const i of m.menuItems.nodes) {
    console.log(
      `  • ${i.label} | ${(i.description ?? "").slice(0, 80)} | ${i.url}`,
    );
  }
}

const probes = [
  "clients",
  "client",
  "testimonials",
  "testimonial",
  "thegemClients",
  "thegemTestimonials",
  "gemClients",
  "thegemPfItems",
  "thegemTemplates",
  "mediaItems",
  "menus",
  "agents",
  "properties",
];

console.log("\n=== Root field probes ===");
for (const field of probes) {
  const ok = await client.probeField(field);
  console.log(`${ok ? "✅" : "❌"} ${field}`);
}

if (await client.probeField("agents")) {
  const agents = await client.query<{
    agents: { nodes: Array<{ databaseId: number; title: string; slug: string }> };
  }>(`{ agents(first: 10) { nodes { databaseId title slug } } }`);
  console.log("\n=== agents CPT ===");
  for (const a of agents.agents.nodes) {
    console.log(`  ${a.databaseId} ${a.slug} — ${a.title}`);
  }
}

// Sample homepage HTML markers
const html = page.page.content ?? page.page.builderContent ?? "";
const markers = [
  "gem-client",
  "thegem-menu-custom",
  "rotating-text",
  "thegem-heading-rotating",
  "AI for Social Impact",
  "Microsoft Cloud",
];
console.log("\n=== Homepage HTML markers ===");
for (const m of markers) {
  console.log(`${m}: ${html.includes(m) ? "yes" : "no"}`);
}
