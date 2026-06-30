#!/usr/bin/env npx tsx
/**
 * Phase 1b — Public route matrix: Next.js app (required) vs WP source (optional strict).
 *
 *   npm run verify:public-routes
 *   NEXT_URL=http://localhost:3000 npm run verify:public-routes
 *   VERIFY_WP_STRICT=1 npm run verify:public-routes
 */
import * as cheerio from "cheerio";
import { chromium } from "playwright";

const WP_BASE = (process.env.WP_AUDIT_URL ?? "http://dameluthas.local/").replace(
  /\/?$/,
  "/",
);
const NEXT_BASE = (process.env.NEXT_URL ?? "http://localhost:3000").replace(
  /\/?$/,
  "",
);
const STRICT_WP = process.env.VERIFY_WP_STRICT === "1";
const TIMEOUT_MS = Number(process.env.VERIFY_ROUTE_TIMEOUT ?? "15000");

interface RouteSpec {
  id: string;
  wpPath: string;
  nextPath: string;
  expectH1: boolean;
  wpOptional?: boolean;
}

const ROUTES: RouteSpec[] = [
  { id: "home", wpPath: "/", nextPath: "/", expectH1: false },
  { id: "contact", wpPath: "/contact/", nextPath: "/contact", expectH1: true },
  {
    id: "case-studies",
    wpPath: "/case-studies/",
    nextPath: "/case-studies",
    expectH1: true,
  },
  {
    id: "portfolio-un",
    wpPath: "/pf/united-nations-cloud-migration-fobos/",
    nextPath: "/portfolio/united-nations-cloud-migration-fobos",
    expectH1: true,
  },
  {
    id: "portfolio-amazon",
    wpPath: "/pf/amazon-labor-union-digital-transformation/",
    nextPath: "/portfolio/amazon-labor-union-digital-transformation",
    expectH1: true,
    wpOptional: true,
  },
  {
    id: "portfolio-gatorade",
    wpPath: "/pf/gatorade-embraces-generative-ai-powered-bottle-design/",
    nextPath: "/portfolio/gatorade-embraces-generative-ai-powered-bottle-design",
    expectH1: true,
  },
  {
    id: "portfolio-redirect",
    wpPath: "/case-studies/",
    nextPath: "/portfolio",
    expectH1: true,
  },
  {
    id: "pf-redirect",
    wpPath: "/pf/united-nations-cloud-migration-fobos/",
    nextPath: "/pf/united-nations-cloud-migration-fobos",
    expectH1: true,
    wpOptional: true,
  },
];

async function fetchNextRoute(path: string): Promise<{
  status: number;
  h1: string;
  finalUrl: string;
  error?: string;
}> {
  const url = `${NEXT_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const html = await response.text();
    const h1 =
      cheerio.load(html)("h1").first().text().trim().replace(/\s+/g, " ") ?? "";
    return {
      status: response.status,
      h1,
      finalUrl: response.url,
    };
  } catch (error) {
    return {
      status: 0,
      h1: "",
      finalUrl: url,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function fetchWpStatus(path: string): Promise<{ status: number; error?: string }> {
  const url = `${WP_BASE.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: TIMEOUT_MS,
    });
    return { status: response?.status() ?? 0 };
  } catch (error) {
    return {
      status: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    await browser.close();
  }
}

async function main(): Promise<void> {
  console.log(`Next base: ${NEXT_BASE}`);
  console.log(`WP base:   ${WP_BASE} (${STRICT_WP ? "strict" : "informational"})\n`);

  let failures = 0;

  for (const route of ROUTES) {
    const next = await fetchNextRoute(route.nextPath);
    const issues: string[] = [];

    if (next.status < 200 || next.status >= 400) {
      issues.push(`Next HTTP ${next.status}${next.error ? `: ${next.error}` : ""}`);
    }
    if (route.expectH1 && !next.h1) {
      issues.push("Next missing H1");
    }
    if (route.id === "portfolio-redirect" && !next.finalUrl.includes("/case-studies")) {
      issues.push(`Expected redirect to /case-studies, got ${next.finalUrl}`);
    }
    if (route.id === "pf-redirect" && !next.finalUrl.includes("/portfolio/")) {
      issues.push(`Expected redirect to /portfolio/, got ${next.finalUrl}`);
    }

    if (STRICT_WP && !route.wpOptional) {
      const wp = await fetchWpStatus(route.wpPath);
      if (wp.status < 200 || wp.status >= 400) {
        issues.push(`WP HTTP ${wp.status}${wp.error ? `: ${wp.error}` : ""}`);
      }
    }

    const ok = issues.length === 0;
    if (!ok) failures += 1;

    console.log(
      `${ok ? "PASS" : "FAIL"} ${route.id.padEnd(18)} Next ${next.status} h1="${next.h1.slice(0, 50)}"`,
    );
    for (const issue of issues) console.log(`       ↳ ${issue}`);
  }

  console.log(`\n${ROUTES.length - failures}/${ROUTES.length} Next routes passed.`);

  if (failures) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
