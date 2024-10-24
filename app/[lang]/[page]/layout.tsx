/* eslint-disable @typescript-eslint/no-unused-vars */
import '@/app/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { useServerProvider } from '@/app/store/providers/ServerProvider';
import { LanguageEnum } from '@/app/types/enum';
import type { Locale } from '@/i18n-config';

import { getDictionary } from '../dictionaries';

export const metadata: Metadata = {
  title: 'OneEntry Shop',
  description: 'OneEntry next-js shop',
  openGraph: {
    type: 'website',
  },
};

export default async function RootLayout({
  children,
  params: { lang },
}: Readonly<{ children: ReactNode; params: { lang: string } }>) {
  const [dict] = useServerProvider('dict', await getDictionary(lang as Locale));

  useServerProvider('lang', lang);
  const [langCode] = useServerProvider(
    'langCode',
    LanguageEnum[lang as keyof typeof LanguageEnum],
  );

  return children;
}
