import 'server-only';

import type { Locale } from '../../i18n-config.ts';
import { getBlockByMarker } from '../api/index.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dict = async (langCode: string): Promise<any> => {
  try {
    const { block } = await getBlockByMarker('system_content', langCode);
    // const { attribute } = await getSingleAttributeByMarkerSet({
    //   attributeMarker: 'system_content',
    //   setMarker: 'cart_item_options',
    //   langCode,
    // });
    return { ...block?.attributeValues };
  } catch (e) {
    // console.log(e);
  }
};

const dictionaries = {
  en: () => dict('en_US'),
  fr: () => dict('fr_FR'),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale as keyof typeof dictionaries]?.() ?? dictionaries.en();
