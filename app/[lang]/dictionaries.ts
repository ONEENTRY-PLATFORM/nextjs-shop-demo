import 'server-only';

import type { IAttributeValues } from 'oneentry/dist/base/utils';

import { getBlockByMarker } from '@/app/api/';
import { LanguageEnum } from '@/app/types/enum.ts';

import { i18n, type Locale } from '../../i18n-config.ts';

/**
 * Get dictionary from block by marker
 *
 * @param lang Current language shortcode
 * @returns Current lang dictionary
 */
const dict = async (lang: string): Promise<IAttributeValues> => {
  try {
    // Ensure lang is a valid locale
    if (!i18n.locales.includes(lang as Locale)) {
      lang = i18n.defaultLocale;
    }

    const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

    // get block by marker from api
    const { block } = await getBlockByMarker('system_content', lang);

    // extract block attribute values
    const blockValues =
      block?.attributeValues[langCode] || block?.attributeValues;

    // Return the values or an empty object as fallback
    return (blockValues as IAttributeValues) || {};
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    // Return empty object as fallback
    return {};
  }
};

/**
 * Get dictionary
 * @param locale
 *
 * @returns Current lang dictionary
 */
export const getDictionary = async (
  locale: Locale,
): Promise<IAttributeValues> => {
  try {
    const dictionaries: Record<string, () => Promise<IAttributeValues>> =
      i18n.locales.reduce(
        (acc, lang) => {
          acc[lang] = () => dict(lang);
          return acc;
        },
        {} as Record<string, () => Promise<IAttributeValues>>,
      );

    const dictionary = dictionaries[locale]
      ? await dictionaries[locale]()
      : (await dictionaries[i18n.defaultLocale]?.()) || {};

    return dictionary || {};
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading dictionary for locale:', locale, error);
    // Ensure we always return an object, even if empty
    return {};
  }
};
