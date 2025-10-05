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
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  try {
    const data = await api.Pages.getPageById(id, langCode);

    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, page: data };
    }
  } catch (error) {
    const apiError = handleApiError('getPageById', error);
    return {
      isError: true,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.message,
      } as IError,
    };
  }
};
