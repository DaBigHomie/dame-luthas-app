/**
 * Layer 2 — Route health (HTTP 200, H1, no console errors on critical routes).
 * @tags @critical
 */
import { expect, test } from "@playwright/test";

import { collectConsoleErrors, waitForPageLoad } from "./fixtures/helpers";
import { getCriticalRoutes, getPublicRoutes, loadRouteManifest } from "./fixtures/routes";

const routes = loadRouteManifest();
const publicRoutes = getPublicRoutes(routes);
const criticalRoutes = getCriticalRoutes(routes);

test.describe("Critical routes — HTTP 200", { tag: "@critical" }, () => {
  for (const route of criticalRoutes) {
    test(`${route.name} (${route.path})`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBeLessThan(400);
    });
  }
});

test.describe("Critical routes — H1 when expected", { tag: "@critical" }, () => {
  for (const route of criticalRoutes.filter((r) => r.expectH1)) {
    test(`${route.name} (${route.path})`, async ({ page }) => {
      await page.goto(route.path);
      await waitForPageLoad(page);
      await expect(page.locator("h1").first()).toBeVisible();
    });
  }
});

test.describe("Public routes — no console errors", { tag: "@critical" }, () => {
  for (const route of publicRoutes.filter((r) => r.tags.includes("@critical"))) {
    test(`${route.path}`, async ({ page }) => {
      const getErrors = collectConsoleErrors(page);
      await page.goto(route.path);
      await waitForPageLoad(page);
      expect(getErrors()).toHaveLength(0);
    });
  }
});

test.describe("PF redirect → portfolio", { tag: "@critical" }, () => {
  test("/pf/united-nations-cloud-migration-fobos redirects", async ({ page }) => {
    await page.goto("/pf/united-nations-cloud-migration-fobos");
    await waitForPageLoad(page);
    expect(page.url()).toContain("/portfolio/united-nations-cloud-migration-fobos");
  });
});
