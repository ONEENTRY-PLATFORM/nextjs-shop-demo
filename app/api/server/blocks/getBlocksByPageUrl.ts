import type { IError } from 'oneentry/dist/base/utils';
import type { IPositionBlock } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

export const getBlocksByPageUrl = async ({
  pageUrl,
  lang,
}: {
  pageUrl: string;
  lang: string;
}): Promise<{
  isError: boolean;
  error?: IError;
  blocks?: IPositionBlock[];
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const data = await api.Pages.getBlocksByPageUrl(pageUrl, langCode);

  if (typeError(data)) {
    return { isError: true, error: data };
  } else {
    return { isError: false, blocks: data };
  }
};
