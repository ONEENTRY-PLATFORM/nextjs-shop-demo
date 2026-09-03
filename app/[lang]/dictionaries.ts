import 'server-only';

import type { IAttributeValues } from 'oneentry/types';

import { getBlockByMarker } from '@/app/api/server/blocks/getBlockByMarker';

import { i18n, type Locale } from '../../i18n-config.ts';

/**
 * Get dictionary from block by marker
 * @param   {string}                    lang - Current language shortcode
 * @returns {Promise<IAttributeValues>}      Current lang dictionary
 */
const dict = async (lang: string): Promise<IAttributeValues> => {
  try {
    /** Ensure lang is a valid locale */
    if (!i18n.locales.includes(lang as Locale)) {
      lang = i18n.defaultLocale;
    }

    /** get block by marker from api */
    const { block } = await getBlockByMarker('system_content', lang);

    /**
     * The SDK already unwraps the requested locale, so `attributeValues` is
     * the flat marker→value map — no per-locale indexing needed.
     */
    return block?.attributeValues || {};
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    /** Return empty object as fallback */
    return {};
  }
};

/**
 * Get dictionary
 * @param   {Locale}                    locale - Current locale
 * @returns {Promise<IAttributeValues>}        Current lang dictionary
 */
export const getDictionary = async (
  locale: Locale,
): Promise<IAttributeValues> => {
  /** Initialize dictionaries object with locale keys */
  try {
    /** Create a dictionary loader for each locale */
    const dictionaries: Record<string, () => Promise<IAttributeValues>> =
      i18n.locales.reduce(
        (acc, lang) => {
          acc[lang] = () => dict(lang);
          return acc;
        },
        {} as Record<string, () => Promise<IAttributeValues>>,
      );

    /** Load the dictionary for the specified locale or use default */
    const dictionary = dictionaries[locale]
      ? await dictionaries[locale]()
      : (await dictionaries[i18n.defaultLocale]?.()) || {};

    /** Return the loaded dictionary or empty object as fallback */
    return dictionary || {};
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error loading dictionary for locale:', locale, error);
    /** Ensure we always return an object, even if empty */
    return {};
  }
};
