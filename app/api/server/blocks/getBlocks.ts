import type { IError } from 'oneentry/dist/base/utils';
import type {
  BlockType,
  IBlocksResponse,
} from 'oneentry/dist/blocks/blocksInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

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
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  try {
    const data = await api.Blocks.getBlocks(type, langCode);

    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, blocks: data };
    }
  } catch (error) {
    const apiError = handleApiError('getBlocks', error);
    return {
      isError: true,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.message,
      } as IError,
    };
  }
};
