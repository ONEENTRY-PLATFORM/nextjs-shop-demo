import type { IError } from 'oneentry/dist/base/utils';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

export const getBlocksByPageUrl = async ({
  pageUrl,
  lang,
}: {
  pageUrl: string;
  lang: string;
}) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const blocks = await api.Pages.getBlocksByPageUrl(pageUrl, langCode);

  if (typeError(blocks)) {
    return { isError: true, blocks: blocks as IError };
  } else {
    return { isError: false, blocks: blocks };
  }
};
