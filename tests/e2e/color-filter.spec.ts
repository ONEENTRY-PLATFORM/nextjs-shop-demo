import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { waitForPageLoad } from './helpers/navigation-helpers';
import { ROUTES, SELECTORS } from './settings';

/**
 * E2E tests for the color filter on the shop listing page.
 *
 * Color options come from a CMS `color` attribute list and MAY be absent in a
 * given project — the "apply" test tolerates that by skipping when no swatch
 * buttons render (LIVE CMS data, no mocks).
 */
test.describe('Color Filter', () => {
  test.setTimeout(30000);

  /**
   * Locator for the color swatch buttons inside the filter modal.
   * Each color option renders as a <button> containing an inline-styled swatch
   * <div> plus a <span> label — the Apply/Reset buttons have neither, so this
   * filter isolates the color options only.
   * @param   {Page}    page - Playwright page object
   * @returns {Locator}      Locator matching every color swatch button
   */
  function colorSwatches(page: Page): Locator {
    return page
      .locator(`${SELECTORS.filterModal} button`)
      .filter({ has: page.locator('div[style*="background-color"]') });
  }

  /**
   * Opens the filter modal from the shop listing page.
   * @param   {Page}             page - Playwright page object
   * @returns {Promise<Locator>}      The visible filter modal locator
   */
  async function openFilterModal(page: Page): Promise<Locator> {
    const filterBtn = page.locator(SELECTORS.filterButton);
    await expect(filterBtn).toBeVisible({ timeout: 10000 });
    await filterBtn.click();
    const modal = page.locator(SELECTORS.filterModal);
    await expect(modal).toBeVisible({ timeout: 8000 });
    return modal;
  }

  test('applying a color adds a color= URL param', async ({ page }) => {
    await page.goto(ROUTES.shop);
    await waitForPageLoad(page);

    await openFilterModal(page);

    // The color list renders inside a Suspense boundary — wait briefly for the
    // first swatch, then bail out cleanly if this project has no colors set up.
    const swatches = colorSwatches(page);
    const hasColors = await swatches
      .first()
      .waitFor({ state: 'visible', timeout: 8000 })
      .then(() => true)
      .catch(() => false);
    test.skip(!hasColors, 'no color options configured in CMS');

    // Selection is local until Apply writes it to the `color` URL param.
    await swatches.first().click();
    await page.locator(SELECTORS.filterApplyButton).click();

    // Apply closes the modal and replaces the URL.
    await expect(page.locator(SELECTORS.filterModal)).toBeHidden({
      timeout: 5000,
    });
    await expect(page).toHaveURL(/[?&]color=/, { timeout: 5000 });
  });

  test('reset clears the color param', async ({ page }) => {
    // Arrive with a color already applied so Reset has something to remove.
    // The reset flow deletes the param regardless of which colors exist in the
    // CMS, so this case stays valid even without configured color options.
    await page.goto(`${ROUTES.shop}?color=red`);
    await waitForPageLoad(page);

    await openFilterModal(page);

    await page.locator(SELECTORS.filterResetButton).click();

    // router.replace() lands after the modal closes — auto-retry the assertion.
    await expect(page).not.toHaveURL(/[?&]color=/, { timeout: 8000 });
  });
});
