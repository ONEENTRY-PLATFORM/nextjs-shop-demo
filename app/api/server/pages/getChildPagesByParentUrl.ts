import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Get child pages object with information as an array.
 * @async
 * @param   {string}          url  - Page URL.
 * @param   {string}          lang - Current language shortcode.
 * @returns {Promise<object>}      Returns all created pages as an array of PageEntity objects or an empty array [] (if there is no data) for the selected parent
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getChildPagesByParentUrl = async (
  url: string,
  lang: string,
): Promise<{
  isError: boolean;
  error?: IError;
  pages?: IPagesEntity[] | IError;
}> => {
  /** Get language code from LanguageEnum */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  /** Fetch child pages by parent URL and language from the API */
  try {
    /** Call the API to get child pages by parent URL and language */
    const data = await api.Pages.getChildPagesByParentUrl(url, langCode);

    /** Check if the response is an error */
    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, pages: data };
    }
  } catch (error) {
    /** Handle API errors */
    const apiError = handleApiError('getChildPagesByParentUrl', error);
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
