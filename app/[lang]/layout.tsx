import '@/app/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import type { JSX, ReactNode } from 'react';

import { AuthProvider } from '@/app/store/providers/AuthContext';
import { OpenDrawerProvider } from '@/app/store/providers/OpenDrawerContext';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import StoreProvider from '@/app/store/providers/StoreProvider';
import ClientProviders from '@/components/ClientProviders';
import BottomMenu from '@/components/layout/bottom-menu';
import Breadcrumbs from '@/components/layout/breadcrumbs';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import NavigationMenu from '@/components/layout/main-menu';
import Modal from '@/components/layout/modal';
import type { Locale } from '@/i18n-config';

import { LanguageEnum } from '../types/enum';
import { getDictionary } from './dictionaries';

/** Fonts settings */
const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
});

/**
 * Homepage static metadata.
 * @see {@link https://nextjs.org/docs/app/building-your-application/optimizing/metadata Next.js docs}
 */
export const metadata: Metadata = {
  title: {
    default: 'OneEntry Shop',
    template: '%s | OneEntry Shop',
  },
  description: 'OneEntry next-js shop',
  openGraph: {
    type: 'website',
    siteName: 'OneEntry Shop',
  },
  metadataBase: new URL(
    (
      process.env.NEXT_PUBLIC_PROJECT_URL ||
      process.env.NEXT_PUBLIC_VERCEL_URL ||
      'http://localhost:3000'
    ).replace(/\/$/, ''),
  ),
};

/**
 * Root layout.
 * @param   {object}                   props          - Layout props.
 * @param   {ReactNode}                props.children - Child components.
 * @param   {Promise<{lang: string;}>} props.params   - Page params with language.
 * @returns {Promise<JSX.Element>}                    JSX.Element - Root layout.
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/layout Next.js docs}
 */
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ lang: string }>;
}>): Promise<JSX.Element> {
  const { lang } = await params;
  /** set current lang to server provider */
  ServerProvider('lang', lang);

  /** set current langCode to server provider */
  const [langCode] = ServerProvider(
    'langCode',
    LanguageEnum[lang as keyof typeof LanguageEnum],
  );

  /** Get dictionary and set to server provider */
  const [dict] = ServerProvider('dict', await getDictionary(lang as Locale));

  return (
    <html lang={lang}>
      <body className={lato.className + ' flex flex-col min-h-screen'}>
        <StoreProvider>
          <AuthProvider langCode={langCode}>
            <OpenDrawerProvider>
              <Header />
              <NavigationMenu />
              <Breadcrumbs />
              <main className="grow">
                <ClientProviders>{children}</ClientProviders>
              </main>
              <Footer />
              <BottomMenu />
              <Modal lang={lang} dict={dict} />
            </OpenDrawerProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
