import type { IError } from 'oneentry/dist/base/utils';
import type { ILocalEntity } from 'oneentry/dist/locales/localesInterfaces';

import { getApi } from '@/app/api';
import { isIError } from '@/app/utils/errorHandler';

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
  const data = await getApi().Locales.getLocales();

  if (isIError(data)) {
    return { isError: true, error: data };
  }

  return { isError: false, locales: data };
};
