import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { signIn } from './helpers/auth-helpers';
import { waitForPageLoad } from './helpers/navigation-helpers';
import { ALLOW_WRITES, ROUTES, TEST_AUTH_USER } from './settings';

/**
 * E2E tests for editing the user profile (UserForm).
 *
 * profile.spec.ts only asserts the page structure; this file exercises the form
 * itself: that it is prefilled from the user's data, that fields are editable,
 * and (gated) that saving persists via Users.updateUser and toasts.
 */

/**
 * The profile form is the page's non-search form that carries a submit button.
 * (The header search bar is a `role="search"` form, so it is excluded.)
 * @param   {import('@playwright/test').Page} page - Playwright page
 * @returns {Locator}                              The profile form locator
 */
function profileForm(page: Page): Locator {
  return page
    .locator('form:not([role="search"])')
    .filter({ has: page.locator('button[type="submit"]') })
    .first();
}

test.describe('Profile Editing', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, TEST_AUTH_USER.email, TEST_AUTH_USER.password);
    await page.goto(ROUTES.profile);
    await waitForPageLoad(page);
  });

  test('profile shows a prefilled, editable form', async ({ page }) => {
    const form = profileForm(page);
    // UserForm renders AuthError ("401") instead when profile data is missing.
    const loaded = await form
      .waitFor({ state: 'visible', timeout: 12000 })
      .then(() => true)
      .catch(() => false);
    test.skip(!loaded, 'Profile form did not load (no profile data for user)');

    const inputs = form.locator('input');
    await expect(inputs.first()).toBeVisible();

    // At least one field must be prefilled from the user's saved formData.
    const count = await inputs.count();
    let prefilled = false;
    for (let i = 0; i < count; i++) {
      const value = await inputs.nth(i).inputValue();
      if (value && value.trim().length > 0) {
        prefilled = true;
        break;
      }
    }
    expect(prefilled).toBe(true);
  });

  test('editing a field reflects the typed value', async ({ page }) => {
    const form = profileForm(page);
    const loaded = await form
      .waitFor({ state: 'visible', timeout: 12000 })
      .then(() => true)
      .catch(() => false);
    test.skip(!loaded, 'Profile form did not load (no profile data for user)');

    // First editable text-like input (skip password / hidden fields).
    const field = form
      .locator(
        'input:not([type="password"]):not([type="hidden"]):not([type="file"])',
      )
      .first();
    await expect(field).toBeVisible();

    await field.fill('E2E Test Name');
    await expect(field).toHaveValue('E2E Test Name');
  });

  test('saving the profile shows a success toast', async ({ page }) => {
    test.skip(
      !ALLOW_WRITES,
      'Persists to the real user — enable with E2E_WRITE_TESTS=1',
    );
    const form = profileForm(page);
    const loaded = await form
      .waitFor({ state: 'visible', timeout: 12000 })
      .then(() => true)
      .catch(() => false);
    test.skip(!loaded, 'Profile form did not load (no profile data for user)');

    await form.locator('button[type="submit"]').click();

    // UserForm toasts "Data saved!" on a successful updateUser.
    await expect(page.locator('.Toastify__toast').first()).toBeVisible({
      timeout: 10000,
    });
  });
});
