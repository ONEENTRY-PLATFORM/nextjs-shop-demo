import type { IError } from 'oneentry/dist/base/utils';
import type { IBlockEntity } from 'oneentry/dist/blocks/blocksInterfaces';

import { api } from '@/app/api';
import { getCachedData, setCachedData } from '@/app/api/utils/cache';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Get block by marker.
 * @async
 * @property {string} marker Marker of Block.
 * @param {string} lang Current language shortcode
 * @see {@link https://doc.oneentry.cloud/docs/blocks OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 *
 * @returns Return array of BlocksEntity object Promise.
 */
export const getBlockByMarker = async (
  marker: string,
  lang: string,
): Promise<{
  isError: boolean;
  error?: IError;
  block?: IBlockEntity;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const cacheKey = `${marker}-${langCode}`;

  // Check cache first
  const cached = getCachedData<IBlockEntity>(cacheKey);
  if (cached) {
    return { isError: false, block: cached };
  }

  try {
    const data = await api.Blocks.getBlockByMarker(marker, langCode);

    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      // Cache the result
      setCachedData<IBlockEntity>(cacheKey, data);
      return { isError: false, block: data };
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
