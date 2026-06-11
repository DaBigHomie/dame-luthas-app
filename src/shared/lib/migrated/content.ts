import "server-only";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export interface MigratedPortfolioItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  bodyHtml: string;
  bodyText: string;
  image: string | null;
  href: string;
}

export interface MigratedAboutPage {
  title: string;
  headline: string;
  role: string;
  bio: string;
  image: string | null;
  address: { line1: string; line2: string } | null;
  bodyHtml: string;
}

export interface MigratedTemplate {
  id: number;
  slug: string;
  title: string;
  postType: string;
  bodyHtml: string;
}

export interface MigratedContent {
  migratedAt: string;
  site: {
    name: string;
    tagline: string;
    description: string;
    contact: {
      phone: string;
      email: string;
      linkedin: string;
    };
  };
  navigation: Array<{ label: string; href: string }>;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
    image: string | null;
  };
  portfolio: MigratedPortfolioItem[];
  pages: Array<{
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    bodyHtml: string;
    href: string;
  }>;
  contactPage: { title: string; bodyHtml: string } | null;
  aboutPage: MigratedAboutPage | null;
  templates: MigratedTemplate[];
}

let cache: MigratedContent | null = null;

export function isMigratedAvailable(): boolean {
  return existsSync(
    path.join(process.cwd(), "data/migrated/content.json"),
  );
}

export function loadMigrated(): MigratedContent {
  if (cache) return cache;
  const file = path.join(process.cwd(), "data/migrated/content.json");
  cache = JSON.parse(readFileSync(file, "utf8")) as MigratedContent;
  return cache;
}

export function listPortfolio(): MigratedPortfolioItem[] {
  return loadMigrated().portfolio;
}

export function getPortfolioBySlug(
  slug: string,
): MigratedPortfolioItem | undefined {
  return loadMigrated().portfolio.find((item) => item.slug === slug);
}

export function getPortfolioNeighbors(slug: string): {
  prev: { slug: string; title: string; href: string } | null;
  next: { slug: string; title: string; href: string } | null;
} {
  const items = listPortfolio();
  const index = items.findIndex((item) => item.slug === slug);
  if (index < 0) return { prev: null, next: null };

  const toLink = (item: MigratedPortfolioItem) => ({
    slug: item.slug,
    title: item.title,
    href: item.href,
  });

  return {
    prev: index > 0 ? toLink(items[index - 1]!) : null,
    next: index < items.length - 1 ? toLink(items[index + 1]!) : null,
  };
}

export function getPageBySlug(slug: string) {
  return loadMigrated().pages.find((page) => page.slug === slug);
}
