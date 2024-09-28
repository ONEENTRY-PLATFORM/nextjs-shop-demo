import './globals.css';

import type { Metadata } from 'next';
import { Lato } from 'next/font/google';

import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import NavigationMenu from '@/components/layout/main-menu/NavigationMenu';
import Modal from '@/components/layout/modal/ModalLayout';
import type { Locale } from '@/i18n-config';

import { AuthProvider } from '../store/providers/AuthContext';
import { ContentContextProvider } from '../store/providers/ContentContext';
import { LanguageProvider } from '../store/providers/LanguageContext';
import { OpenDrawerProvider } from '../store/providers/OpenDrawerContext';
import StoreProvider from '../store/providers/StoreProvider';
import { LanguageEnum } from '../types/enum';
import { getDictionary } from './dictionaries';

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
});

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
}: Readonly<{ children: React.ReactNode; params: { lang: string } }>) {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const dict = await getDictionary(lang as Locale);

  return (
    <html lang={langCode}>
      <body className={lato.className + ' flex flex-col min-h-screen'}>
        <StoreProvider>
          <LanguageProvider lang={lang}>
            <AuthProvider langCode={langCode}>
              <ContentContextProvider dict={dict}>
                <OpenDrawerProvider>
                  <Header lang={lang} dict={dict} />
                  <NavigationMenu lang={lang} />
                  <div className="grow">{children}</div>
                  <Footer lang={lang} dict={dict} />
                  <Modal lang={lang} />
                </OpenDrawerProvider>
              </ContentContextProvider>
            </AuthProvider>
          </LanguageProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
