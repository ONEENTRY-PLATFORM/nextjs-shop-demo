import { unstable_cache } from 'next/cache';
import type { IError } from 'oneentry/dist/base/utils';
import type {
  BlockType,
  IBlocksResponse,
} from 'oneentry/dist/blocks/blocksInterfaces';
import { cache } from 'react';

import { getApi, isError } from '@/app/api';
import { toLangCode } from '@/app/types/enum';

interface HandleProps {
  type: BlockType;
  lang: string;
}

/**
 * Cross-request Data Cache layer: stores the blocks in the Next.js Data Cache
 * with a TTL and tags so repeat requests skip the OneEntry round-trip.
 * @param   {BlockType}       type - Block type to query.
 * @param   {string}          lang - Current language shortcode.
 * @returns {Promise<object>}      Envelope with the blocks response.
 */
const fetchBlocks = unstable_cache(
  async (
    type: BlockType,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    blocks?: IBlocksResponse;
  }> => {
    const langCode = toLangCode(lang);

    const data = await getApi().Blocks.getBlocks(type, langCode);

    if (isError(data)) {
      return { isError: true, error: data };
    }

    return { isError: false, blocks: data };
  },
  ['oneentry-getBlocks'],
  { revalidate: 60, tags: ['oneentry', 'oneentry-blocks'] },
);

/**
 * Get blocks by parameters.
 * React cache() deduplicates within a single render; the inner unstable_cache
 * layer deduplicates between requests (performance rule).
 * @async
 * @param   {HandleProps}     props      - Parameters
 * @param   {BlockType}       props.type - Available values : forCatalogProducts, forBasketPage, forErrorPage, forCatalogPages, forProductPreview, forProductPage, forSimilarProductBlock, forStatisticProductBlock, forProductBlock, forForm, forFormField, forNewsPage, forNewsBlock, forNewsPreview, forOneNewsPage, forUsualPage, forTextBlock, forSlider, forOrder, service
 * @param   {string}          props.lang - Current language shortcode
 * @returns {Promise<object>}            Return array of BlocksEntity object Promise.
 * @see {@link https://doc.oneentry.cloud/docs/blocks OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry CMS docs}
 */
export const getBlocks = cache(
  async ({
    type,
    lang,
  }: HandleProps): Promise<{
    isError: boolean;
    error?: IError;
    blocks?: IBlocksResponse;
  }> => fetchBlocks(type, lang),
);
