/** Shared node fields for pages, posts, and CPT items */
export function contentNodeFields(options?: { builderContent?: boolean }): string {
  const builderField = options?.builderContent ? "\n  builderContent" : "";
  return `
  id
  databaseId
  title
  slug
  content${builderField}
  excerpt
  date
  status
  uri
  featuredImage {
    node {
      sourceUrl
      altText
    }
  }
`;
}

/** Default fields without optional extensions */
export const CONTENT_NODE_FIELDS = contentNodeFields();

export const POST_EXTRA_FIELDS = `
  categories {
    nodes { name slug }
  }
  tags {
    nodes { name slug }
  }
`;

/** Fields for The Gem template CPTs (no excerpt / featuredImage on schema) */
export function templateNodeFields(options?: { builderContent?: boolean }): string {
  const builderField = options?.builderContent ? "\n  builderContent" : "";
  return `
  id
  databaseId
  title
  slug
  content${builderField}
  date
  status
  uri
`;
}

export function buildConnectionQuery(
  field: string,
  extraFields = "",
  options?: { builderContent?: boolean; template?: boolean },
): string {
  const nodeFields = options?.template
    ? templateNodeFields(options)
    : contentNodeFields(options);
  return `
    query Extract_${field}($first: Int!, $after: String) {
      ${field}(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ${nodeFields}
          ${extraFields}
        }
      }
    }
  `;
}

export const MENUS_QUERY = `
  query ExtractMenus {
    menus {
      nodes {
        name
        slug
        menuItems {
          nodes {
            id
            label
            url
            order
            parentId
          }
        }
      }
    }
  }
`;

export const MEDIA_QUERY = `
  query ExtractMedia($first: Int!, $after: String) {
    mediaItems(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        sourceUrl
        altText
        mimeType
        mediaDetails {
          width
          height
          file
        }
      }
    }
  }
`;

export const INTROSPECTION_QUERY = `
  query IntrospectRoot {
    __schema {
      queryType {
        fields {
          name
        }
      }
    }
  }
`;

export const HEALTH_QUERY = `
  query HealthCheck {
    generalSettings {
      title
      url
    }
  }
`;
