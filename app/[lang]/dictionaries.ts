import 'server-only';
import '../../dictionaries/fr.ts';

import dict from '@/app/api/server/dict';

import type { Locale } from '../../i18n-config.ts';

const dictionaries = {
  en: () => dict('en_US'),
  fr: () => dict('fr_FR'),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale as keyof typeof dictionaries]?.() ?? dictionaries.en();
