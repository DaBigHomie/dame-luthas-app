import type { GraphQLResponse } from "./types";

export class GraphQLClient {
  constructor(private readonly endpoint: string) {}

  async query<T>(
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(
        `GraphQL HTTP ${response.status}: ${response.statusText}`,
      );
    }

    const payload = (await response.json()) as GraphQLResponse<T>;

    if (payload.errors?.length) {
      throw new Error(
        payload.errors.map((error) => error.message).join("; "),
      );
    }

    if (!payload.data) {
      throw new Error("GraphQL response missing data");
    }

    return payload.data;
  }

  async probeField(field: string): Promise<boolean> {
    const query = `
      query ProbeField {
        ${field}(first: 1) {
          nodes { id }
        }
      }
    `;

    try {
      await this.query(query);
      return true;
    } catch {
      return false;
    }
  }

  async probeBuilderContent(): Promise<boolean> {
    const query = `
      query ProbeBuilderContent {
        pages(first: 1) {
          nodes { builderContent }
        }
      }
    `;

    try {
      await this.query(query);
      return true;
    } catch {
      return false;
    }
  }

  async resolveField(
    primary: string,
    fallbacks: readonly string[] = [],
  ): Promise<string | null> {
    if (await this.probeField(primary)) return primary;

    for (const fallback of fallbacks) {
      if (await this.probeField(fallback)) return fallback;
    }

    return null;
  }
}
