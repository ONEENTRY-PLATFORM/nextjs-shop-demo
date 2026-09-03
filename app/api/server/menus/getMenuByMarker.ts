import { unstable_cache } from 'next/cache';
import type { IError, IMenusEntity } from 'oneentry/types';
import { cache } from 'react';

import { getApi, isError } from '@/app/api/api/api';
import { toLangCode } from '@/app/types/enum';

/** Total attempts (first try plus retries) for one menu read. */
const MENU_FETCH_ATTEMPTS = 3;

/** Base backoff between menu read attempts; multiplied by the attempt number. */
const MENU_RETRY_DELAY_MS = 250;

/**
 * Cross-request Data Cache layer: stores the menu in the Next.js Data Cache
 * with a TTL and tags so repeat requests skip the OneEntry round-trip.
 *
 * A failed read **throws** instead of returning the error envelope: a value
 * returned from here is written to the Data Cache, so a transient CMS failure
 * would otherwise be frozen for the whole TTL — and, when it happens during
 * `next build`, baked into every prerendered page (the navigation renders its
 * skeleton forever). Throwing keeps failures out of the cache so the next
 * request retries; the caller below converts the throw back into an envelope.
 * @param   {string}          marker - Menu marker.
 * @param   {string}          lang   - Language code.
 * @returns {Promise<object>}        Envelope with menu object.
 * @throws  {IError}                 When the CMS read fails.
 */
const fetchMenuByMarker = unstable_cache(
  async (
    marker: string,
    lang: string,
  ): Promise<{
    isError: boolean;
    menu: IMenusEntity;
  }> => {
    const langCode = toLangCode(lang);

    /**
     * Retried because `next build` prerenders with many parallel workers and
     * the CMS intermittently rejects a request under that burst. Without a
     * retry the navigation skeleton gets baked into the generated page and
     * stays there until the route revalidates.
     */
    let lastError: IError | undefined;
    for (let attempt = 0; attempt < MENU_FETCH_ATTEMPTS; attempt++) {
      const data = await getApi().Menus.getMenusByMarker(marker, langCode);

      if (!isError(data)) {
        return { isError: false, menu: data };
      }

      lastError = data;
      if (attempt < MENU_FETCH_ATTEMPTS - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, MENU_RETRY_DELAY_MS * (attempt + 1)),
        );
      }
    }

    throw lastError;
  },
  ['oneentry-getMenuByMarker'],
  { revalidate: 300, tags: ['oneentry', 'oneentry-menus'] },
);

/**
 * Get pages includes in menu by marker.
 * React cache() deduplicates within a single render; the inner unstable_cache
 * layer deduplicates between requests (performance rule).
 * @async
 * @param   {string}          marker - Menu marker.
 * @param   {string}          lang   - Language code.
 * @returns {Promise<object>}        a single menu object as a ContentMenu object with included pages
 * @see {@link https://doc.oneentry.cloud/docs/menu OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getMenuByMarker = cache(
  async (
    marker: string,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    menu?: IMenusEntity;
  }> => {
    try {
      return await fetchMenuByMarker(marker, lang);
    } catch (error) {
      /** Failures are deliberately not cached — see `fetchMenuByMarker`. */
      return { isError: true, error: error as IError };
    }
  },
);
