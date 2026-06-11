import { expect, test } from "@playwright/test";

test.describe("homepage parity", () => {
  test("sections, theme, and motion", async ({ page }) => {
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

    const html = page.locator("html");
    await expect(html).toHaveClass(/thegem-motion-ready/, { timeout: 10_000 });

    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe("rgb(15, 15, 15)");

    const fontFamily = await page.evaluate(() =>
      getComputedStyle(document.body).fontFamily.toLowerCase(),
    );
    expect(fontFamily).toContain("outfit");

    await expect(
      page.getByRole("heading", { name: "Artificial Intelligence" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Cloud Solutions" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Non Profits", exact: true }),
    ).toBeVisible();

    await expect(page.getByText("Maria Sanchez")).toBeVisible();
    await expect(page.getByText("Feedback / Our Valued Clients")).toBeVisible();

    const heroHeading = page.locator(".thegem-heading").first();
    await expect(heroHeading).toBeVisible();
    const opacity = await heroHeading.evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeGreaterThan(0);
  });
});
