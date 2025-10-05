import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Get page object with information about forms, blocks, menus, linked to the page by URL.
 * @async
 * @param   {string}          url  - Page URL.
 * @param   {string}          lang - Current language shortcode.
 * @returns {Promise<object>}      Returns PageEntity object
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 */
export const getPageByUrl = async (
  url: string,
  lang: string,
): Promise<{
  isError: boolean;
  error?: IError;
  page?: IPagesEntity;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  try {
    const data = await api.Pages.getPageByUrl(url, langCode);

    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, page: data };
    }
  } catch (error) {
    const apiError = handleApiError('getPageByUrl: ' + url, error);
    return {
      isError: true,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.message,
      } as IError,
    };
  }
};
