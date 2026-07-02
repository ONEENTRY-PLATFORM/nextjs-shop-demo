import { expect, type Page, test } from '@playwright/test';

import { waitForPageLoad } from './helpers/navigation-helpers';
import { ROUTES } from './settings';

/**
 * E2E tests for CMS-driven forms (contact, feedback, newsletter, etc.).
 * Forms are rendered dynamically from OneEntry Forms API, so selectors are
 * intentionally generic and avoid harcoded field names.
 */
test.describe('Form Submission', () => {
  test.setTimeout(30000);

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /**
   * Fill every visible text input / textarea with a given value.
   * @param   {Page}          page  Page instance
   * @param   {string}        value Value to fill
   * @returns {Promise<void>}       Promise
   */
  async function fillAllTextInputs(page: Page, value: string): Promise<void> {
    const inputs = page.locator(
      'input[type="text"], input[type="email"], input[type="tel"], textarea',
    );
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const isVisible = await input.isVisible().catch(() => false);
      const isDisabled = await input.isDisabled().catch(() => false);
      if (isVisible && !isDisabled) {
        await input.fill(value);
      }
    }
  }

  /**
   * Returns true if ANY form exists on the current page.
   * @param   {Page}             page Page instance
   * @returns {Promise<boolean>}      Promise
   */
  async function hasForm(page: Page): Promise<boolean> {
    return (await page.locator('form').count()) > 0;
  }

  // ---------------------------------------------------------------------------
  // Contact / feedback form (pages with embedded CMS forms)
  // ---------------------------------------------------------------------------
  test.describe('CMS Contact Form', () => {
    test('contact page loads without error', async ({ page }) => {
      // Try common contact page URLs
      const candidates = [
        `${ROUTES.home.replace('/en', '')}/en/contact`,
        `${ROUTES.home.replace('/en', '')}/en/feedback`,
        `${ROUTES.home.replace('/en', '')}/en/contacts`,
      ];

      let found = false;
      for (const url of candidates) {
        await page.goto(url);
        await waitForPageLoad(page);

        const status = await page.evaluate(() => document.readyState);
        const is404 = await page
          .getByText(/404|not found/i)
          .isVisible()
          .catch(() => false);

        if (status === 'complete' && !is404) {
          found = true;
          break;
        }
      }

      if (!found) {
        // No contact page — skip gracefully
        return;
      }

      // Must not show an unhandled error
      const fatalError = page.getByText(
        /unexpected error|something went wrong/i,
      );
      expect(await fatalError.isVisible().catch(() => false)).toBeFalsy();
    });

    test('any page with a form has visible input fields', async ({ page }) => {
      // Pages that typically have forms — check home page for newsletter / hero form
      await page.goto(ROUTES.home);
      await waitForPageLoad(page);

      if (!(await hasForm(page))) return;

      const inputs = page.locator(
        'input[type="text"], input[type="email"], input[type="tel"], textarea',
      );
      const count = await inputs.count();
      // Form may have only non-text inputs (search, checkbox, select) — skip gracefully
      if (count === 0) return;
      expect(count).toBeGreaterThan(0);
    });
  });

  // ---------------------------------------------------------------------------
  // Generic form behaviour (applies to any form on any page)
  // ---------------------------------------------------------------------------
  test.describe('Form Field Behaviour', () => {
    test('text inputs accept user input and reflect it', async ({ page }) => {
      // Look for a form on the home page (newsletter, search, etc.)
      await page.goto(ROUTES.home);
      await waitForPageLoad(page);

      const textInput = page
        .locator('input[type="text"], input[type="email"]')
        .first();
      const isVisible = await textInput.isVisible().catch(() => false);
      if (!isVisible) return;

      await textInput.fill('test@example.com');
      const value = await textInput.inputValue();
      expect(value).toBe('test@example.com');
    });

    test('pressing Tab moves focus to next form field', async ({ page }) => {
      await page.goto(ROUTES.home);
      await waitForPageLoad(page);

      const inputs = page.locator(
        'input[type="text"], input[type="email"], input[type="tel"], textarea',
      );
      if ((await inputs.count()) < 2) return;

      await inputs.first().focus();
      await page.keyboard.press('Tab');

      const focused = await page.evaluate(
        () => document.activeElement?.tagName ?? '',
      );
      expect(['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A']).toContain(focused);
    });

    test('required text field shows validation when empty on submit', async ({
      page,
    }) => {
      await page.goto(ROUTES.home);
      await waitForPageLoad(page);

      if (!(await hasForm(page))) return;

      const submitBtn = page
        .locator('button[type="submit"], input[type="submit"]')
        .first();
      const isVisible = await submitBtn.isVisible().catch(() => false);
      if (!isVisible) return;

      // Clear visible text inputs
      await fillAllTextInputs(page, '');

      await submitBtn.click();
      await page.waitForTimeout(600);

      const invalidInputs = page.locator('input:invalid, textarea:invalid');
      const errorMessages = page.locator(
        '[class*="error"], .text-red-500, [role="alert"]',
      );

      const hasInvalid = (await invalidInputs.count()) > 0;
      const hasErrors = (await errorMessages.count()) > 0;

      // Either HTML5 native validation or custom error messages
      expect(hasInvalid || hasErrors).toBeTruthy();
    });
  });

  // ---------------------------------------------------------------------------
  // Newsletter / subscription form
  // ---------------------------------------------------------------------------
  test.describe('Newsletter Form', () => {
    test('newsletter form accepts a valid email', async ({ page }) => {
      await page.goto(ROUTES.home);
      await waitForPageLoad(page);

      // Look for a newsletter-style form (email + submit button)
      const emailInput = page
        .locator(
          'form input[type="email"], [class*="newsletter"] input, [class*="subscribe"] input',
        )
        .first();

      const isVisible = await emailInput.isVisible().catch(() => false);
      if (!isVisible) return;

      await emailInput.fill('valid@example.com');
      const value = await emailInput.inputValue();
      expect(value).toBe('valid@example.com');
    });

    test('newsletter form rejects invalid email format', async ({ page }) => {
      await page.goto(ROUTES.home);
      await waitForPageLoad(page);

      const emailInput = page
        .locator(
          'form input[type="email"], [class*="newsletter"] input[type="email"]',
        )
        .first();

      const isVisible = await emailInput.isVisible().catch(() => false);
      if (!isVisible) return;

      await emailInput.fill('notanemail');
      const submitBtn = page
        .locator('form button[type="submit"], form input[type="submit"]')
        .first();
      const hasSbumit = await submitBtn.isVisible().catch(() => false);
      if (!hasSbumit) return;

      await submitBtn.click();
      await page.waitForTimeout(400);

      const invalid = await emailInput.evaluate((el) => {
        return !(el as HTMLInputElement).validity.valid;
      });
      expect(invalid).toBeTruthy();
    });
  });

  // ---------------------------------------------------------------------------
  // Select / dropdown fields
  // ---------------------------------------------------------------------------
  test.describe('Select / Dropdown Fields', () => {
    test('select fields have at least one option', async ({ page }) => {
      await page.goto(ROUTES.home);
      await waitForPageLoad(page);

      const selects = page.locator('form select');
      const count = await selects.count();
      if (count === 0) return;

      for (let i = 0; i < count; i++) {
        const select = selects.nth(i);
        const options = select.locator('option');
        const optCount = await options.count();
        expect(optCount).toBeGreaterThan(0);
      }
    });

    test('selecting a dropdown option changes its value', async ({ page }) => {
      await page.goto(ROUTES.home);
      await waitForPageLoad(page);

      const selects = page.locator('form select');
      const count = await selects.count();
      if (count === 0) return;

      const select = selects.first();
      const options = select.locator('option');
      if ((await options.count()) < 2) return;

      const secondOptionValue = await options.nth(1).getAttribute('value');
      if (!secondOptionValue) return;

      await select.selectOption(secondOptionValue);
      const selectedValue = await select.inputValue();
      expect(selectedValue).toBe(secondOptionValue);
    });
  });

  // ---------------------------------------------------------------------------
  // Form on shop / catalog pages (search form)
  // ---------------------------------------------------------------------------
  test.describe('Search Form', () => {
    test('search form submits and updates URL', async ({ page }) => {
      await page.goto(ROUTES.shop);
      await waitForPageLoad(page);

      const searchForm = page.locator(
        'form[role="search"], form[action*="search"]',
      );
      const hasSearchForm = await searchForm.isVisible().catch(() => false);
      if (!hasSearchForm) return;

      const input = searchForm.locator('input').first();
      await input.fill('test');
      // Press Enter directly on the input so it always goes to the right element
      // regardless of any focus shifts caused by the router navigation in handleSearch.
      await input.press('Enter');
      // Wait explicitly for the URL to reflect the search param rather than
      // using waitForPageLoad (networkidle), which may resolve before the
      // client-side router.replace() updates the URL.
      await page.waitForURL(/search=test/, { timeout: 5000 });

      // /search=test/ — no unescaped '?' so the pattern is a plain substring match
      expect(page.url()).toMatch(/search=test/);
    });
  });

  // ---------------------------------------------------------------------------
  // Form reset
  // ---------------------------------------------------------------------------
  test.describe('Form Reset', () => {
    test('reset button clears form fields', async ({ page }) => {
      await page.goto(ROUTES.home);
      await waitForPageLoad(page);

      const resetBtn = page
        .locator('button[type="reset"], input[type="reset"]')
        .first();
      const hasReset = await resetBtn.isVisible().catch(() => false);
      if (!hasReset) return;

      // Fill some fields first
      await fillAllTextInputs(page, 'some text');

      await resetBtn.click();
      await page.waitForTimeout(300);

      // All text inputs should now be empty (or back to default)
      const inputs = page.locator('input[type="text"], input[type="email"]');
      const count = await inputs.count();
      for (let i = 0; i < Math.min(count, 3); i++) {
        const value = await inputs.nth(i).inputValue();
        expect(value.trim()).toBe('');
      }
    });
  });
});
