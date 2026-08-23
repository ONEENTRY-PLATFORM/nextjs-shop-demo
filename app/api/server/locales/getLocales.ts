import { unstable_cache } from 'next/cache';
import type { IError, ILocalEntity } from 'oneentry/types';
import { cache } from 'react';

import { getApi, isError } from '@/app/api';

/**
 * Cross-request Data Cache layer: stores the locales in the Next.js Data
 * Cache with a TTL and tags so repeat requests skip the OneEntry round-trip.
 * @returns {Promise<object>} Envelope with LocaleEntity objects array.
 */
const fetchLocales = unstable_cache(
  async (): Promise<{
    isError: boolean;
    error?: IError;
    locales?: ILocalEntity[];
  }> => {
    const data = await getApi().Locales.getLocales();

    if (isError(data)) {
      return { isError: true, error: data };
    }

    /**
     * `isError` only recognises HTTP errors (they carry `statusCode`). Network
     * / parsing failures come back as a raw `Error`, which slips past the
     * guard — returning it as `locales` used to crash the language selector
     * with "filter is not a function" during prerender. Accept the payload
     * only when it really is the expected array.
     */
    if (!Array.isArray(data)) {
      return {
        isError: true,
        error: {
          statusCode: 500,
          message: 'Locales response is not an array',
        } as IError,
      };
    }

    return { isError: false, locales: data };
  },
  ['oneentry-getLocales'],
  { revalidate: 300, tags: ['oneentry', 'oneentry-locales'] },
);

/**
 * Get all active language localization objects.
 * React cache() deduplicates within a single render; the inner unstable_cache
 * layer deduplicates between requests (performance rule).
 * @async
 * @returns {Promise<object>} an array of LocaleEntity objects Promise
 * @see {@link https://doc.oneentry.cloud/docs/languages OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getLocales = cache(
  async (): Promise<{
    isError: boolean;
    error?: IError;
    locales?: ILocalEntity[];
  }> => fetchLocales(),
);
