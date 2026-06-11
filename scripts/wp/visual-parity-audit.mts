#!/usr/bin/env npx tsx
/**
 * Browser visual parity audit: Next.js vs WordPress reference.
 *
 *   npm run wp:visual-parity-audit
 *   NEXT_PARITY_URL=http://localhost:3000/ WP_PARITY_URL=http://dameluthas.local/ npm run wp:visual-parity-audit
 *
 * Writes:
 *   data/extracted/visual-parity-report.json
 *   reports/visual-parity-latest.md
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "playwright";
import { chromium } from "playwright";

import { REPO_ROOT } from "./config";
import {
  EXPECTED_BODY_BG,
  EXPECTED_HERO_TRANSFORM,
  EXPECTED_HERO_WEIGHT,
  HERO_BREAKPOINTS,
  PARITY_URLS,
  SECTION_MARKERS,
  type CheckResult,
  type ParityReport,
  type SiteAudit,
  summarize,
} from "./lib/parity-checks";

const JSON_OUT = join(REPO_ROOT, "data/extracted/visual-parity-report.json");
const MD_OUT = join(REPO_ROOT, "reports/visual-parity-latest.md");

interface HeroMetrics {
  fontSizePx: number | null;
  fontWeight: string | null;
  textTransform: string | null;
  fontFamily: string | null;
  opacity: number | null;
  hasAnimatedClass: boolean;
  className: string;
}

interface PageSnapshot {
  bodyBg: string;
  bodyFont: string;
  motionReady: boolean;
  hero: HeroMetrics | null;
  sectionIndices: Array<{
    id: string;
    label: string;
    found: boolean;
    index: number;
    top: number | null;
  }>;
}

async function collectSnapshot(page: Page, url: string): Promise<PageSnapshot> {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });

  // Scroll to trigger in-view animations on Next
  await page.evaluate(async () => {
    const step = Math.max(200, window.innerHeight * 0.6);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });

  await page.waitForTimeout(600);

  return page.evaluate((markers) => {
    const bodyCs = getComputedStyle(document.body);
    const bodyText = (document.body.textContent ?? "").toLowerCase();

    const heroEl =
      document.querySelector("main h1.thegem-heading") ??
      document.querySelector("main h1") ??
      document.querySelector("h1") ??
      null;

    let hero: PageSnapshot["hero"] = null;
    if (heroEl) {
      const cs = getComputedStyle(heroEl);
      hero = {
        fontSizePx: Number.parseFloat(cs.fontSize) || null,
        fontWeight: cs.fontWeight,
        textTransform: cs.textTransform,
        fontFamily: cs.fontFamily,
        opacity: Number.parseFloat(cs.opacity),
        hasAnimatedClass: heroEl.classList.contains("thegem-heading-animated"),
        className: heroEl.className,
      };
    }

    const sectionIndices = markers.map(function (m) {
      let top: number | null = null;
      const selectors = m.selectors || [];
      for (let i = 0; i < selectors.length; i++) {
        const el = document.querySelector(selectors[i]);
        if (el) {
          top = el.getBoundingClientRect().top + window.scrollY;
          break;
        }
      }
      if (top == null) {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
        );
        let node = walker.nextNode();
        while (node) {
          const chunk = (node.textContent || "").toLowerCase();
          let matched = false;
          for (let j = 0; j < m.needles.length; j++) {
            if (chunk.includes(m.needles[j].toLowerCase())) {
              matched = true;
              break;
            }
          }
          if (matched) {
            const parent = node.parentElement;
            const anchor =
              parent &&
              (parent.closest("section, main, footer, header, h1, h2, h3") ||
                parent);
            if (anchor) {
              top = anchor.getBoundingClientRect().top + window.scrollY;
              break;
            }
          }
          node = walker.nextNode();
        }
      }

      let needleHit = false;
      for (let k = 0; k < m.needles.length; k++) {
        if (bodyText.includes(m.needles[k].toLowerCase())) {
          needleHit = true;
          break;
        }
      }

      let index = -1;
      for (let n = 0; n < m.needles.length; n++) {
        const i = bodyText.indexOf(m.needles[n].toLowerCase());
        if (i >= 0 && (index < 0 || i < index)) index = i;
      }

      return {
        id: m.id,
        label: m.label,
        found: needleHit || top != null,
        index,
        top,
      };
    });

    return {
      bodyBg: bodyCs.backgroundColor,
      bodyFont: bodyCs.fontFamily,
      motionReady: document.documentElement.classList.contains("thegem-motion-ready"),
      hero,
      sectionIndices,
    };
  }, SECTION_MARKERS);
}

async function collectHeroAtWidth(
  page: Page,
  url: string,
  width: number,
): Promise<HeroMetrics | null> {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  const snap = await collectSnapshot(page, url);
  return snap.hero;
}

function checkTheme(snapshot: PageSnapshot, siteLabel: string): CheckResult[] {
  const checks: CheckResult[] = [];

  checks.push({
    id: `${siteLabel}-body-bg`,
    label: "Body background rgb(15,15,15)",
    status: snapshot.bodyBg === EXPECTED_BODY_BG ? "pass" : "fail",
    expected: EXPECTED_BODY_BG,
    actual: snapshot.bodyBg,
  });

  const outfit = snapshot.bodyFont.toLowerCase().includes("outfit");
  checks.push({
    id: `${siteLabel}-body-font`,
    label: "Body font resolves to Outfit",
    status: outfit ? "pass" : "fail",
    expected: "Outfit",
    actual: snapshot.bodyFont.split(",")[0]?.replace(/['"]/g, "").trim(),
  });

  return checks;
}

function checkHeroTypography(
  hero: HeroMetrics | null,
  siteLabel: string,
  width: number,
  expectedPx: number,
  tolerancePx: number,
): CheckResult[] {
  if (!hero) {
    return [
      {
        id: `${siteLabel}-hero-h1-${width}`,
        label: `Hero H1 @ ${width}px`,
        status: "fail",
        detail: "Hero heading not found",
      },
    ];
  }

  const checks: CheckResult[] = [];
  const size = hero.fontSizePx ?? 0;
  const inRange =
    size >= expectedPx - tolerancePx && size <= expectedPx + tolerancePx;

  checks.push({
    id: `${siteLabel}-hero-size-${width}`,
    label: `Hero H1 font-size ~${expectedPx}px @ ${width}px`,
    status: inRange ? "pass" : "fail",
    expected: `${expectedPx}px (+/-${tolerancePx})`,
    actual: `${size}px`,
  });

  if (width === HERO_BREAKPOINTS[0].width) {
    checks.push({
      id: `${siteLabel}-hero-weight`,
      label: "Hero H1 font-weight 800",
      status: hero.fontWeight === EXPECTED_HERO_WEIGHT ? "pass" : "fail",
      expected: EXPECTED_HERO_WEIGHT,
      actual: hero.fontWeight ?? undefined,
    });
    checks.push({
      id: `${siteLabel}-hero-uppercase`,
      label: "Hero H1 uppercase",
      status:
        hero.textTransform?.toLowerCase() === EXPECTED_HERO_TRANSFORM
          ? "pass"
          : "fail",
      expected: EXPECTED_HERO_TRANSFORM,
      actual: hero.textTransform ?? undefined,
    });
  }

  return checks;
}

function checkSectionOrder(
  sections: PageSnapshot["sectionIndices"],
  siteLabel: string,
): CheckResult[] {
  const checks: CheckResult[] = [];
  const missing = sections.filter((s) => !s.found);

  for (const s of sections) {
    checks.push({
      id: `${siteLabel}-section-${s.id}`,
      label: `Section present: ${s.label}`,
      status: s.found ? "pass" : "fail",
      detail: s.found ? `index ${s.index}` : "not found in page text",
    });
  }

  if (missing.length === 0) {
    const tops = sections.map((s) => s.top).filter((t): t is number => t != null);
    let ordered: boolean;
    if (tops.length === sections.length) {
      ordered = true;
      let prevTop = -1;
      for (const s of sections) {
        const top = s.top as number;
        if (top < prevTop) {
          ordered = false;
          break;
        }
        prevTop = top;
      }
    } else {
      ordered = true;
      let prev = -1;
      for (const s of sections) {
        if (s.index >= 0 && s.index < prev) {
          ordered = false;
          break;
        }
        if (s.index >= 0) prev = s.index;
      }
    }
    checks.push({
      id: `${siteLabel}-section-order`,
      label: "Sections in correct DOM order",
      status: ordered ? "pass" : "fail",
      detail: ordered
        ? sections.map((s) => s.id).join(" → ")
        : "section positions out of order",
    });
  } else {
    checks.push({
      id: `${siteLabel}-section-order`,
      label: "Sections in correct DOM order",
      status: "skip",
      detail: `skipped — missing: ${missing.map((m) => m.id).join(", ")}`,
    });
  }

  return checks;
}

function checkMotion(
  snapshot: PageSnapshot,
  siteLabel: string,
  motionRequired: boolean,
): CheckResult[] {
  if (!motionRequired) {
    return [
      {
        id: `${siteLabel}-motion`,
        label: "Motion classes (reference only on WP)",
        status: "skip",
        detail: "WP reference — motion not gated",
      },
    ];
  }

  const checks: CheckResult[] = [];
  checks.push({
    id: `${siteLabel}-motion-ready`,
    label: "html.thegem-motion-ready after load",
    status: snapshot.motionReady ? "pass" : "fail",
    actual: snapshot.motionReady ? "present" : "missing",
  });

  const heroVisible =
    snapshot.hero != null && (snapshot.hero.opacity ?? 0) > 0.5;
  checks.push({
    id: `${siteLabel}-hero-opacity`,
    label: "Hero H1 opacity > 0.5 (animated in)",
    status: heroVisible ? "pass" : "fail",
    actual: snapshot.hero?.opacity?.toString(),
  });

  checks.push({
    id: `${siteLabel}-hero-animated-class`,
    label: "Hero H1 has thegem-heading-animated",
    status: snapshot.hero?.hasAnimatedClass ? "pass" : "fail",
    actual: snapshot.hero?.hasAnimatedClass ? "present" : "missing",
    detail: snapshot.hero?.className,
  });

  return checks;
}

async function auditSite(
  page: Page,
  url: string,
  label: "next" | "wp",
): Promise<SiteAudit> {
  const checks: CheckResult[] = [];
  const heroByBreakpoint: SiteAudit["heroByBreakpoint"] = [];

  try {
    let snapshot = await collectSnapshot(page, url);
    checks.push(...checkTheme(snapshot, label));
    checks.push(...checkSectionOrder(snapshot.sectionIndices, label));
    checks.push(...checkMotion(snapshot, label, label === "next"));

    for (const bp of HERO_BREAKPOINTS) {
      const hero = await collectHeroAtWidth(page, url, bp.width);
      heroByBreakpoint.push({
        width: bp.width,
        fontSizePx: hero?.fontSizePx ?? null,
        fontWeight: hero?.fontWeight ?? null,
        textTransform: hero?.textTransform ?? null,
      });
      checks.push(
        ...checkHeroTypography(
          hero,
          label,
          bp.width,
          bp.expectedPx,
          bp.tolerancePx,
        ),
      );
    }

    // Re-collect at desktop for motion after breakpoint passes
    await page.setViewportSize({ width: 1800, height: 1000 });
    snapshot = await collectSnapshot(page, url);
    if (label === "next") {
      const motionChecks = checkMotion(snapshot, label, true);
      for (const mc of motionChecks) {
        const idx = checks.findIndex((c) => c.id === mc.id);
        if (idx >= 0) checks[idx] = mc;
        else checks.push(mc);
      }
    }

    return {
      url,
      reachable: true,
      checks,
      heroByBreakpoint,
      sectionOrder: snapshot.sectionIndices,
    };
  } catch (error) {
    return {
      url,
      reachable: false,
      error: error instanceof Error ? error.message : String(error),
      checks: [
        {
          id: `${label}-reachable`,
          label: "Site reachable",
          status: "fail",
          detail: error instanceof Error ? error.message : String(error),
        },
      ],
      heroByBreakpoint: [],
      sectionOrder: [],
    };
  }
}

function compareSites(next: SiteAudit, wp: SiteAudit): CheckResult[] {
  const comparisons: CheckResult[] = [];

  if (!next.reachable || !wp.reachable) {
    return comparisons;
  }

  for (const bp of HERO_BREAKPOINTS) {
    const n = next.heroByBreakpoint.find((h) => h.width === bp.width);
    const w = wp.heroByBreakpoint.find((h) => h.width === bp.width);
    if (n?.fontSizePx != null && w?.fontSizePx != null) {
      const delta = Math.abs(n.fontSizePx - w.fontSizePx);
      comparisons.push({
        id: `compare-hero-size-${bp.width}`,
        label: `Hero H1 size delta @ ${bp.width}px (Next vs WP)`,
        status: delta <= bp.tolerancePx ? "pass" : "warn",
        expected: `within ${bp.tolerancePx}px`,
        actual: `${delta.toFixed(1)}px (Next ${n.fontSizePx}px, WP ${w.fontSizePx}px)`,
      });
    }
  }

  const nextOrder = next.sectionOrder.filter((s) => s.found).map((s) => s.id);
  const wpOrder = wp.sectionOrder.filter((s) => s.found).map((s) => s.id);
  const sameSequence =
    nextOrder.length === wpOrder.length &&
    nextOrder.every((id, i) => id === wpOrder[i]);

  comparisons.push({
    id: "compare-section-sequence",
    label: "Section sequence matches WP reference",
    status: sameSequence ? "pass" : "warn",
    expected: wpOrder.join(" → "),
    actual: nextOrder.join(" → "),
  });

  return comparisons;
}

function renderMarkdown(report: ParityReport): string {
  const lines: string[] = [
    "# Visual parity audit",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `| Result | Count |`,
    `|--------|------:|`,
    `| pass | ${report.summary.pass} |`,
    `| fail | ${report.summary.fail} |`,
    `| warn | ${report.summary.warn} |`,
    `| skip | ${report.summary.skip} |`,
    "",
    "## Next.js (`" + report.next.url + "`)",
    "",
    "| Check | Status | Expected | Actual |",
    "|-------|--------|----------|--------|",
  ];

  for (const c of report.next.checks) {
    lines.push(
      `| ${c.label} | ${c.status.toUpperCase()} | ${c.expected ?? ""} | ${c.actual ?? c.detail ?? ""} |`,
    );
  }

  lines.push("", "## WordPress reference (`" + report.wp.url + "`)", "", "| Check | Status |", "|-------|--------|");
  for (const c of report.wp.checks) {
    lines.push(`| ${c.label} | ${c.status.toUpperCase()} |`);
  }

  if (report.comparisons.length) {
    lines.push("", "## Next vs WP", "", "| Comparison | Status | Detail |", "|------------|--------|--------|");
    for (const c of report.comparisons) {
      lines.push(`| ${c.label} | ${c.status.toUpperCase()} | ${c.actual ?? c.detail ?? ""} |`);
    }
  }

  lines.push("");
  return lines.join("\n");
}

function printConsole(report: ParityReport): void {
  console.log("\n=== Visual parity audit ===\n");
  console.log(`Next: ${report.next.url}`);
  console.log(`WP:   ${report.wp.url}\n`);

  const nextFails = report.next.checks.filter((c) => c.status === "fail");
  if (nextFails.length === 0) {
    console.log("NEXT CHECKLIST: ALL PASS\n");
  } else {
    console.log(`NEXT CHECKLIST: ${nextFails.length} FAIL\n`);
    for (const f of nextFails) {
      console.log(`  FAIL  ${f.label}`);
      if (f.expected) console.log(`        expected: ${f.expected}`);
      if (f.actual) console.log(`        actual:   ${f.actual}`);
      if (f.detail) console.log(`        detail:   ${f.detail}`);
    }
    console.log("");
  }

  for (const c of report.comparisons) {
    const tag = c.status.toUpperCase().padEnd(4);
    console.log(`  ${tag} ${c.label}: ${c.actual ?? c.detail ?? ""}`);
  }

  console.log(`\nJSON: ${JSON_OUT}`);
  console.log(`MD:   ${MD_OUT}\n`);
}

async function main(): Promise<void> {
  mkdirSync(join(REPO_ROOT, "data/extracted"), { recursive: true });
  mkdirSync(join(REPO_ROOT, "reports"), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const nextPage = await context.newPage();
  const wpPage = await context.newPage();

  console.log("Auditing Next.js and WordPress (Playwright)...");
  const [next, wp] = await Promise.all([
    auditSite(nextPage, PARITY_URLS.next, "next"),
    auditSite(wpPage, PARITY_URLS.wp, "wp"),
  ]);

  await browser.close();

  const comparisons = compareSites(next, wp);
  const allChecks = [...next.checks, ...wp.checks, ...comparisons];
  const report: ParityReport = {
    generatedAt: new Date().toISOString(),
    next,
    wp,
    comparisons,
    summary: summarize(allChecks),
  };

  writeFileSync(JSON_OUT, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(MD_OUT, renderMarkdown(report));
  printConsole(report);

  const nextFailCount = next.checks.filter((c) => c.status === "fail").length;
  if (nextFailCount > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
