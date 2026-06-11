import "server-only";

import { HEADLESS_CONFIG } from "./config";
import type { WpContentItem, WpSiteInfo } from "./types";

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

async function query<T>(
  queryText: string,
  variables?: Record<string, unknown>,
): Promise<T | null> {
  try {
    const response = await fetch(HEADLESS_CONFIG.graphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: queryText, variables }),
      next: { revalidate: 60 },
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as GraphQLResponse<T>;
    if (payload.errors?.length || !payload.data) return null;
    return payload.data;
  } catch {
    return null;
  }
}

const NODE_FIELDS = `
  id
  databaseId
  title
  slug
  content
  excerpt
  date
  status
  uri
  featuredImage { node { sourceUrl altText } }
`;

function mapNode(node: {
  databaseId?: number;
  id: string;
  title: string;
  slug: string;
  content?: string | null;
  excerpt?: string | null;
  date?: string | null;
  status?: string | null;
  uri?: string | null;
  featuredImage?: { node: { sourceUrl: string } } | null;
}, postType: string): WpContentItem {
  return {
    id: node.databaseId ?? 0,
    slug: node.slug,
    title: node.title,
    content: node.content ?? "",
    excerpt: node.excerpt ?? "",
    postType,
    status: node.status ?? "publish",
    date: node.date ?? "",
    uri: node.uri ?? undefined,
    featuredImageUrl: node.featuredImage?.node.sourceUrl ?? null,
  };
}

export async function fetchLiveSiteInfo(): Promise<WpSiteInfo | null> {
  const data = await query<{ generalSettings: { title: string; url: string } }>(`
    query SiteInfo {
      generalSettings { title url }
    }
  `);
  if (!data) return null;
  return { ...data.generalSettings, mode: "live" };
}

async function fetchConnection(
  field: string,
  postType: string,
): Promise<WpContentItem[]> {
  const data = await query<Record<string, { nodes: Array<Parameters<typeof mapNode>[0]> }>>(`
    query FetchContent {
      ${field}(first: 100, where: { status: PUBLISH }) {
        nodes { ${NODE_FIELDS} }
      }
    }
  `);
  if (!data?.[field]) return [];
  return data[field].nodes.map((node) => mapNode(node, postType));
}

export async function fetchLivePortfolio(): Promise<WpContentItem[]> {
  for (const field of ["thegemPfItems", "portfolioItems", "pfItems"]) {
    const items = await fetchConnection(field, "thegem_pf_item");
    if (items.length > 0) return items;
  }
  return [];
}

export async function fetchLivePages(): Promise<WpContentItem[]> {
  return fetchConnection("pages", "page");
}

export async function fetchLivePosts(): Promise<WpContentItem[]> {
  return fetchConnection("posts", "post");
}

export async function isLiveGraphqlAvailable(): Promise<boolean> {
  return (await fetchLiveSiteInfo()) !== null;
}
