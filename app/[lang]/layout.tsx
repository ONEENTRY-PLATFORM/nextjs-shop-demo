import './globals.css';

import type { Metadata } from 'next';
import { Lato } from 'next/font/google';

import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import NavigationMenu from '@/components/layout/main-menu/NavigationMenu';
import Modal from '@/components/layout/modal/ModalLayout';

import { AuthProvider } from '../store/providers/AuthContext';
import { ContentContextProvider } from '../store/providers/ContentContext';
import { LanguageProvider } from '../store/providers/LanguageContext';
import { OpenDrawerProvider } from '../store/providers/OpenDrawerContext';
import { useServerProvider } from '../store/providers/ServerProvider';
import StoreProvider from '../store/providers/StoreProvider';
import { LanguageEnum } from '../types/enum';

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

  useServerProvider('lang', lang);

  return (
    <html lang={langCode}>
      <body className={lato.className + ' flex flex-col min-h-screen'}>
        <StoreProvider>
          <LanguageProvider lang={lang}>
            <AuthProvider langCode={langCode}>
              <ContentContextProvider langCode={langCode}>
                <OpenDrawerProvider>
                  <Header lang={lang} />
                  <NavigationMenu lang={lang} />
                  <div className="grow">{children}</div>
                  <Footer lang={lang} />
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
