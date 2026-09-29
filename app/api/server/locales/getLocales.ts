import { unstable_cache } from 'next/cache';
import type { IError, ILocalEntity } from 'oneentry/types';
import { cache } from 'react';

import { getApi, isError } from '@/app/api/api/api';

/** Total attempts (first try plus retries) for one locales read. */
const LOCALES_FETCH_ATTEMPTS = 3;

/** Base backoff between locales read attempts; multiplied by the attempt number. */
const LOCALES_RETRY_DELAY_MS = 250;

/**
 * Cross-request Data Cache layer: stores the locales in the Next.js Data
 * Cache with a TTL and tags so repeat requests skip the OneEntry round-trip.
 *
 * Retried and then thrown, on the same contract as the menu and product readers. This list has
 * no "missing" state — a project always has locales — so any failure is the CMS being
 * unavailable. Returned as an envelope it was written to the Data Cache and `NavGroup` simply
 * stopped rendering `LangSelector` (`{locales && …}`): one blip took the language switcher off
 * every page of the site for the whole 5-minute TTL, with nothing in the UI to say why. Seven
 * localization specs failed that way in a single run while the selector worked in the next.
 * @returns {Promise<object>} Envelope with LocaleEntity objects array.
 * @throws  {IError}          When the CMS read fails.
 */
const fetchLocales = unstable_cache(
  async (): Promise<{
    isError: boolean;
    error?: IError;
    locales?: ILocalEntity[];
  }> => {
    let lastError: IError = {
      statusCode: 500,
      message: 'Locales response is not an array',
    } as IError;

    for (let attempt = 0; attempt < LOCALES_FETCH_ATTEMPTS; attempt++) {
      const data = await getApi().Locales.getLocales();

      /**
       * `isError` only recognises HTTP errors (they carry `statusCode`). Network / parsing
       * failures come back as a raw `Error`, which slips past the guard — returning it as
       * `locales` used to crash the language selector with "filter is not a function" during
       * prerender. Accept the payload only when it really is the expected array.
       */
      if (!isError(data) && Array.isArray(data)) {
        return { isError: false, locales: data };
      }

      if (isError(data)) {
        lastError = data;
      }

      if (attempt < LOCALES_FETCH_ATTEMPTS - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, LOCALES_RETRY_DELAY_MS * (attempt + 1)),
        );
      }
    }

    throw lastError;
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
  }> => {
    try {
      return await fetchLocales();
    } catch (error) {
      /**
       * Failures are deliberately not cached — see `fetchLocales`. The envelope still reaches
       * the caller, so a blip costs this one render its language switcher instead of taking
       * every page down; the next request asks the CMS again rather than reading a cached
       * failure for five minutes.
       */
      return { isError: true, error: error as IError };
    }
  },
);
