import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export const getPageById = async (
  id: number,
  lang: string,
): Promise<{
  isError: boolean;
  page: IPagesEntity | IError;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const page = await api.Pages.getPageById(id, langCode);
  return { isError: false, page: page };
};
