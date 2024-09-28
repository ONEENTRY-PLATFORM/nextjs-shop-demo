import 'server-only';

import type { Locale } from '../../i18n-config.ts';

const dictionaries = {
  en: () => import('../../dictionaries/en.ts').then((module) => module.default),
  fr: () => import('../../dictionaries/fr.ts').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale as keyof typeof dictionaries]?.() ?? dictionaries.en();
