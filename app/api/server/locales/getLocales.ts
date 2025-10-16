import type { IError } from 'oneentry/dist/base/utils';
import type { ILocalEntity } from 'oneentry/dist/locales/localesInterfaces';

import { api } from '@/app/api';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Get all active language localization objects.
 * @async
 * @returns {Promise<object>} an array of LocaleEntity objects Promise
 * @see {@link https://doc.oneentry.cloud/docs/languages OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getLocales = async (): Promise<{
  isError: boolean;
  error?: IError;
  locales?: ILocalEntity[];
}> => {
  /** Fetch locales from the API */
  try {
    /** Call the API to get locales */
    const data = await api.Locales.getLocales();

    /** Check if the response is an error */
    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, locales: data };
    }
  } catch (error) {
    /** Handle API errors */
    const apiError = handleApiError('getLocales', error);
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
