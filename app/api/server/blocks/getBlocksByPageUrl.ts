import { unstable_cache } from 'next/cache';
import type { IError, IPositionBlock } from 'oneentry/types';
import { cache } from 'react';

import { getApi, isError } from '@/app/api';
import { toLangCode } from '@/app/types/enum';

/**
 * Cross-request Data Cache layer: stores the page blocks in the Next.js Data
 * Cache with a TTL and tags so repeat requests skip the OneEntry round-trip.
 * Takes positional primitives for a stable cache key.
 * @param   {string}          pageUrl - Page URL.
 * @param   {string}          lang    - Current language shortcode.
 * @returns {Promise<object>}         Envelope with position blocks.
 */
const fetchBlocksByPageUrl = unstable_cache(
  async (
    pageUrl: string,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    blocks?: IPositionBlock[];
  }> => {
    const langCode = toLangCode(lang);

    const data = await getApi().Pages.getBlocksByPageUrl(pageUrl, langCode);

    if (isError(data)) {
      return { isError: true, error: data };
    }

    return { isError: false, blocks: data };
  },
  ['oneentry-getBlocksByPageUrl'],
  { revalidate: 60, tags: ['oneentry', 'oneentry-blocks'] },
);

/**
 * Get all blocks by page url.
 * React cache() deduplicates within a single render; the inner unstable_cache
 * layer deduplicates between requests (performance rule).
 * @async
 * @param   {object}          props         - Handle props
 * @param   {string}          props.lang    - Current language shortcode
 * @param   {string}          props.pageUrl - Page URL
 * @returns {Promise<object>}               all blocks as an array of PositionBlock objects or an empty array [] (if there is no data) for the selected parent
 * @see {@link https://doc.oneentry.cloud/docs/blocks OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getBlocksByPageUrl = cache(
  async ({
    lang,
    pageUrl,
  }: {
    lang: string;
    pageUrl: string;
  }): Promise<{
    isError: boolean;
    error?: IError;
    blocks?: IPositionBlock[];
  }> => fetchBlocksByPageUrl(pageUrl, lang),
);
