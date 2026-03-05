import type { IError } from 'oneentry/dist/base/utils';
import type { IMenusEntity } from 'oneentry/dist/menus/menusInterfaces';
import { cache } from 'react';

import { getApi } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { isIError } from '@/app/utils/errorHandler';

/**
 * Get pages includes in menu by marker.
 * Wrapped in React cache() to deduplicate requests within a single render.
 * @async
 * @param   {string}          marker - Menu marker.
 * @param   {string}          lang   - Language code.
 * @returns {Promise<object>}        a single menu object as a ContentMenu object with included pages
 * @see {@link https://doc.oneentry.cloud/docs/menu OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getMenuByMarker = cache(
  async (
    marker: string,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    menu?: IMenusEntity;
  }> => {
    const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

    const data = await getApi().Menus.getMenusByMarker(marker, langCode);

    if (isIError(data)) {
      return { isError: true, error: data };
    }

    return { isError: false, menu: data };
  },
);
