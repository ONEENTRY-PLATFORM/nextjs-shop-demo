import type { ILocalEntity } from 'oneentry/dist/locales/localesInterfaces';

import { api } from '@/app/api';

export const getLocales = async (): Promise<{
  locales?: ILocalEntity[];
  isError: boolean;
  err?: unknown;
}> => {
  try {
    const locales = await api.Locales.getLocales();
    return { isError: false, locales: locales };
  } catch (e) {
    return { isError: true, err: e };
  }
};
