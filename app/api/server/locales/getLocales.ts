import type { IError } from 'oneentry/dist/base/utils';
import type { ILocalEntity } from 'oneentry/dist/locales/localesInterfaces';

import { api } from '@/app/api';

export const getLocales = async (): Promise<{
  locales?: ILocalEntity[] | IError;
  isError: boolean;
  err?: unknown;
}> => {
  const locales = await api.Locales.getLocales();
  return { isError: false, locales: locales };
};
