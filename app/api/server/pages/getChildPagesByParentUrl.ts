import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export const getChildPagesByParentUrl = async (
  url: string,
  lang: string,
): Promise<{
  isError: boolean;
  pages?: IPagesEntity[] | IError;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const pages = await api.Pages.getChildPagesByParentUrl(url, langCode);
  return { isError: false, pages: pages };
};
