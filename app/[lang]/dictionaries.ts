import 'server-only';
import '../../dictionaries/fr.ts';

import dictEn from '../../dictionaries/en.ts';
import dictFr from '../../dictionaries/fr.ts';
import type { Locale } from '../../i18n-config.ts';

const dictionaries = {
  en: () => dictEn('en_US'),
  fr: () => dictFr('fr_FR'),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale as keyof typeof dictionaries]?.() ?? dictionaries.en();
