import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { getCachedData, setCachedData } from '@/app/api/utils/cache';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Get child pages object with information as an array.
 * @async
 * @param url Page URL
 * @param lang Current language shortcode
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 *
 * @returns Returns all created pages as an array of PageEntity objects or an empty array [] (if there is no data) for the selected parent
 */
export const getChildPagesByParentUrl = async (
  url: string,
  lang: string,
): Promise<{
  isError: boolean;
  error?: IError;
  pages?: IPagesEntity[] | IError;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const cacheKey = `child-pages-${url}-${langCode}`;

  // Check cache first
  const cached = getCachedData<IPagesEntity[]>(cacheKey);
  if (cached) {
    return { isError: false, pages: cached };
  }

  try {
    const data = await api.Pages.getChildPagesByParentUrl(url, langCode);

    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      // Cache the result
      setCachedData<IPagesEntity[]>(cacheKey, data);
      return { isError: false, pages: data };
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
