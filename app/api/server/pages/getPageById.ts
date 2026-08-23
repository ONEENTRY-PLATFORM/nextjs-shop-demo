import { unstable_cache } from 'next/cache';
import type { IError, IPagesEntity } from 'oneentry/types';
import { cache } from 'react';

import { getApi, isError } from '@/app/api';
import { toLangCode } from '@/app/types/enum';

/**
 * Cross-request Data Cache layer: stores the page in the Next.js Data Cache
 * with a TTL and tags so repeat requests skip the OneEntry round-trip.
 * @param   {number}          id   - Page id.
 * @param   {string}          lang - Current language shortcode.
 * @returns {Promise<object>}      Envelope with the page object.
 */
const fetchPageById = unstable_cache(
  async (
    id: number,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    page?: IPagesEntity;
  }> => {
    const langCode = toLangCode(lang);

    const data = await getApi().Pages.getPageById(id, langCode);

    if (isError(data)) {
      return { isError: true, error: data };
    }

    return { isError: false, page: data };
  },
  ['oneentry-getPageById'],
  { revalidate: 60, tags: ['oneentry', 'oneentry-pages'] },
);

/**
 * Get page object with information about forms, blocks, menus, linked to the page.
 * React cache() deduplicates within a single render; the inner unstable_cache
 * layer deduplicates between requests (performance rule).
 * @async
 * @param   {number}          id   - Page id.
 * @param   {string}          lang - Current language shortcode.
 * @returns {Promise<object>}      Returns PageEntity object
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getPageById = cache(
  async (
    id: number,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    page?: IPagesEntity;
  }> => fetchPageById(id, lang),
);
