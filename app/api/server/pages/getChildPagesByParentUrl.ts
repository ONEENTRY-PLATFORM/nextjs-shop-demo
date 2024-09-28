import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export const getChildPagesByParentUrl = async (
  url: string,
  lang: string,
): Promise<{
  pages?: IPagesEntity[];
  isError: boolean;
  err?: unknown;
}> => {
  try {
    const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
    const pages = await api.Pages.getChildPagesByParentUrl(url, langCode);
    return { isError: false, pages: pages };
  } catch (err) {
    return { isError: true, err: err };
  }
};
