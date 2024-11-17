import type { IError } from 'oneentry/dist/base/utils';
import type { ILocalEntity } from 'oneentry/dist/locales/localesInterfaces';

import { api } from '@/app/api';
import { typeError } from '@/components/utils';

/**
 * Get all active language localization objects.
 *
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry docs}
 *
 * @returns an array of LocaleEntity objects Promise
 */
export const getLocales = async (): Promise<{
  isError: boolean;
  error?: IError;
  locales?: ILocalEntity[];
}> => {
  try {
    const data = await api.Locales.getLocales();

    if (typeError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, locales: data };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { isError: true, error: e };
  }
};
