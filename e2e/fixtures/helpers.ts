import type { Page } from "@playwright/test";

import { isIgnoredError } from "./test-data";

export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await Promise.race([
    page.waitForLoadState("networkidle"),
    page.waitForTimeout(8_000),
  ]);
}

export function collectConsoleErrors(page: Page): () => string[] {
  const errors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error" && !isIgnoredError(msg.text())) {
      errors.push(msg.text());
    }
  });

  page.on("pageerror", (error) => {
    errors.push(`[PageError] ${error.message}`);
  });

  return () => [...errors];
}

export function collectNetworkFailures(
  page: Page,
  domains = ["localhost", "127.0.0.1"],
): () => Array<{ url: string; status: number }> {
  const failures: Array<{ url: string; status: number }> = [];

  page.on("response", (response) => {
    const url = response.url();
    if (
      response.status() >= 400 &&
      domains.some((d) => url.includes(d)) &&
      !url.includes("/favicon")
    ) {
      failures.push({ url, status: response.status() });
    }
  });

  return () => [...failures];
}
