import 'server-only';

import type { Locale } from '../../i18n-config.ts';
import { getBlockByMarker } from '../api/index.ts';
import { LanguageEnum } from '../types/enum.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dict = async (lang: string): Promise<any> => {
  try {
    const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
    const { block } = await getBlockByMarker('system_content', lang);
    // const { attribute } = await getSingleAttributeByMarkerSet({
    //   attributeMarker: 'system_content',
    //   setMarker: 'cart_item_options',
    //   langCode,
    // });
    const blockValues =
      block?.attributeValues[langCode] || block?.attributeValues;
    return { ...blockValues };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // console.log(e);
  }
};

const dictionaries = {
  en: () => dict('en'),
  fr: () => dict('fr'),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale as keyof typeof dictionaries]?.() ?? dictionaries.en();
