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
  params,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: Readonly<{ children: React.ReactNode; params: any }>) {
  const langCode = LanguageEnum[params.lang as keyof typeof LanguageEnum];
  return (
    <html lang={langCode}>
      <body className={lato.className + ' flex flex-col min-h-screen'}>
        <StoreProvider>
          <LanguageProvider>
            <AuthProvider>
              <ContentContextProvider>
                <OpenDrawerProvider>
                  <Header params={params} />
                  <NavigationMenu params={params} />
                  <div className="grow">{children}</div>
                  <Footer params={params} />
                  <Modal params={params} />
                </OpenDrawerProvider>
              </ContentContextProvider>
            </AuthProvider>
          </LanguageProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
