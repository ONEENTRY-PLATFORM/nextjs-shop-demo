import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import NavigationMenu from '@/components/layout/main-menu/NavigationMenu';
import Modal from '@/components/layout/modal/ModalLayout';

import { AuthProvider } from './store/providers/AuthContext';
import { ContentContextProvider } from './store/providers/ContentContext';
import { LanguageProvider } from './store/providers/LanguageContext';
import { OpenDrawerProvider } from './store/providers/OpenDrawerContext';
import StoreProvider from './store/providers/StoreProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OneEntry Shop',
  description: 'OneEntry next-js shop',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <LanguageProvider>
            <AuthProvider>
              <ContentContextProvider>
                <OpenDrawerProvider>
                  <Header />
                  <NavigationMenu />
                  {children}
                  <Footer />
                  <Modal />
                </OpenDrawerProvider>
              </ContentContextProvider>
            </AuthProvider>
          </LanguageProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
