import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export const getPageById = async (
  id: number,
  lang: string,
): Promise<{
  page?: IPagesEntity;
  isError: boolean;
  err?: unknown;
}> => {
  try {
    const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
    const page = await api.Pages.getPageById(id, langCode);
    return { isError: false, page: page };
  } catch (err) {
    return { isError: true, err: err };
  }
};
