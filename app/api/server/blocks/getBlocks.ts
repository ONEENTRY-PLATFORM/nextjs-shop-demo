import type { IError } from 'oneentry/dist/base/utils';
import type {
  BlockType,
  IBlocksResponse,
} from 'oneentry/dist/blocks/blocksInterfaces';

import { getApi, isError } from '@/app/api';
import { toLangCode } from '@/app/types/enum';

interface HandleProps {
  type: BlockType;
  lang: string;
}

/**
 * Get blocks by parameters.
 * @async
 * @param   {HandleProps}     props      - Parameters
 * @param   {BlockType}       props.type - Available values : forCatalogProducts, forBasketPage, forErrorPage, forCatalogPages, forProductPreview, forProductPage, forSimilarProductBlock, forStatisticProductBlock, forProductBlock, forForm, forFormField, forNewsPage, forNewsBlock, forNewsPreview, forOneNewsPage, forUsualPage, forTextBlock, forSlider, forOrder, service
 * @param   {string}          props.lang - Current language shortcode
 * @returns {Promise<object>}            Return array of BlocksEntity object Promise.
 * @see {@link https://doc.oneentry.cloud/docs/blocks OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry CMS docs}
 */
export const getBlocks = async ({
  type,
  lang,
}: HandleProps): Promise<{
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
};
