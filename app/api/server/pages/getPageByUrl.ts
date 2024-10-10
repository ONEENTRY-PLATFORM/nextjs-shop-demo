import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
// import { typeError } from '@/components/utils';

export const getPageByUrl = async (
  url: string,
  lang: string,
): Promise<{
  isError: boolean;
  page?: IPagesEntity | undefined;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const page = await api.Pages.getPageByUrl(url, langCode);
  // console.log(typeError(page));

  // if (typeError(page)) {
  //   return { isError: true };
  // } else {
  return { isError: false, page: page as IPagesEntity | undefined };
  // }
};
