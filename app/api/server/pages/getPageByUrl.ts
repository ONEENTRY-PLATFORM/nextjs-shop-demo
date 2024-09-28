import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export const getPageByUrl = async (
  url: string,
  lang: string,
): Promise<{
  page?: IPagesEntity;
  isError: boolean;
  error?: unknown;
}> => {
  try {
    const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
    const page = await api.Pages.getPageByUrl(url, langCode);
    return { isError: false, page: page };
  } catch (error) {
    return { isError: true, error: error };
  }
};
