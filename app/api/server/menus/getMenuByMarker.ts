import type { IError } from 'oneentry/dist/base/utils';
import type { IMenusEntity } from 'oneentry/dist/menus/menusInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Get pages includes in menu by marker.
 * @async
 * @param   {string}          marker - Menu marker.
 * @param   {string}          lang   - Language code.
 * @returns {Promise<object>}        a single menu object as a ContentMenu object with included pages
 * @see {@link https://doc.oneentry.cloud/docs/menu OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getMenuByMarker = async (
  marker: string,
  lang: string,
): Promise<{
  isError: boolean;
  error?: IError;
  menu?: IMenusEntity;
}> => {
  /** Get language code from LanguageEnum */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  /** Fetch menu by marker and language from the API */
  try {
    /** Call the API to get menu by marker and language */
    const data = await api.Menus.getMenusByMarker(marker, langCode);

    /** Check if the response is an error */
    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, menu: data };
    }
  } catch (error) {
    /** Handle API errors */
    const apiError = handleApiError('getMenusByMarker', error);
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
