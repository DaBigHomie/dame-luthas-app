import "server-only";

import {
  fetchLivePages,
  fetchLivePortfolio,
  fetchLivePosts,
  fetchLiveSiteInfo,
  isLiveGraphqlAvailable,
} from "./graphql-client";
import {
  getSnapshotBySlug,
  getSnapshotSiteInfo,
  isSnapshotAvailable,
  listSnapshotPages,
  listSnapshotPortfolio,
  listSnapshotPosts,
} from "./snapshot";
import type { HeadlessMode, WpContentItem, WpSiteInfo } from "./types";

export async function getHeadlessMode(): Promise<HeadlessMode> {
  if (process.env.HEADLESS_MODE === "snapshot") return "snapshot";
  if (process.env.HEADLESS_MODE === "live") return "live";
  if (await isLiveGraphqlAvailable()) return "live";
  if (isSnapshotAvailable()) return "snapshot";
  return "snapshot";
}

export async function getSiteInfo(): Promise<WpSiteInfo> {
  const mode = await getHeadlessMode();
  if (mode === "live") {
    const live = await fetchLiveSiteInfo();
    if (live) return live;
  }
  if (isSnapshotAvailable()) return getSnapshotSiteInfo();
  return {
    title: "Dame Luthas",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    mode: "snapshot",
  };
}

export async function listPortfolio(): Promise<WpContentItem[]> {
  const mode = await getHeadlessMode();
  if (mode === "live") {
    const live = await fetchLivePortfolio();
    if (live.length > 0) return live;
  }
  if (isSnapshotAvailable()) return listSnapshotPortfolio();
  return [];
}

export async function listPages(): Promise<WpContentItem[]> {
  const mode = await getHeadlessMode();
  if (mode === "live") {
    const live = await fetchLivePages();
    if (live.length > 0) return live;
  }
  if (isSnapshotAvailable()) return listSnapshotPages();
  return [];
}

export async function listPosts(): Promise<WpContentItem[]> {
  const mode = await getHeadlessMode();
  if (mode === "live") {
    const live = await fetchLivePosts();
    if (live.length > 0) return live;
  }
  if (isSnapshotAvailable()) return listSnapshotPosts();
  return [];
}

export async function getPageBySlug(slug: string): Promise<WpContentItem | null> {
  const pages = await listPages();
  return pages.find((page) => page.slug === slug) ?? null;
}

export async function getPortfolioBySlug(
  slug: string,
): Promise<WpContentItem | null> {
  const items = await listPortfolio();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getContentBySlug(slug: string): Promise<WpContentItem | null> {
  const mode = await getHeadlessMode();
  if (mode === "live") {
    const portfolio = await getPortfolioBySlug(slug);
    if (portfolio) return portfolio;
    return getPageBySlug(slug);
  }
  return getSnapshotBySlug(slug);
}

export async function getPilotStatus(): Promise<{
  mode: HeadlessMode;
  graphqlUrl: string;
  snapshotReady: boolean;
  portfolioCount: number;
  pageCount: number;
}> {
  const mode = await getHeadlessMode();
  const [portfolio, pages] = await Promise.all([listPortfolio(), listPages()]);
  return {
    mode,
    graphqlUrl: process.env.WP_HEADLESS_GRAPHQL_URL ?? "(default local)",
    snapshotReady: isSnapshotAvailable(),
    portfolioCount: portfolio.length,
    pageCount: pages.length,
  };
}
