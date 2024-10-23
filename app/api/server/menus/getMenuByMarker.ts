import type { IError } from 'oneentry/dist/base/utils';
import type { IMenusEntity } from 'oneentry/dist/menus/menusInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

export const getMenuByMarker = async (
  marker: string,
  lang: string,
): Promise<{
  isError: boolean;
  menu: IMenusEntity | IError;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const menu = await api.Menus.getMenusByMarker(marker, langCode);

  if (typeError(menu)) {
    return { isError: true, menu: menu as IError };
  } else {
    return { isError: false, menu: menu };
  }
};
