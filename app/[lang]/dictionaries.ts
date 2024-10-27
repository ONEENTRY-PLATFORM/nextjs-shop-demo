import 'server-only';

import type { IAttributeValues } from 'oneentry/dist/base/utils';

import type { Locale } from '../../i18n-config.ts';
import { getBlockByMarker } from '../api/index.ts';
import { LanguageEnum } from '../types/enum.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dict = async (lang: string): Promise<any> => {
  try {
    const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
    const { block } = await getBlockByMarker('system_content', lang);
    const blockValues =
      block?.attributeValues[langCode] || block?.attributeValues;

    return { ...(blockValues as IAttributeValues) };
  } catch (e) {
    console.log(e);
  }
};

const dictionaries = {
  en: () => dict('en'),
  fr: () => dict('fr'),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale as keyof typeof dictionaries]?.() ?? dictionaries.en();
