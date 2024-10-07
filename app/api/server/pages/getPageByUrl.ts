import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export const getPageByUrl = async (
  url: string,
  lang: string,
): Promise<{
  page?: IPagesEntity | IError;
  isError: boolean;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const page = await api.Pages.getPageByUrl(url, langCode);
  return { isError: false, page: page };
};
