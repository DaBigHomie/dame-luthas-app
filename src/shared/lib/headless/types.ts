export type HeadlessMode = "live" | "snapshot";

export interface WpContentItem {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  postType: string;
  status: string;
  date: string;
  uri?: string;
  featuredImageUrl?: string | null;
}

export interface WpSiteInfo {
  title: string;
  url: string;
  mode: HeadlessMode;
}

export interface HeadlessSnapshot {
  generatedAt: string;
  site: { title: string; url: string };
  pages: WpContentItem[];
  portfolio: WpContentItem[];
  posts: WpContentItem[];
}
