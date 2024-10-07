import type { IError } from 'oneentry/dist/base/utils';
import type { IMenusEntity } from 'oneentry/dist/menus/menusInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export const getMenuByMarker = async (
  marker: string,
  lang: string,
): Promise<{
  menu: IMenusEntity | IError;
  isError: boolean;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const menu = await api.Menus.getMenusByMarker(marker, langCode);
  return { isError: false, menu: menu };
};
