/**
 * Layer 2 — Header navigation across viewports.
 * @tags @critical
 */
import { expect, test } from "@playwright/test";

import { waitForPageLoad } from "./fixtures/helpers";

const NAV_LABELS = ["Home", "Case Studies", "About", "Contact"];

test.describe("Navigation — desktop", { tag: "@critical" }, () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("Primary nav links visible", async ({ page }) => {
    await page.goto("/");
    await waitForPageLoad(page);

    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav).toBeVisible();

    for (const label of NAV_LABELS) {
      await expect(nav.getByRole("link", { name: label })).toBeVisible();
    }
  });

  test("Case Studies nav navigates", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", {
      name: "Case Studies",
    }).click();
    await waitForPageLoad(page);
    await expect(page).toHaveURL(/\/case-studies/);
    await expect(page.locator("h1")).toContainText(/Case Studies/i);
  });
});

test.describe("Navigation — mobile", { tag: "@critical" }, () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("Menu button opens mobile nav", async ({ page }) => {
    await page.goto("/");
    await waitForPageLoad(page);

    await page.getByRole("button", { name: "Menu" }).click();
    const mobileNav = page.getByRole("navigation", { name: "Primary mobile" });
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Contact" })).toBeVisible();
  });
});
