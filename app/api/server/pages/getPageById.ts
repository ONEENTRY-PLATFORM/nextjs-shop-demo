import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Get page object with information about forms, blocks, menus, linked to the page.
 * @async
 * @param   {number}          id   - Page id.
 * @param   {string}          lang - Current language shortcode.
 * @returns {Promise<object>}      Returns PageEntity object
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getPageById = async (
  id: number,
  lang: string,
): Promise<{
  isError: boolean;
  error?: IError;
  page?: IPagesEntity;
}> => {
  /** Get language code from LanguageEnum */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  /** Fetch page by ID and language from the API */
  try {
    /** Call the API to get page by ID and language */
    const data = await api.Pages.getPageById(id, langCode);

    /** Check if the response is an error */
    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, page: data };
    }
  } catch (error) {
    /** Handle API errors */
    const apiError = handleApiError('getPageById', error);
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
