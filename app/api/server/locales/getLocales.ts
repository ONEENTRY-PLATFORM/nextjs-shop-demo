import type { IError } from 'oneentry/dist/base/utils';
import type { ILocalEntity } from 'oneentry/dist/locales/localesInterfaces';

import { api } from '@/app/api';
import { getCachedData, setCachedData } from '@/app/api/utils/cache';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Get all active language localization objects.
 * @async
 * @see {@link https://doc.oneentry.cloud/docs/languages OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 *
 * @returns an array of LocaleEntity objects Promise
 */
export const getLocales = async (): Promise<{
  isError: boolean;
  error?: IError;
  locales?: ILocalEntity[];
}> => {
  const cacheKey = 'locales';

  // Check cache first
  const cached = getCachedData<ILocalEntity[]>(cacheKey);
  if (cached) {
    return { isError: false, locales: cached };
  }

  try {
    const data = await api.Locales.getLocales();

    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      // Cache the result
      setCachedData<ILocalEntity[]>(cacheKey, data);
      return { isError: false, locales: data };
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
