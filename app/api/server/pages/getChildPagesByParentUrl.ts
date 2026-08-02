import { unstable_cache } from 'next/cache';
import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import { cache } from 'react';

import { getApi, isError } from '@/app/api';
import { toLangCode } from '@/app/types/enum';

/**
 * Cross-request Data Cache layer: stores the child pages in the Next.js Data
 * Cache with a TTL and tags so repeat requests skip the OneEntry round-trip.
 * @param   {string}          url  - Page URL.
 * @param   {string}          lang - Current language shortcode.
 * @returns {Promise<object>}      Envelope with PageEntity objects array.
 */
const fetchChildPagesByParentUrl = unstable_cache(
  async (
    url: string,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    pages?: IPagesEntity[];
  }> => {
    const langCode = toLangCode(lang);

    const data = await getApi().Pages.getChildPagesByParentUrl(url, langCode);

    if (isError(data)) {
      return { isError: true, error: data };
    }

    return { isError: false, pages: data };
  },
  ['oneentry-getChildPagesByParentUrl'],
  { revalidate: 60, tags: ['oneentry', 'oneentry-pages'] },
);

/**
 * Get child pages object with information as an array.
 * React cache() deduplicates within a single render; the inner unstable_cache
 * layer deduplicates between requests (performance rule).
 * @async
 * @param   {string}          url  - Page URL.
 * @param   {string}          lang - Current language shortcode.
 * @returns {Promise<object>}      Returns all created pages as an array of PageEntity objects or an empty array [] (if there is no data) for the selected parent
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getChildPagesByParentUrl = cache(
  async (
    url: string,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    pages?: IPagesEntity[];
  }> => fetchChildPagesByParentUrl(url, lang),
);
