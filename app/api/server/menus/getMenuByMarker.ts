import type { IError } from 'oneentry/dist/base/utils';
import type { IMenusEntity } from 'oneentry/dist/menus/menusInterfaces';

import { api } from '@/app/api';
import { getCachedData, setCachedData } from '@/app/api/utils/cache';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Get pages includes in menu by marker.
 * @async
 * @param marker Menu marker
 * @param lang Language code
 * @see {@link https://doc.oneentry.cloud/docs/menu OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 *
 * @returns a single menu object as a ContentMenu object with included pages
 */
export const getMenuByMarker = async (
  marker: string,
  lang: string,
): Promise<{
  isError: boolean;
  error?: IError;
  menu?: IMenusEntity;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const cacheKey = `menu-${marker}-${langCode}`;

  // Check cache first
  const cached = getCachedData<IMenusEntity>(cacheKey);
  if (cached) {
    return { isError: false, menu: cached };
  }

  try {
    const data = await api.Menus.getMenusByMarker(marker, langCode);

    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      // Cache the result
      setCachedData<IMenusEntity>(cacheKey, data);
      return { isError: false, menu: data };
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
