import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

/**
 * Get page object with information about forms, blocks, menus, linked to the page.
 *
 * @param id Page id
 * @param lang Current language shortcode
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry docs}
 *
 * @returns Returns PageEntity object
 */
export const getPageById = async (
  id: number,
  lang: string,
): Promise<{
  isError: boolean;
  error?: IError;
  page?: IPagesEntity;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  try {
    const data = await api.Pages.getPageById(id, langCode);

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
