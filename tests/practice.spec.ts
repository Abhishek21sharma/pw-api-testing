import { chromium, test } from "@playwright/test";

test("xxx ", async ({ page }) => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page2 = await context.newPage();
  page2.locator(".");
});
