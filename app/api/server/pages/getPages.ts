import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

export async function getPages(lang: string): Promise<{
  isError: boolean;
  pages?: IPagesEntity[] | IError;
}> {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const pages = await api.Pages.getPages(langCode);

  if (typeError(pages)) {
    return { isError: true, pages: pages as IError };
  } else {
    return { isError: false, pages: pages as IPagesEntity[] };
  }
}
