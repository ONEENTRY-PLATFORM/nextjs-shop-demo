import { unstable_cache } from 'next/cache';
import type { IBlockEntity, IError } from 'oneentry/types';
import { cache } from 'react';

import { getApi, isError } from '@/app/api/api/api';
import { toLangCode } from '@/app/types/enum';

/**
 * Cross-request Data Cache layer: stores the block in the Next.js Data Cache
 * with a TTL and tags so repeat requests skip the OneEntry round-trip.
 * @param   {string}          marker - Marker of Block.
 * @param   {string}          lang   - Current language shortcode.
 * @returns {Promise<object>}        Envelope with block object.
 */
const fetchBlockByMarker = unstable_cache(
  async (
    marker: string,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    block?: IBlockEntity;
  }> => {
    const langCode = toLangCode(lang);

    const data = await getApi().Blocks.getBlockByMarker(marker, langCode);

    if (isError(data)) {
      return { isError: true, error: data };
    }

    return { isError: false, block: data };
  },
  ['oneentry-getBlockByMarker'],
  { revalidate: 60, tags: ['oneentry', 'oneentry-blocks'] },
);

/**
 * Get block by marker.
 * React cache() deduplicates within a single render; the inner unstable_cache
 * layer deduplicates between requests (performance rule).
 * @param   {string}          marker - Marker of Block.
 * @param   {string}          lang   - Current language shortcode.
 * @returns {Promise<object>}        Return array of BlocksEntity object Promise.
 * @see {@link https://doc.oneentry.cloud/docs/blocks OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getBlockByMarker = cache(
  async (
    marker: string,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    block?: IBlockEntity;
  }> => fetchBlockByMarker(marker, lang),
);
