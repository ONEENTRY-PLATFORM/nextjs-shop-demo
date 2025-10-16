import type { IError } from 'oneentry/dist/base/utils';
import type { IBlockEntity } from 'oneentry/dist/blocks/blocksInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Get block by marker.
 * @param   {string}          marker - Marker of Block.
 * @param   {string}          lang   - Current language shortcode.
 * @returns {Promise<object>}        Return array of BlocksEntity object Promise.
 * @see {@link https://doc.oneentry.cloud/docs/blocks OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getBlockByMarker = async (
  marker: string,
  lang: string,
): Promise<{
  isError: boolean;
  error?: IError;
  block?: IBlockEntity;
}> => {
  /** Get language code from LanguageEnum */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  /** Fetch block by marker and language from the API */
  try {
    /** Call the API to get block by marker and language */
    const data = await api.Blocks.getBlockByMarker(marker, langCode);

    /** Check if the response is an error */
    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, block: data };
    }
  } catch (error) {
    /** Handle API errors */
    const apiError = handleApiError('getBlockByMarker', error);
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
