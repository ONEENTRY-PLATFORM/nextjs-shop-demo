# E2E Tests

This directory contains End-to-End (E2E) tests for the OneEntry Next.js Shop using Playwright.

## Overview

The E2E tests cover critical user flows in the e-commerce application:

- **Auth**: Sign in, sign out, registration form, protected routes
- **Product**: Product page structure, add to cart, quantity selector, favorites
- **Cart**: Adding/removing products, changing quantities, cart persistence
- **Checkout**: Delivery form, validation, date/time slots, payment method
- **Favorites**: Adding/removing favorites, wishlist management
- **Catalog**: Product grid, filter modal, price/color/in-stock filters
- **Orders**: Authenticated access, order list, empty state
- **Profile**: Profile page, form fields, save button
- **Search**: Search bar, results dropdown, submit behaviour
- **Navigation**: Links, breadcrumbs, language switcher
- **Localization**: Language switching, URL preservation, locale in content
- **Error Pages**: 404, empty states, network resilience
- **Accessibility**: Landmarks, keyboard navigation, ARIA labels, focus management
- **Filter Combinations**: Combined filters, URL persistence, pagination reset
- **Product Gallery**: Image rendering, thumbnail switching, lightbox, keyboard nav
- **Toast Notifications**: Success/error toasts, auto-dismiss, auth feedback
- **Mobile Flows**: Hamburger menu, mobile filters, responsive layout
- **Form Submission**: CMS-driven forms, validation, select fields, reset

## Project Structure

```text
tests/
├── e2e/
│   ├── helpers/
│   │   ├── auth-helpers.ts          # Sign in, sign out, modal helpers
│   │   ├── cart-helpers.ts          # Open cart, add/remove/quantity
│   │   ├── favorites-helpers.ts     # Favorites badge and navigation
│   │   └── navigation-helpers.ts   # Page navigation and load helpers
│   ├── settings.ts                  # Test data, selectors, routes
│   ├── auth.spec.ts                 # Authentication (13 tests)
│   ├── cart.spec.ts                 # Cart functionality (8 tests)
│   ├── catalog.spec.ts              # Product catalog and filters (11 tests)
│   ├── checkout.spec.ts             # Checkout flow (13 tests)
│   ├── error-pages.spec.ts          # 404 and error handling (6 tests)
│   ├── favorites.spec.ts            # Favorites/wishlist (5 tests)
│   ├── homepage.spec.ts             # Homepage structure (9 tests)
│   ├── localization.spec.ts         # Language switching (6 tests)
│   ├── navigation.spec.ts           # Navigation links and menu (8 tests)
│   ├── orders.spec.ts               # Orders page (6 tests)
│   ├── product.spec.ts              # Single product page (13 tests)
│   ├── profile.spec.ts              # User profile page (5 tests)
│   ├── search.spec.ts               # Search bar (9 tests)
│   ├── accessibility.spec.ts        # A11y — landmarks, keyboard, ARIA (17 tests)
│   ├── filter-combinations.spec.ts  # Combined filter scenarios (12 tests)
│   ├── mobile-flows.spec.ts         # Mobile viewport flows (16 tests)
│   ├── product-gallery.spec.ts      # Gallery, thumbnails, zoom (11 tests)
│   ├── toast-notifications.spec.ts  # Toast/notification feedback (9 tests)
│   └── form-submission.spec.ts      # CMS forms, validation, reset (10 tests)
├── .env                             # Local test credentials (git-ignored)
├── .env_example                     # Example env file
└── README.md                        # This file
```

**Total: ~171 tests across 20 spec files.**

## Prerequisites

Before running tests, ensure:

1. Node.js >= 22.11.0 is installed
2. Dependencies are installed: `npm install`
3. Playwright browsers are installed: `npx playwright install`
4. Create `tests/.env` from `tests/.env_example` and fill in credentials

## Environment Setup

```bash
# tests/.env
TEST_USER_EMAIL=your-test-user@example.com
TEST_USER_PASSWORD=YourPassword123!
BASE_URL=http://localhost:3000
```

> Auth tests require a real registered user in your OneEntry project.
> Without credentials the defaults (`test@example.com` / `TestPassword123!`) are used,
> which will cause sign-in tests to fail unless such a user exists.

## Running Tests

### Run all E2E tests (headless mode)

```bash
npm run test:e2e
```

### Run tests with UI mode (recommended for development)

```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)

```bash
npm run test:e2e:headed
```

### Debug tests

```bash
npm run test:e2e:debug
```

### View test report

```bash
npm run test:e2e:report
```

### Run tests on specific browsers

```bash
npm run test:e2e:chromium  # Chrome only
npm run test:e2e:firefox   # Firefox only
npm run test:e2e:webkit    # Safari only
```

### Run a specific spec file

```bash
npx playwright test checkout.spec.ts
npx playwright test accessibility.spec.ts
```

### Run a specific test by name

```bash
npx playwright test -g "shows success toast after adding product to cart"
```

## Test Configuration

The Playwright configuration is in `playwright.config.ts` at the project root.

Key settings:

| Setting | Value |
| --- | --- |
| Base URL | `http://localhost:3000` (override with `BASE_URL`) |
| Browsers | Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari |
| Reporters | HTML, List, JSON (`test-results/results.json`) |
| Retries | 2 on CI, 0 locally |
| Video | Captured on failure |
| Screenshots | Captured on failure |
| Traces | Captured on first retry |

## Writing New Tests

### 1. Use helper functions

```typescript
import { signIn, clearAuthState } from './helpers/auth-helpers';
import { openCart, proceedToCheckout } from './helpers/cart-helpers';
import { waitForPageLoad } from './helpers/navigation-helpers';
```

### 2. Import selectors and routes from settings

```typescript
import { SELECTORS, ROUTES, TEST_AUTH_USER } from './settings';

await page.click(SELECTORS.addToCartButton);
await page.goto(ROUTES.shop);
```

### 3. Follow the standard test structure

```typescript
test.describe('Feature Name', () => {
  test.setTimeout(30000);

  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.home);
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({ page }) => {
    await clearAuthState(page); // if auth was used
  });

  test('does something', async ({ page }) => {
    // Arrange → Act → Assert
  });
});
```

### 4. Handle optional elements gracefully

```typescript
// Use early return for optional features
const isVisible = await element.isVisible().catch(() => false);
if (!isVisible) return; // skip gracefully — not a hard failure

// Use || to accept multiple valid states
expect(hasTable || hasEmptyState || hasMain).toBeTruthy();
```

### 5. Add `data-testid` attributes to new components

```tsx
<button data-testid="my-new-button">Click me</button>
```

Then add to `SELECTORS` in `tests/e2e/settings.ts`:

```typescript
myNewButton: '[data-testid="my-new-button"]',
```

## Timeouts Guide

| Test type | Recommended timeout |
| --- | --- |
| Simple page load | 10 000 ms (default) |
| Animated content (GSAP) | +2 000 ms `waitForTimeout` |
| Auth flow (sign-in modal) | 40 000 ms |
| Cart with animations | 60 000 ms |
| Checkout (full flow) | 90 000 ms |
| Orders (makeUserApi + fetch) | +4 000 ms `waitForTimeout` |

## Important Notes

### GSAP Animations

Several pages use GSAP entrance animations. Tests account for this with explicit waits:

```typescript
await page.waitForTimeout(2000); // cart page animations
await page.waitForTimeout(500);  // modal field animations
```

### Token Handling

Auth state is stored in `localStorage` as `refresh-token`. The `clearAuthState` helper removes it and reloads the page. Always call it in `afterEach` for authenticated tests.

### Mobile Tests

`mobile-flows.spec.ts` uses `test.use({ viewport: { width: 393, height: 851 } })` to simulate a Pixel 5. Tests run at this viewport in addition to the default desktop viewports from `playwright.config.ts`.

### Filter Tests

After navigating to a URL with query params (e.g. `?minPrice=50`), always wait for the filter button to be visible before clicking:

```typescript
await expect(page.locator(SELECTORS.filterButton)).toBeVisible({ timeout: 10000 });
await page.locator(SELECTORS.filterButton).click();
const modal = page.locator(SELECTORS.filterModal);
await expect(modal).toBeVisible({ timeout: 8000 });
```

## Troubleshooting

### Tests failing locally

1. Ensure dev server is running: `npm run dev`
2. Check if port 3000 is available
3. Clear Playwright cache: `npx playwright clean`
4. Reinstall browsers: `npx playwright install`

### Element not found / timeout

1. Check if `data-testid` attribute exists on the component
2. Open Playwright Inspector to debug: `npm run test:e2e:debug`
3. Increase timeout for that test: `test.setTimeout(60000)`
4. Check for GSAP animations — add `waitForTimeout` after the trigger action

### Sign-in tests fail

- Ensure `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` in `tests/.env` match a real user
- Check that the user's group has appropriate permissions in the OneEntry admin panel

### Orders/Profile tests fail with 401

- The `makeUserApi` flow burns a `refreshToken` on each call. Ensure only one `makeUserApi` is used per Server Action.
- Increase `waitForTimeout` to allow the token refresh to complete before assertions.

## CI/CD Integration

Tests are configured to run on CI with:

- Automatic retries (2 attempts on failure)
- Video recording on failure
- Screenshot on failure
- JSON reporter for results parsing

Example GitHub Actions workflow:

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
        env:
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
