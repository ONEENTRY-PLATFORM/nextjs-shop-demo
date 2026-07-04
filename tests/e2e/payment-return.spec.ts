import { expect, type Page, test } from '@playwright/test';

import { waitForPageLoad } from './helpers/navigation-helpers';
import { ROUTES } from './settings';

/**
 * E2E tests for the CMS-driven payment return pages (payment_success /
 * payment_canceled). Both are generic content pages served by the
 * `app/[lang]/[page]` catch-all, which maps the CMS `pageUrl` marker to a
 * component that renders an <h1> (CMS title, with a hard-coded fallback) plus
 * optional htmlContent. When the marker is not configured in the admin the
 * route calls notFound(), so each test tolerates the 404 UI via test.skip.
 *
 * Runs against live CMS data with no mocks. The page body (heading + content)
 * streams in as RSC flight data after the shell, so headings are asserted with
 * an auto-retrying toBeVisible rather than an instant check.
 */

/**
 * Detects whether the page is currently rendering the app's 404 / not-found UI
 * instead of real CMS content. The not-found UI (app/[lang]/not-found.tsx)
 * always renders a "Return home" link and either a literal "404" heading or the
 * CMS 404 page title, so any of those signals means the marker is unconfigured.
 * @param   {Page}             page - Playwright page object
 * @returns {Promise<boolean>}      True when the not-found UI is visible
 */
async function isNotFoundUI(page: Page): Promise<boolean> {
  const returnHome = page.getByRole('link', { name: /return home/i }).first();
  const notFoundHeading = page.getByRole('heading', { name: /^\s*404\s*$/ });
  const hasReturnHome = await returnHome.isVisible().catch(() => false);
  const hasNotFound = await notFoundHeading.isVisible().catch(() => false);
  return hasReturnHome || hasNotFound;
}

test.describe('Payment Return Pages', () => {
  test('payment_success page loads with a heading and the site header', async ({
    page,
  }) => {
    await page.goto(ROUTES.paymentSuccess);
    await waitForPageLoad(page);

    // Wait for the streamed content to settle — both the real page and the 404
    // UI render an <h1>, so this is a stable "content arrived" signal.
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 15000 });

    test.skip(
      await isNotFoundUI(page),
      'payment_success marker not configured',
    );

    // Real content page: header present and a non-empty heading.
    await expect(page.locator('header').first()).toBeVisible({
      timeout: 15000,
    });
    await expect(heading).not.toHaveText(/^\s*$/);
  });

  test('payment_canceled page loads with a heading', async ({ page }) => {
    await page.goto(ROUTES.paymentCanceled);
    await waitForPageLoad(page);

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 15000 });

    test.skip(
      await isNotFoundUI(page),
      'payment_canceled marker not configured',
    );

    await expect(heading).not.toHaveText(/^\s*$/);
  });
});
