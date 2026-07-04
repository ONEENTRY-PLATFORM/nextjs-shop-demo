import { expect, type Page, test } from '@playwright/test';

import { waitForPageLoad } from './helpers/navigation-helpers';
import { ROUTES } from './settings';

/**
 * E2E tests for the CMS-driven Book Online page (and, optionally, Delivery).
 * These are generic content pages served by the `app/[lang]/[page]` catch-all,
 * which maps the CMS `pageUrl` marker to a component that renders an <h1> (CMS
 * title, with a hard-coded fallback) plus body content parsed from htmlContent.
 * When the marker is not configured in the admin the route calls notFound(), so
 * each test tolerates the 404 UI via test.skip.
 *
 * Runs against live CMS data with no mocks. The page body streams in as RSC
 * flight data after the shell, so it is asserted with an auto-retrying
 * toBeVisible rather than an instant check.
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

test.describe('Book Online Page', () => {
  test('book_online page loads with a heading, body content and the site header', async ({
    page,
  }) => {
    await page.goto(ROUTES.bookOnline);
    await waitForPageLoad(page);

    // Wait for the streamed content to settle — both the real page and the 404
    // UI render an <h1>, so this is a stable "content arrived" signal.
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 15000 });

    test.skip(await isNotFoundUI(page), 'book_online marker not configured');

    // Real content page: header present and a non-empty heading.
    await expect(page.locator('header').first()).toBeVisible({
      timeout: 15000,
    });
    await expect(heading).not.toHaveText(/^\s*$/);

    // Some body content: the component wraps the <h1> together with the CMS body
    // (or a fallback paragraph), so the heading's parent block has more text than
    // the heading alone.
    const contentBlock = heading.locator('xpath=..');
    const headingText = ((await heading.textContent()) ?? '').trim();
    const blockText = (await contentBlock.innerText()).trim();
    expect(blockText.length).toBeGreaterThan(headingText.length);
  });

  test('delivery page loads with a heading', async ({ page }) => {
    await page.goto(ROUTES.delivery);
    await waitForPageLoad(page);

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 15000 });

    test.skip(await isNotFoundUI(page), 'delivery marker not configured');

    await expect(heading).not.toHaveText(/^\s*$/);
  });
});
