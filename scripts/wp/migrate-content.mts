#!/usr/bin/env npx tsx
/**
 * Migrate snapshot → curated content bundle for native Next.js pages.
 *
 * Usage: npx tsx scripts/wp/migrate-content.mts
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  excerptFromHtml,
  htmlToPlainText,
  sanitizeWpHtml,
} from "./lib/sanitize-html";
import {
  parseAddressFromHtml,
  parseTeamFromHtml,
} from "./lib/parse-team-from-html";
import { parseHero } from "./lib/parsers/parse-hero";
import * as cheerio from "cheerio";

interface SnapshotItem {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  postType: string;
  featuredImageUrl?: string | null;
}

interface Snapshot {
  site: { title: string; url: string };
  pages: SnapshotItem[];
  portfolio: SnapshotItem[];
}

const SKIP_PAGE_SLUGS = new Set([
  "shop",
  "cart",
  "checkout",
  "my-account",
  "jobs",
  "job-dashboard",
  "post-a-job",
]);

function rewriteMedia(url: string | null | undefined): string | null {
  if (!url) return null;
  return url
    .replace(/https?:\/\/dameluthas\.local\/wp-content\/uploads\//, "/api/wp-media/")
    .replace(/https?:\/\/dameluthas-com-restore\.local\/wp-content\/uploads\//, "/api/wp-media/")
    .replace(/\/wp-content\/uploads\//, "/api/wp-media/");
}

function mapPortfolio(item: SnapshotItem) {
  const clean = sanitizeWpHtml(item.content);
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt || excerptFromHtml(item.content),
    bodyHtml: clean.length > 500 ? clean : "",
    bodyText: htmlToPlainText(item.content),
    image: rewriteMedia(item.featuredImageUrl),
    href: `/portfolio/${item.slug}`,
  };
}

interface ExtractedItem {
  databaseId: number;
  title: string;
  slug: string;
  content?: string | null;
  builderContent?: string | null;
  excerpt: string;
  uri?: string | null;
  featuredImage?: { node?: { sourceUrl?: string } } | null;
}

function resolveExtractedHtml(item: ExtractedItem): string {
  const raw = item.builderContent ?? item.content ?? "";
  return typeof raw === "string" ? raw : "";
}

function loadExtractedJson<T>(name: string): T | null {
  const path = join(process.cwd(), "data/extracted", name);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function loadExtractedPages(): SnapshotItem[] | null {
  const items = loadExtractedJson<ExtractedItem[]>("pages.json");
  if (!items) return null;

  return items.map((item) => ({
    id: item.databaseId,
    slug: item.slug,
    title: item.title,
    content: resolveExtractedHtml(item),
    excerpt: item.excerpt?.replace(/<[^>]+>/g, "").trim() ?? "",
    postType: "page",
    featuredImageUrl: item.featuredImage?.node?.sourceUrl ?? null,
  }));
}

function loadExtractedPortfolio(): SnapshotItem[] | null {
  const items = loadExtractedJson<ExtractedItem[]>("portfolio.json");
  if (!items?.length) return null;

  return items.map((item) => ({
    id: item.databaseId,
    slug: item.slug,
    title: item.title,
    content: resolveExtractedHtml(item),
    excerpt: item.excerpt?.replace(/<[^>]+>/g, "").trim() ?? "",
    postType: "thegem_pf_item",
    featuredImageUrl: item.featuredImage?.node?.sourceUrl ?? null,
  }));
}

function loadExtractedTemplates(): SnapshotItem[] {
  const merged: SnapshotItem[] = [];
  for (const file of ["templates.json", "titles.json", "footers.json"] as const) {
    const items = loadExtractedJson<ExtractedItem[]>(file);
    if (!items?.length) continue;
    merged.push(
      ...items.map((item) => ({
        id: item.databaseId,
        slug: item.slug,
        title: item.title,
        content: resolveExtractedHtml(item),
        excerpt: item.excerpt?.replace(/<[^>]+>/g, "").trim() ?? "",
        postType: file.replace(".json", ""),
        featuredImageUrl: item.featuredImage?.node?.sourceUrl ?? null,
      })),
    );
  }
  return merged;
}

function mapTemplate(item: SnapshotItem): {
  id: number;
  slug: string;
  title: string;
  postType: string;
  bodyHtml: string;
} {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    postType: item.postType,
    bodyHtml: sanitizeWpHtml(item.content),
  };
}

function buildAboutPage(
  about: SnapshotItem | undefined,
  contact: SnapshotItem | undefined,
  templates: SnapshotItem[],
  siteDescription: string,
): {
  title: string;
  headline: string;
  role: string;
  bio: string;
  image: string | null;
  address: { line1: string; line2: string } | null;
  bodyHtml: string;
} {
  const contactHtml = contact ? sanitizeWpHtml(contact.content) : "";
  const team = parseTeamFromHtml(contactHtml);
  const templateHtml = templates
    .map((item) => sanitizeWpHtml(item.content))
    .join("\n");
  const address =
    parseAddressFromHtml(templateHtml) ||
    parseAddressFromHtml(contactHtml) ||
    parseAddressFromHtml(sanitizeWpHtml(about?.content ?? ""));

  const bio =
    team.bio ||
    siteDescription ||
    "I partner with organizations to solve complex technology challenges and build digital products that drive measurable growth.";

  return {
    title: about?.title ?? "About",
    headline: team.name,
    role: "Consultant",
    bio,
    image: rewriteMedia(
      team.image ?? "/api/wp-media/2025/04/IMG_0666-2-2500px-768x1024.webp",
    ),
    address,
    bodyHtml: sanitizeWpHtml(about?.content ?? ""),
  };
}

function loadSnapshot(): Snapshot | null {
  const snapshotPath = join(process.cwd(), "data/snapshot/snapshot.json");
  if (!existsSync(snapshotPath)) return null;
  return JSON.parse(readFileSync(snapshotPath, "utf8")) as Snapshot;
}

function main(): void {
  const extractedPages = loadExtractedPages();
  const extractedPortfolio = loadExtractedPortfolio();
  const extractedTemplates = loadExtractedTemplates();
  const snapshot = loadSnapshot();

  const sourcePages = extractedPages ?? snapshot?.pages ?? [];
  if (!sourcePages.length) {
    throw new Error("No page source found — run wp:extract-live or wp:snapshot first");
  }

  const home = sourcePages.find((p) => p.slug === "home");
  const contact = sourcePages.find((p) => p.slug === "contact");
  const about = sourcePages.find((p) => p.slug === "about");

  const pages = sourcePages
    .filter((p) => !SKIP_PAGE_SLUGS.has(p.slug))
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt || excerptFromHtml(p.content, 160),
      bodyHtml: sanitizeWpHtml(p.content),
      href: p.slug === "home" ? "/" : `/${p.slug}`,
    }));

  const portfolioSource = extractedPortfolio ?? snapshot?.portfolio ?? [];
  const portfolio = portfolioSource.map(mapPortfolio);
  const templates = extractedTemplates.map(mapTemplate);
  const siteDescription =
    "I partner with organizations to solve complex technology challenges and build digital products that drive measurable growth.";
  const pageSource = extractedPages ? "graphql" : "snapshot";
  const portfolioSourceLabel = extractedPortfolio
    ? "graphql"
    : snapshot?.portfolio?.length
      ? "snapshot"
      : "none";

  const migrated = {
    migratedAt: new Date().toISOString(),
    site: {
      name: "Dame Luthas",
      tagline: home
        ? excerptFromHtml(home.content, 80).split(".")[0] ||
          "Lets Build Together."
        : "Technology consulting & digital transformation",
      description: siteDescription,
      contact: {
        phone: "+1 (646) 926-0213",
        email: "dameluthas@gmail.com",
        linkedin: "https://www.linkedin.com/in/dameluthas",
      },
    },
    navigation: [
      { label: "Home", href: "/" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    pages,
    portfolio,
    hero: (() => {
      const parsed =
        home?.content != null
          ? parseHero(cheerio.load(sanitizeWpHtml(home.content)))
          : null;
      return {
        eyebrow: "",
        title: parsed?.title ?? "Hi, I'm Dame Luthas. Lets Build Together.",
        subtitle:
          parsed?.subtitle ??
          "I partner with organizations to solve complex technology challenges and build digital products that drive measurable growth.",
        ctaPrimary: parsed?.ctaPrimary ?? {
          label: "Contact Me",
          href: "/contact",
        },
        ctaSecondary: { label: "Case Studies", href: "/portfolio" },
        image: rewriteMedia(
          home?.featuredImageUrl ??
            portfolio[0]?.image ??
            "/api/wp-media/2025/02/home-04.webp",
        ),
      };
    })(),
    contactPage: contact
      ? {
          title: contact.title,
          bodyHtml: sanitizeWpHtml(contact.content),
        }
      : null,
    aboutPage: buildAboutPage(about, contact, extractedTemplates, siteDescription),
    templates,
  };

  const outDir = join(process.cwd(), "data/migrated");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "content.json");
  writeFileSync(outPath, `${JSON.stringify(migrated, null, 2)}\n`, "utf8");

  console.log("✅ Migration complete");
  console.log(
    `   source:  pages=${pageSource}, portfolio=${portfolioSourceLabel}`,
  );
  console.log(`   ${outPath}`);
  console.log(`   pages: ${pages.length}`);
  console.log(`   portfolio: ${portfolio.length}`);
  console.log(`   templates: ${templates.length}`);
}

main();
