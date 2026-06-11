import "server-only";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { HEADLESS_CONFIG } from "./config";
import type { HeadlessSnapshot, WpContentItem, WpSiteInfo } from "./types";

let cache: HeadlessSnapshot | null = null;

export function isSnapshotAvailable(): boolean {
  return existsSync(
    path.join(process.cwd(), HEADLESS_CONFIG.snapshotDir, "snapshot.json"),
  );
}

export function loadSnapshot(): HeadlessSnapshot {
  if (cache) return cache;
  const file = path.join(
    process.cwd(),
    HEADLESS_CONFIG.snapshotDir,
    "snapshot.json",
  );
  cache = JSON.parse(readFileSync(file, "utf8")) as HeadlessSnapshot;
  return cache;
}

export function getSnapshotSiteInfo(): WpSiteInfo {
  const snapshot = loadSnapshot();
  return { ...snapshot.site, mode: "snapshot" };
}

export function listSnapshotPortfolio(): WpContentItem[] {
  return loadSnapshot().portfolio;
}

export function listSnapshotPages(): WpContentItem[] {
  return loadSnapshot().pages;
}

export function listSnapshotPosts(): WpContentItem[] {
  return loadSnapshot().posts;
}

export function getSnapshotBySlug(
  slug: string,
  postType?: string,
): WpContentItem | null {
  const snapshot = loadSnapshot();
  const pools = [
    snapshot.portfolio,
    snapshot.pages,
    snapshot.posts,
  ];
  for (const pool of pools) {
    const match = pool.find(
      (item) =>
        item.slug === slug &&
        (postType ? item.postType === postType : true),
    );
    if (match) return match;
  }
  return null;
}
