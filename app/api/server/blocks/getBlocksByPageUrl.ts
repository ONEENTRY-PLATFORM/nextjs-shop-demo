import type { IError } from 'oneentry/dist/base/utils';
import type { IPositionBlock } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Get all blocks by page url.
 * @async
 * @param   {object}          props         - Handle props
 * @param   {string}          props.lang    - Current language shortcode
 * @param   {string}          props.pageUrl - Page URL
 * @returns {Promise<object>}               all blocks as an array of PositionBlock objects or an empty array [] (if there is no data) for the selected parent
 * @see {@link https://doc.oneentry.cloud/docs/blocks OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getBlocksByPageUrl = async ({
  lang,
  pageUrl,
}: {
  lang: string;
  pageUrl: string;
}): Promise<{
  isError: boolean;
  error?: IError;
  blocks?: IPositionBlock[];
}> => {
  /** Get language code from LanguageEnum */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  /** Fetch blocks by page URL and language from the API */
  try {
    /** Call the API to get blocks by page URL and language */
    const data = await api.Pages.getBlocksByPageUrl(pageUrl, langCode);

    /** Check if the response is an error */
    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, blocks: data };
    }
  } catch (error) {
    /** Handle API errors */
    const apiError = handleApiError('getBlocksByPageUrl', error);
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
