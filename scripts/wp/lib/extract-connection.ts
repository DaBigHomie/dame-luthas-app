import { HEADLESS_CONFIG } from "../config";
import { GraphQLClient } from "./graphql-client";
import { buildConnectionQuery, MEDIA_QUERY } from "./queries";
import type { Connection, WpContentNode, WpMediaItem } from "./types";

export async function extractConnection<T>(
  client: GraphQLClient,
  field: string,
  extraFields = "",
  options?: { builderContent?: boolean; template?: boolean },
): Promise<T[]> {
  const query = buildConnectionQuery(field, extraFields, options);
  const pageSize = HEADLESS_CONFIG.graphql.pageSize;
  const items: T[] = [];
  let after: string | null = null;

  for (;;) {
    const data: Record<string, Connection<T>> = await client.query(query, {
      first: pageSize,
      after,
    });

    const connection: Connection<T> = data[field];
    if (!connection) {
      throw new Error(`Missing connection field: ${field}`);
    }

    items.push(...connection.nodes);
    if (!connection.pageInfo.hasNextPage) break;
    after = connection.pageInfo.endCursor;
  }

  return items;
}

export async function extractContentNodes(
  client: GraphQLClient,
  field: string,
  extraFields = "",
  options?: { builderContent?: boolean; template?: boolean },
): Promise<WpContentNode[]> {
  return extractConnection<WpContentNode>(client, field, extraFields, options);
}

export async function extractMedia(
  client: GraphQLClient,
): Promise<WpMediaItem[]> {
  const pageSize = HEADLESS_CONFIG.graphql.pageSize;
  const items: WpMediaItem[] = [];
  let after: string | null = null;

  for (;;) {
    const data: { mediaItems: Connection<WpMediaItem> } = await client.query(
      MEDIA_QUERY,
      { first: pageSize, after },
    );

    items.push(...data.mediaItems.nodes);
    if (!data.mediaItems.pageInfo.hasNextPage) break;
    after = data.mediaItems.pageInfo.endCursor;
  }

  return items;
}
