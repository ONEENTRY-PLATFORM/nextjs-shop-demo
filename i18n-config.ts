export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'fr'],
  localesData: ['en-US', 'fr-FR'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
