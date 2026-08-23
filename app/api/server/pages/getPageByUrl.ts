import { unstable_cache } from 'next/cache';
import type { IError, IPagesEntity } from 'oneentry/types';
import { cache } from 'react';

import { getApi, isError } from '@/app/api';
import { toLangCode } from '@/app/types/enum';

/**
 * Cross-request Data Cache layer: stores the page in the Next.js Data Cache
 * with a TTL and tags so repeat requests skip the OneEntry round-trip.
 * @param   {string}          url  - Page URL.
 * @param   {string}          lang - Current language shortcode.
 * @returns {Promise<object>}      Envelope with PageEntity object.
 */
const fetchPageByUrl = unstable_cache(
  async (
    url: string,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    page?: IPagesEntity;
  }> => {
    const langCode = toLangCode(lang);

    const data = await getApi().Pages.getPageByUrl(url, langCode);

    if (isError(data)) {
      return { isError: true, error: data };
    }

    return { isError: false, page: data };
  },
  ['oneentry-getPageByUrl'],
  { revalidate: 60, tags: ['oneentry', 'oneentry-pages'] },
);

/**
 * Get page object with information about forms, blocks, menus, linked to the page by URL.
 * React cache() deduplicates within a single render; the inner unstable_cache
 * layer deduplicates between requests (performance rule).
 * @async
 * @param   {string}          url  - Page URL.
 * @param   {string}          lang - Current language shortcode.
 * @returns {Promise<object>}      Returns PageEntity object
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 */
export const getPageByUrl = cache(
  async (
    url: string,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    page?: IPagesEntity;
  }> => fetchPageByUrl(url, lang),
);
