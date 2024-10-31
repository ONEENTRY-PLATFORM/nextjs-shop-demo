import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

export async function getPages(lang: string): Promise<{
  isError: boolean;
  error?: IError;
  pages?: IPagesEntity[];
}> {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  try {
    const data = await api.Pages.getPages(langCode);

    if (typeError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, pages: data };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { isError: true, error: e };
  }
}
