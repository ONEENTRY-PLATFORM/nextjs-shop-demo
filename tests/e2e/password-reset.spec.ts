import { expect, test } from '@playwright/test';

import { openSignInModal } from './helpers/auth-helpers';
import { ALLOW_WRITES, SELECTORS, TEST_AUTH_USER } from './settings';

/**
 * E2E tests for the forgot-password / OTP / reset-password flow.
 *
 * auth.spec.ts covers sign-in / sign-up but not this secondary flow. The forms
 * are chained inside the shared drawer:
 * SignInForm → (ResetPasswordButton) → ForgotPasswordForm →
 * (generateCode) → VerificationForm → (checkCode) → ResetPasswordForm
 *
 * Everything up to sending the code is asserted read-only. Actually requesting
 * the code emails the real TEST_AUTH_USER, so that transition is gated behind
 * ALLOW_WRITES. The final ResetPasswordForm needs the emailed code, so it can't
 * be automated and is intentionally out of scope.
 */
test.describe('Password Reset', () => {
  test('reset-password link switches the modal to the forgot-password form', async ({
    page,
  }) => {
    await openSignInModal(page);

    // ResetPasswordButton is the only underlined (non-.btn) button in the modal.
    await page.locator(`${SELECTORS.signInModal} button.underline`).click();

    // ForgotPasswordForm renders ONLY the email field — the password field of
    // the sign-in form must be gone, the name field of sign-up must be absent.
    await expect(
      page.locator(`${SELECTORS.signInModal} ${SELECTORS.emailInput}`),
    ).toBeVisible({ timeout: 8000 });
    await expect(
      page.locator(`${SELECTORS.signInModal} ${SELECTORS.passwordInput}`),
    ).toHaveCount(0);
    await expect(
      page.locator(`${SELECTORS.signInModal} ${SELECTORS.nameInput}`),
    ).toHaveCount(0);
  });

  test('forgot-password form has an email field and a submit button', async ({
    page,
  }) => {
    await openSignInModal(page);
    await page.locator(`${SELECTORS.signInModal} button.underline`).click();

    await expect(
      page.locator(`${SELECTORS.signInModal} ${SELECTORS.emailInput}`),
    ).toBeVisible({ timeout: 8000 });
    await expect(
      page.locator(`${SELECTORS.signInModal} button[type="submit"]`),
    ).toBeVisible();
  });

  test('requesting a code advances to the OTP verification step', async ({
    page,
  }) => {
    test.skip(
      !ALLOW_WRITES,
      'Sends a real reset code email — enable with E2E_WRITE_TESTS=1',
    );

    await openSignInModal(page);
    await page.locator(`${SELECTORS.signInModal} button.underline`).click();

    const email = page.locator(
      `${SELECTORS.signInModal} ${SELECTORS.emailInput}`,
    );
    await expect(email).toBeVisible({ timeout: 8000 });
    await email.fill(TEST_AUTH_USER.email);
    await page
      .locator(`${SELECTORS.signInModal} button[type="submit"]`)
      .click();

    // VerificationForm renders exactly six OTP inputs and a resend button that
    // starts on cooldown (disabled with a countdown).
    const otpInputs = page.locator(`${SELECTORS.signInModal} input`);
    await expect(otpInputs).toHaveCount(6, { timeout: 10000 });

    const resend = page.locator(
      `${SELECTORS.signInModal} button:has-text("(")`,
    );
    await expect(resend.first()).toBeDisabled();
  });
});
