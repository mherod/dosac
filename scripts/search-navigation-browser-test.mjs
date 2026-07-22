import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { chromium } from "playwright";

const baseUrl = process.env.SEARCH_TEST_BASE_URL ?? "http://127.0.0.1:3000";
const systemChrome =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({
  headless: true,
  ...(existsSync(systemChrome) && { executablePath: systemChrome }),
});

try {
  const page = await browser.newPage();

  // Make the response ordering window deterministic instead of relying on a
  // fast local server to reproduce the race by chance.
  await page.route("**/search?**", async (route) => {
    if (route.request().headers().rsc === "1") {
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
    await route.continue();
  });

  await page.goto(`${baseUrl}/search?q=malcolm`);
  await page.waitForSelector(
    '[data-search-results-state="idle"] a[href^="/caption/"]',
  );

  const firstResult = page.locator('a[href^="/caption/"]').first();
  const oldResultHref = await firstResult.getAttribute("href");
  assert.ok(oldResultHref, "The initial result must expose its frame ID");

  await page.getByLabel("Search ministerial quotes").fill("malcolm tucker");
  const resultBoundary = page.locator("[data-search-results-state]");
  await resultBoundary.waitFor({ state: "visible" });
  await page.waitForFunction(() => {
    const boundary = document.querySelector("[data-search-results-state]");
    return boundary?.getAttribute("aria-busy") === "true";
  });

  assert.equal(await resultBoundary.getAttribute("aria-busy"), "true");
  assert.equal(
    await resultBoundary.locator("div[inert]").count(),
    1,
    "Stale cards must be inert",
  );

  const staleClickActivated = await firstResult
    .click({ timeout: 250 })
    .then(() => true)
    .catch(() => false);
  assert.equal(
    staleClickActivated,
    false,
    "A click cannot activate a stale result",
  );

  await page.waitForFunction(() => {
    const boundary = document.querySelector("[data-search-results-state]");
    const query = new URL(window.location.href).searchParams.get("q");
    return (
      boundary?.getAttribute("data-search-results-state") === "idle" &&
      query === "malcolm tucker"
    );
  });

  const committedResult = page.locator('a[href^="/caption/"]').first();
  const committedHref = await committedResult.getAttribute("href");
  assert.ok(committedHref, "The committed result must expose its frame ID");
  assert.notEqual(
    committedHref,
    oldResultHref,
    "The delayed response must replace the old result set",
  );

  const committedPath = new URL(committedHref, baseUrl).pathname;
  await committedResult.click();
  await page.waitForURL((url) => url.pathname === committedPath);
  assert.equal(
    new URL(page.url()).pathname,
    committedPath,
    "The activated frame ID must equal the committed card href",
  );

  await page.goto(`${baseUrl}/series/1`);
  await page.goto(`${baseUrl}/search?q=malcolm`);
  await page.waitForSelector('[data-search-results-state="idle"]');
  await page.getByLabel("Search ministerial quotes").fill("malcolm tucker");
  await page.waitForFunction(
    () =>
      new URL(window.location.href).searchParams.get("q") === "malcolm tucker",
  );
  await page.getByLabel("Search ministerial quotes").fill("nicola");
  await page.waitForFunction(
    () => new URL(window.location.href).searchParams.get("q") === "nicola",
  );

  await page.goBack();
  assert.equal(
    new URL(page.url()).pathname,
    "/series/1",
    "Debounced typing must replace one history entry",
  );

  console.log(`Search navigation passed: ${oldResultHref} -> ${committedHref}`);
} finally {
  await browser.close();
}
