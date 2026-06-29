import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import { cache } from 'react';

import { getApi, isError } from '@/app/api';
import { toLangCode } from '@/app/types/enum';

/**
 * Get page object with information about forms, blocks, menus, linked to the page by URL.
 * Wrapped in React cache() to deduplicate requests within a single render.
 * @async
 * @param   {string}          url  - Page URL.
 * @param   {string}          lang - Current language shortcode.
 * @returns {Promise<object>}      Returns PageEntity object
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 */
export const getPageByUrl = cache(
  async (
    url: string,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    page?: IPagesEntity;
  }> => {
    const langCode = toLangCode(lang);

    const data = await getApi().Pages.getPageByUrl(url, langCode);

    if (isError(data)) {
      return { isError: true, error: data };
    }

    return { isError: false, page: data };
  },
);
