import type { IError } from 'oneentry/dist/base/utils';
import type { ILocalEntity } from 'oneentry/dist/locales/localesInterfaces';

import { api } from '@/app/api';

export const getLocales = async (): Promise<{
  isError: boolean;
  locales?: ILocalEntity[] | IError;
}> => {
  const locales = await api.Locales.getLocales();
  return { isError: false, locales: locales };
};
