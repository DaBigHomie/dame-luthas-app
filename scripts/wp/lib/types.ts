export interface GraphQLError {
  message: string;
  path?: Array<string | number>;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

export interface WpImage {
  sourceUrl: string;
  altText: string;
}

export interface WpFeaturedImage {
  node: WpImage;
}

export interface WpContentNode {
  id: string;
  databaseId?: number;
  title: string;
  slug: string;
  content?: string | null;
  builderContent?: string | null;
  excerpt?: string | null;
  date?: string | null;
  status?: string | null;
  uri?: string | null;
  featuredImage?: WpFeaturedImage | null;
  categories?: { nodes: Array<{ name: string; slug: string }> };
  tags?: { nodes: Array<{ name: string; slug: string }> };
}

export interface WpMenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
  parentId?: string | null;
}

export interface WpMenu {
  name: string;
  slug: string;
  menuItems: { nodes: WpMenuItem[] };
}

export interface WpMediaItem {
  id: string;
  title?: string;
  sourceUrl: string;
  altText: string;
  mimeType: string;
  mediaDetails?: {
    width: number;
    height: number;
    file?: string;
  };
}

export interface ConnectionPageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface Connection<T> {
  nodes: T[];
  pageInfo: ConnectionPageInfo;
}

export interface ExtractionSummary {
  extractedAt: string;
  endpoint: string;
  counts: Record<string, number>;
  resolvedFields: Record<string, string>;
  warnings: string[];
}

export interface SupabaseSeedBundle {
  generatedAt: string;
  portfolio_items: Array<Record<string, unknown>>;
  case_studies: Array<Record<string, unknown>>;
  services: Array<Record<string, unknown>>;
  pages: Array<Record<string, unknown>>;
  posts: Array<Record<string, unknown>>;
  menus: WpMenu[];
  media: WpMediaItem[];
}
