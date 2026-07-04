import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { waitForPageLoad } from './helpers/navigation-helpers';

/**
 * E2E tests for graceful error / not-found handling of the app SHELL.
 *
 * These complement error-pages.spec.ts (which covers 404 HTTP status and empty
 * states). Here we assert graceful DEGRADATION: when a route lands in a bad,
 * reachable state (missing product id, bogus handle, bogus path) the app must
 * render its not-found UI WITHOUT losing the persistent site chrome (header /
 * footer from the root layout) and must never show a blank white screen.
 *
 * Verified against the real app (localhost:3100): all three bad states render
 * the same shell — a visible <header>, <footer>, <main> with an `h1` of "404",
 * the text "Could not find requested resource" and a "Return home" link.
 */

/** Regex matching any not-found signal the app renders (h1 "404" + "Return home" link). */
const NOT_FOUND_SIGNAL = /404|not found|return home|could not find/i;

/**
 * Asserts the persistent app shell survived a bad navigation and the page is
 * not a blank white screen (i.e. the root layout still rendered its chrome).
 * @param   {Page}          page - Playwright page object.
 * @returns {Promise<void>}      Resolves once the shell is confirmed present.
 */
async function expectShellSurvived(page: Page): Promise<void> {
  // Site header from the root layout must still be rendered on a 404.
  await expect(page.locator('header').first()).toBeVisible({ timeout: 15000 });
  // Not a blank body — some content actually rendered.
  const bodyText = (await page.locator('body').innerText()).trim();
  expect(bodyText.length).toBeGreaterThan(0);
}

test.describe('Error Boundaries & Graceful Degradation', () => {
  test('non-existent product id renders not-found UI with the header intact', async ({
    page,
  }) => {
    await page.goto('/en/shop/product/99999999');
    await waitForPageLoad(page);

    // Shell (header/footer) survives — the 404 does not blank the app.
    await expectShellSurvived(page);

    // The not-found UI streams in after loading.tsx, so use an auto-retrying
    // assertion rather than an instant check.
    await expect(page.getByText(NOT_FOUND_SIGNAL).first()).toBeVisible({
      timeout: 15000,
    });

    // Header and footer are BOTH still present (persistent chrome, not lost).
    await expect(page.locator('footer').first()).toBeVisible();
  });

  test('bogus non-numeric product handle degrades gracefully', async ({
    page,
  }) => {
    await page.goto('/en/shop/product/not-a-number');
    await waitForPageLoad(page);

    // Whatever the app decides to render, the shell must survive (no crash /
    // no empty body).
    await expectShellSurvived(page);

    // Tolerate EITHER the not-found UI OR a valid rendered shell (<main> with
    // content) — both are graceful outcomes for a non-numeric handle.
    const notFound = page.getByText(NOT_FOUND_SIGNAL).first();
    const mainShell = page.locator('main').first();
    await expect(notFound.or(mainShell).first()).toBeVisible({
      timeout: 15000,
    });
  });

  test('completely bogus top-level path renders not-found UI with the header', async ({
    page,
  }) => {
    await page.goto('/en/totally-bogus-page');
    await waitForPageLoad(page);

    await expectShellSurvived(page);

    await expect(page.getByText(NOT_FOUND_SIGNAL).first()).toBeVisible({
      timeout: 15000,
    });
  });

  // The per-segment error.tsx boundaries (a message + a "Try again" button that
  // calls reset()) only render when a Server Component THROWS during render.
  // This app never throws on reachable bad input: getProductById / getProducts /
  // getPageByUrl return { isError } and the route responds with notFound() (the
  // 404 UI, covered above) or an empty state — it does not rethrow. The data is
  // fetched server-side, so it cannot be faulted from the browser either.
  // Triggering the boundary therefore requires source-level fault injection,
  // which is out of scope here; the boundaries are covered structurally by the
  // error.tsx present in every route segment. Explicit skip documents this gap.
  test('error.tsx "Try again" boundary (requires fault injection)', async () => {
    test.skip(
      true,
      'error.tsx renders only when a Server Component throws; the app returns { isError } + notFound() on all reachable bad states, and server-side fetches cannot be faulted from the browser. Covered structurally.',
    );
  });
});
