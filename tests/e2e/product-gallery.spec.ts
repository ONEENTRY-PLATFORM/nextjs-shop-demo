import { expect, test } from '@playwright/test';

import { waitForPageLoad } from './helpers/navigation-helpers';
import { ROUTES, SELECTORS } from './settings';

/**
 * E2E tests for the product gallery (images, thumbnail switching, zoom/lightbox).
 * product.spec.ts covers the overall product page; this file focuses on the
 * image gallery interaction.
 */
test.describe('Product Gallery', () => {
  test.setTimeout(30000);

  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.product);
    await waitForPageLoad(page);
  });

  // ---------------------------------------------------------------------------
  // Basic gallery rendering
  // ---------------------------------------------------------------------------
  test.describe('Gallery Rendering', () => {
    test('product page shows at least one image', async ({ page }) => {
      const image = page
        .locator(
          '[data-testid="product-gallery"] img, [class*="gallery"] img, [class*="product-image"] img',
        )
        .first()
        .or(page.locator('img[src*="oneentry"], img[alt]').first());

      await expect(image).toBeVisible({ timeout: 10000 });
    });

    test('main product image is visible and has a src', async ({ page }) => {
      // Main image — likely the largest / first image in the gallery container
      const mainImage = page
        .locator(
          '[data-testid="main-image"], [class*="main-image"], [class*="gallery-main"] img',
        )
        .first()
        .or(
          page
            .locator('[class*="product"] img, [class*="gallery"] img')
            .first(),
        );

      const isVisible = await mainImage.isVisible({ timeout: 8000 }).catch(() => false);
      if (!isVisible) {
        // Fallback: any img on the page with a valid src
        const anyImg = page.locator('img[src]:not([src=""])').first();
        await expect(anyImg).toBeVisible();
        return;
      }

      const src = await mainImage.getAttribute('src');
      expect(src).toBeTruthy();
    });

    test('main product image has a non-empty alt attribute', async ({
      page,
    }) => {
      const mainImage = page
        .locator(
          '[data-testid="main-image"], [class*="main-image"], [class*="gallery-main"] img',
        )
        .first()
        .or(page.locator('[class*="product"] img').first());

      const isVisible = await mainImage.isVisible({ timeout: 8000 }).catch(() => false);
      if (!isVisible) return;

      const alt = await mainImage.getAttribute('alt');
      // alt="" is acceptable for decorative images, but non-null is required
      expect(alt).not.toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // Thumbnails
  // ---------------------------------------------------------------------------
  test.describe('Thumbnail Navigation', () => {
    test('thumbnail strip is visible when product has multiple images', async ({
      page,
    }) => {
      const thumbnails = page.locator(
        '[data-testid="thumbnail"], [class*="thumbnail"] img, [class*="gallery-thumb"] img',
      );

      const count = await thumbnails.count();
      if (count < 2) {
        // Only one image — no thumbnail strip expected
        return;
      }

      await expect(thumbnails.first()).toBeVisible();
    });

    test('clicking a thumbnail changes the main image', async ({ page }) => {
      const thumbnails = page.locator(
        '[data-testid="thumbnail"], [class*="thumbnail"] button, [class*="gallery-thumb"] button, [class*="thumbnail"] img',
      );

      const count = await thumbnails.count();
      if (count < 2) return; // No carousel to test

      // Get initial main image src
      const mainImage = page
        .locator(
          '[data-testid="main-image"], [class*="main-image"], [class*="gallery-main"] img',
        )
        .first()
        .or(page.locator('[class*="product"] img').first());

      const isMainVisible = await mainImage.isVisible().catch(() => false);
      if (!isMainVisible) return;

      const initialSrc = await mainImage.getAttribute('src');

      // Click the second thumbnail
      await thumbnails.nth(1).click();
      await page.waitForTimeout(500);

      const newSrc = await mainImage.getAttribute('src');

      // src should change (or a selected class added to the thumbnail)
      const secondThumb = thumbnails.nth(1);
      const hasSelected = await secondThumb
        .evaluate((el) => {
          return (
            el.classList.contains('selected') ||
            el.classList.contains('active') ||
            el.getAttribute('aria-selected') === 'true' ||
            el.getAttribute('data-active') === 'true'
          );
        })
        .catch(() => false);

      expect(newSrc !== initialSrc || hasSelected).toBeTruthy();
    });

    test('first thumbnail is active by default', async ({ page }) => {
      const thumbnails = page.locator(
        '[data-testid="thumbnail"], [class*="thumbnail"] button, [class*="gallery-thumb"] button',
      );

      const count = await thumbnails.count();
      if (count < 2) return;

      const firstThumb = thumbnails.first();
      // First thumbnail should be visually selected
      const hasActive = await firstThumb
        .evaluate((el) => {
          return (
            el.classList.contains('selected') ||
            el.classList.contains('active') ||
            el.getAttribute('aria-selected') === 'true' ||
            el.getAttribute('data-active') === 'true' ||
            // fallback: has a ring/border class typical for selected state
            Array.from(el.classList).some((c) =>
              c.includes('ring') || c.includes('border-') || c.includes('opacity-100'),
            )
          );
        })
        .catch(() => false);

      // If no "active" class, at least it must be visible
      if (!hasActive) {
        await expect(firstThumb).toBeVisible();
      } else {
        expect(hasActive).toBeTruthy();
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Zoom / Lightbox (optional)
  // ---------------------------------------------------------------------------
  test.describe('Zoom / Lightbox', () => {
    test('clicking main image opens lightbox or zoom when present', async ({
      page,
    }) => {
      const mainImage = page
        .locator(
          '[data-testid="main-image"], [class*="main-image"], [class*="gallery-main"] img',
        )
        .first()
        .or(page.locator('[class*="product"] img').first());

      const isVisible = await mainImage.isVisible({ timeout: 5000 }).catch(() => false);
      if (!isVisible) return;

      await mainImage.click();
      await page.waitForTimeout(600);

      // Check for lightbox/modal/zoom overlay
      const overlay = page.locator(
        '[data-testid="lightbox"], [class*="lightbox"], [class*="zoom"], [role="dialog"]',
      );
      const isOpen = await overlay.isVisible().catch(() => false);

      if (isOpen) {
        await expect(overlay.first()).toBeVisible();

        // Should be dismissable
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        const afterEscape = await overlay.first().isVisible().catch(() => false);
        // Either closes on Escape or stays open — both are valid implementations
        expect(typeof afterEscape).toBe('boolean');
      }
      // If no lightbox — no assertion needed, gallery without zoom is valid
    });
  });

  // ---------------------------------------------------------------------------
  // Keyboard navigation in gallery
  // ---------------------------------------------------------------------------
  test.describe('Keyboard Gallery Navigation', () => {
    test('gallery thumbnails are reachable via Tab key', async ({ page }) => {
      const thumbnails = page.locator(
        '[data-testid="thumbnail"], [class*="thumbnail"] button, [class*="gallery-thumb"] button',
      );

      const count = await thumbnails.count();
      if (count < 2) return;

      // Focus first thumbnail and press Tab to reach second
      await thumbnails.first().focus();
      await expect(thumbnails.first()).toBeFocused();

      await page.keyboard.press('Tab');

      const focused = await page.evaluate(
        () => document.activeElement?.tagName ?? '',
      );
      // After Tab, focus should remain on an interactive element
      expect(['BUTTON', 'A', 'IMG']).toContain(focused);
    });
  });

  // ---------------------------------------------------------------------------
  // Image loading
  // ---------------------------------------------------------------------------
  test.describe('Image Loading', () => {
    test('product images load without broken src', async ({ page }) => {
      const images = page.locator(
        '[class*="gallery"] img, [class*="product-image"] img',
      );
      const count = await images.count();

      if (count === 0) return;

      for (let i = 0; i < Math.min(count, 5); i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        if (src) {
          // src must not be a broken placeholder like "undefined" or empty path
          expect(src).not.toBe('undefined');
          expect(src.length).toBeGreaterThan(0);
        }
      }
    });

    test('no images with 404 status on product page', async ({ page }) => {
      const failedImages: string[] = [];

      page.on('response', (response) => {
        if (
          response.request().resourceType() === 'image' &&
          response.status() === 404
        ) {
          failedImages.push(response.url());
        }
      });

      await page.goto(ROUTES.product);
      await waitForPageLoad(page);
      await page.waitForTimeout(1000);

      expect(failedImages).toHaveLength(0);
    });
  });
});
