import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

/**
 * Get page object with information about forms, blocks, menus, linked to the page by URL.
 * @async
 * @param {string} [url] - Page URL
 * @param {string} [lang] - Current language shortcode
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 *
 * @returns Returns PageEntity object
 */
export const getPageByUrl = async (
  url: string,
  lang: string,
): Promise<{
  isError: boolean;
  error?: IError;
  page?: IPagesEntity;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  try {
    const data = await api.Pages.getPageByUrl(url, langCode);

    if (typeError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, page: data };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { isError: true, error: e };
  }
};
