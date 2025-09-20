import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { getCachedData, setCachedData } from '@/app/api/utils/cache';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Get page object with information about forms, blocks, menus, linked to the page.
 * @async
 * @param id Page id
 * @param lang Current language shortcode
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 *
 * @returns Returns PageEntity object
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
  const cacheKey = `page-${id}-${langCode}`;

  // Check cache first
  const cached = getCachedData<IPagesEntity>(cacheKey);
  if (cached) {
    return { isError: false, page: cached };
  }

  try {
    const data = await api.Pages.getPageById(id, langCode);

    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      // Cache the result
      setCachedData<IPagesEntity>(cacheKey, data);
      return { isError: false, page: data };
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
