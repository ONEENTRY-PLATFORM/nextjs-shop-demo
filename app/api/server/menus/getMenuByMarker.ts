import type { IError } from 'oneentry/dist/base/utils';
import type { IMenusEntity } from 'oneentry/dist/menus/menusInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

/**
 * Get pages includes in menu by marker.
 *
 * @param marker Menu marker
 * @param lang Language code
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry docs}
 *
 * @returns a single menu object as a ContentMenu object with included pages
 */
export const getMenuByMarker = async (
  marker: string,
  lang: string,
): Promise<{
  isError: boolean;
  error?: IError;
  menu?: IMenusEntity;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  try {
    const data = await api.Menus.getMenusByMarker(marker, langCode);

    if (typeError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, menu: data };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { isError: true, error: e };
  }
};
