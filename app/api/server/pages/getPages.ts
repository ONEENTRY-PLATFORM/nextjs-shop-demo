import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export async function getPages(lang: string): Promise<{
  pages?: IPagesEntity[];
  isError: boolean;
  err?: unknown;
}> {
  try {
    const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
    const pages = await api.Pages.getPages(langCode);
    return { isError: false, pages: pages };
  } catch (e) {
    return { isError: true, err: e };
  }
}
