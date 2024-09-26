import type { IMenusEntity } from 'oneentry/dist/menus/menusInterfaces';

import { api } from '../api/api';

export const getMenuByMarker = async (
  marker: string,
  langCode: string,
): Promise<{
  menu?: IMenusEntity;
  isError: boolean;
  err?: unknown;
}> => {
  try {
    const menu = await api.Menus.getMenusByMarker(marker, langCode);
    return { isError: false, menu: menu };
  } catch (e) {
    return { isError: true, err: e };
  }
};
