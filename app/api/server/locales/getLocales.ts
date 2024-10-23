import type { IError } from 'oneentry/dist/base/utils';
import type { ILocalEntity } from 'oneentry/dist/locales/localesInterfaces';

import { api } from '@/app/api';
import { typeError } from '@/components/utils';

export const getLocales = async (): Promise<{
  isError: boolean;
  locales?: ILocalEntity[] | IError;
}> => {
  const locales = await api.Locales.getLocales();

  if (typeError(locales)) {
    return { isError: true, locales: locales as IError };
  } else {
    return { isError: false, locales: locales };
  }
};
