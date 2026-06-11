/**
 * Layer 2 — Browser devtools validation (console, network, a11y basics).
 * @tags @critical
 */
import { expect, test } from "@playwright/test";

import {
  collectConsoleErrors,
  collectNetworkFailures,
  waitForPageLoad,
} from "./fixtures/helpers";
import { getCriticalRoutes, loadRouteManifest } from "./fixtures/routes";

const criticalRoutes = getCriticalRoutes(loadRouteManifest());

test.describe("Browser devtools — console clean", { tag: "@critical" }, () => {
  for (const route of criticalRoutes) {
    test(`${route.path} — no JS errors`, async ({ page }) => {
      const getErrors = collectConsoleErrors(page);
      await page.goto(route.path);
      await waitForPageLoad(page);
      expect(getErrors()).toHaveLength(0);
    });
  }
});

test.describe("Browser devtools — network", { tag: "@critical" }, () => {
  for (const route of criticalRoutes.slice(0, 5)) {
    test(`${route.path} — no same-origin 4xx/5xx`, async ({ page }) => {
      const getFailures = collectNetworkFailures(page);
      await page.goto(route.path);
      await waitForPageLoad(page);
      const failures = getFailures().filter(
        (f) => !f.url.includes("/_next/") && !f.url.includes("favicon"),
      );
      expect(failures).toHaveLength(0);
    });
  }
});

test.describe("Browser devtools — accessibility basics", { tag: "@critical" }, () => {
  test("Home — header nav landmark", async ({ page }) => {
    await page.goto("/");
    await waitForPageLoad(page);
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  });

  test("Contact — form region", async ({ page }) => {
    await page.goto("/contact");
    await waitForPageLoad(page);
    await expect(page.locator("main")).toBeVisible();
    const inputs = page.locator("input, textarea");
    expect(await inputs.count()).toBeGreaterThan(0);
  });

  test("Case studies — portfolio cards linked", async ({ page }) => {
    await page.goto("/case-studies");
    await waitForPageLoad(page);
    const links = page.locator('a[href^="/portfolio/"]');
    expect(await links.count()).toBeGreaterThanOrEqual(3);
  });
});

test.describe("Browser devtools — motion shell", { tag: "@critical" }, () => {
  test("Home — TheGem motion root hydrates", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/thegem-motion-ready/, {
      timeout: 10_000,
    });
  });
});
