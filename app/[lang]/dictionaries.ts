/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';

import type { IAttributeValues } from 'oneentry/dist/base/utils';

import { getBlockByMarker } from '@/app/api/';
import { LanguageEnum } from '@/app/types/enum.ts';

import { i18n, type Locale } from '../../i18n-config.ts';

/**
 * Get dictionary from block by marker
 * @param lang Current language shortcode
 *
 * @returns Current lang dictionary
 */
const dict = async (lang: string): Promise<any> => {
  try {
    const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

    // get block by marker from api
    const { block } = await getBlockByMarker('system_content', lang);

    // extract block attribute values
    const blockValues =
      block?.attributeValues[langCode] || block?.attributeValues;

    return { ...(blockValues as IAttributeValues) };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
};

/**
 * Get dictionary
 * @param locale
 *
 * @returns Current lang dictionary
 */
export const getDictionary = async (locale: Locale) => {
  const dictionaries = i18n.locales?.reduce(
    (a, v) => ({ ...a, [v]: () => dict(v) }),
    {},
  ) as any;

  return (
    dictionaries[locale as keyof typeof dictionaries]?.() ?? dictionaries.en()
  );
};
