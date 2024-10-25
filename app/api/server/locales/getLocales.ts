import type { IError } from 'oneentry/dist/base/utils';
import type { ILocalEntity } from 'oneentry/dist/locales/localesInterfaces';

import { api } from '@/app/api';
import { typeError } from '@/components/utils';

export const getLocales = async (): Promise<{
  isError: boolean;
  error?: IError;
  locales?: ILocalEntity[];
}> => {
  const data = await api.Locales.getLocales();

  if (typeError(data)) {
    return { isError: true, error: data };
  } else {
    return { isError: false, locales: data };
  }
};
