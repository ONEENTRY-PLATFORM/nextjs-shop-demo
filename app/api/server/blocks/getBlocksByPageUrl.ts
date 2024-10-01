import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export const getBlocksByPageUrl = async ({
  pageUrl,
  lang,
}: {
  pageUrl: string;
  lang: string;
}) => {
  try {
    const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
    const blocks = await api.Pages.getBlocksByPageUrl(pageUrl, langCode);
    return { isError: false, blocks: blocks };
  } catch (e) {
    return { isError: true, err: e };
  }
};
