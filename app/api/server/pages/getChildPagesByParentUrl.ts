import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

/**
 * Get child pages object with information as an array.
 *
 * @param url Page URL
 * @param lang Current language shortcode
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry docs}
 *
 * @returns Returns all created pages as an array of PageEntity objects or an empty array [] (if there is no data) for the selected parent
 */
export const getChildPagesByParentUrl = async (
  url: string,
  lang: string,
): Promise<{
  isError: boolean;
  error?: IError;
  pages?: IPagesEntity[] | IError;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  try {
    const data = await api.Pages.getChildPagesByParentUrl(url, langCode);

    if (typeError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, pages: data };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { isError: true, error: e };
  }
};
