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
  /** Get language code from LanguageEnum */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  /** Fetch blocks by type and language from the API */
  try {
    /** Call the API to get blocks by type and language */
    const data = await api.Blocks.getBlocks(type, langCode);

    /** Check if the response is an error */
    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, blocks: data };
    }
  } catch (error) {
    /** Handle API errors */
    const apiError = handleApiError('getBlocks', error);
    /** Return error response */
    return {
      isError: true,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.message,
      } as IError,
    };
  }
};
