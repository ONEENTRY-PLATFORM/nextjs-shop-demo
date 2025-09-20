import type { IError } from 'oneentry/dist/base/utils';
import type {
  BlockType,
  IBlocksResponse,
} from 'oneentry/dist/blocks/blocksInterfaces';

import { api } from '@/app/api';
import { getCachedData, setCachedData } from '@/app/api/utils/cache';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

interface HandleProps {
  type: BlockType;
  lang: string;
}

/**
 * Get blocks by parameters.
 * @async
 * @param type Available values : forCatalogProducts, forBasketPage, forErrorPage, forCatalogPages, forProductPreview, forProductPage, forSimilarProductBlock, forStatisticProductBlock, forProductBlock, forForm, forFormField, forNewsPage, forNewsBlock, forNewsPreview, forOneNewsPage, forUsualPage, forTextBlock, forSlider, forOrder, service
 * @param lang Current language shortcode
 * @see {@link https://doc.oneentry.cloud/docs/blocks OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry CMS docs}
 *
 * @returns Return array of BlocksEntity object Promise.
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
  const cacheKey = `${type}-${langCode}`;

  // Check cache first
  const cached = getCachedData<IBlocksResponse>(cacheKey);
  if (cached) {
    return { isError: false, blocks: cached };
  }

  try {
    const data = await api.Blocks.getBlocks(type, langCode);

    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      // Cache the result
      setCachedData<IBlocksResponse>(cacheKey, data);
      return { isError: false, blocks: data };
    }
  } catch (error) {
    const apiError = handleApiError(error);
    return {
      isError: true,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.message,
      } as IError,
    };
  }
};
