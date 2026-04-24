import { chromium, test } from "@playwright/test";

test("xxx ", async ({ page, request }) => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page2 = await context.newPage();
  page2.locator(".");

  await page.goto("1");

  const re = request.post("", {
    data: {},
    headers: { AuthToken: "xxx" },
  });
});
