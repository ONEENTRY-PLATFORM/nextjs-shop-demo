import { unstable_cache } from 'next/cache';
import type { IAttributeValues } from 'oneentry/types';

import {
  getImagePreview,
  getImageUrl,
} from '@/app/api/hooks/useAttributesData';

/**
 * ⚠️ Server-only. This module imports `lqip-modern`, which depends on `sharp`
 * (a native Node binary) and therefore cannot run in a Client Component. Import
 * it only from Server Components / server code. (`server-only` is not installed
 * in this project; the `sharp` dependency makes a client import fail the build.)
 */

/**
 * Generate a low-quality image placeholder (LQIP) from a remote image URL.
 *
 * Fetches the image and runs it through `lqip-modern` (sharp) to produce a tiny
 * base64 data URI. Wrapped in {@link unstable_cache} keyed by the URL because the
 * category page is `force-dynamic`: without this, sharp would re-process every
 * image on every request. OneEntry download links are effectively immutable per
 * URL, so the result is cached for a day.
 * @param   {string}          imageUrl - Absolute URL of the source image.
 * @returns {Promise<string>}          Base64 data-URI blur, or `''` on failure.
 */
const generateLqip = unstable_cache(
  async (imageUrl: string): Promise<string> => {
    try {
      // Dynamic import keeps the heavy sharp/lqip-modern bundle out of any
      // graph that does not actually generate a placeholder.
      const { default: lqipModern } = await import('lqip-modern');
      const response = await fetch(imageUrl);
      if (!response.ok) {
        return '';
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      const { metadata } = await lqipModern(buffer);
      return metadata.dataURIBase64;
    } catch {
      return '';
    }
  },
  ['image-lqip'],
  { revalidate: 86400 },
);

/**
 * Resolve a Next.js `blurDataURL` for an `image` attribute.
 *
 * Prefers the CMS-generated preview ({@link getImagePreview}); when none exists,
 * falls back to generating an LQIP from the full image via {@link generateLqip}.
 * Returns `''` when the attribute has no image at all.
 * @async
 * @param   {string}                     name            - Image attribute marker.
 * @param   {IAttributeValues|undefined} attributeValues - Entity `attributeValues`.
 * @returns {Promise<string>}                            Base64 data-URI blur, or `''`.
 */
export const getBlurDataURL = async (
  name: string,
  attributeValues: IAttributeValues | undefined,
): Promise<string> => {
  const cmsPreview = getImagePreview(name, attributeValues);
  if (cmsPreview) {
    return cmsPreview;
  }
  const imageUrl = getImageUrl(name, attributeValues);
  if (!imageUrl) {
    return '';
  }
  return generateLqip(imageUrl);
};
