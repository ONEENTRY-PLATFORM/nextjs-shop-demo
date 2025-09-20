import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { getCachedData, setCachedData } from '@/app/api/utils/cache';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Get page object with information about forms, blocks, menus, linked to the page by URL.
 * @async
 * @param {string} [url] - Page URL
 * @param {string} [lang] - Current language shortcode
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 *
 * @returns Returns PageEntity object
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
  const cacheKey = `page-url-${url}-${langCode}`;

  // Check cache first
  const cached = getCachedData<IPagesEntity>(cacheKey);
  if (cached) {
    return { isError: false, page: cached };
  }

  try {
    const data = await api.Pages.getPageByUrl(url, langCode);

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
