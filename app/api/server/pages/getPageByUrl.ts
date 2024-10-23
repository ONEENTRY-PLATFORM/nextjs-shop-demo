import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

export const getPageByUrl = async (
  url: string,
  lang: string,
): Promise<{
  isError: boolean;
  page: IPagesEntity | IError;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const page = await api.Pages.getPageByUrl(url, langCode);

  if (typeError(page)) {
    return { isError: true, page: page as IError };
  } else {
    return { isError: false, page: page as IPagesEntity };
  }
};
