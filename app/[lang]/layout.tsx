import '@/app/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import type { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

import { AuthProvider } from '@/app/store/providers/AuthContext';
import { OpenDrawerProvider } from '@/app/store/providers/OpenDrawerContext';
import { useServerProvider } from '@/app/store/providers/ServerProvider';
import StoreProvider from '@/app/store/providers/StoreProvider';
import BottomMenu from '@/components/layout/bottom-menu';
import Breadcrumbs from '@/components/layout/breadcrumbs';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import NavigationMenu from '@/components/layout/main-menu';
import Modal from '@/components/layout/modal';
import type { Locale } from '@/i18n-config';

import IntroAnimations from '../animations/IntroAnimations';
import RegisterGSAP from '../animations/RegisterGSAP';
import TransitionProvider from '../animations/TransitionProvider';
import { LanguageEnum } from '../types/enum';
import { getDictionary } from './dictionaries';

// Fonts settings
const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
});

/**
 * Homepage static metadata
 * @see {@link https://nextjs.org/docs/app/building-your-application/optimizing/metadata Next.js docs}
 * @param params page params
 */
export const metadata: Metadata = {
  title: 'OneEntry Shop',
  description: 'OneEntry next-js shop',
  openGraph: {
    type: 'website',
  },
};

/**
 * Root layout
 * @async server component
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/layout Next.js docs}
 * @param params page params
 * @returns Root layout JSX.Element
 */
export default async function RootLayout({
  children,
  params: { lang },
}: Readonly<{ children: ReactNode; params: { lang: string } }>) {
  // set current lang to server provider
  useServerProvider('lang', lang);

  // set current langCode to server provider
  const [langCode] = useServerProvider(
    'langCode',
    LanguageEnum[lang as keyof typeof LanguageEnum],
  );

  // Get dictionary and set to server provider
  const [dict] = useServerProvider('dict', await getDictionary(lang as Locale));

  return (
    <html lang={langCode}>
      <body className={lato.className + ' flex flex-col min-h-screen'}>
        <StoreProvider>
          <AuthProvider langCode={langCode}>
            <OpenDrawerProvider>
              <Header />
              <NavigationMenu />
              <Breadcrumbs />
              <div className="grow p-5 pb-8 transition-transform duration-500">
                <TransitionProvider>{children}</TransitionProvider>
              </div>
              <Footer />
              <BottomMenu />
              <Modal lang={lang} dict={dict} />
            </OpenDrawerProvider>
          </AuthProvider>
        </StoreProvider>
        <RegisterGSAP />
        <IntroAnimations />
        <ToastContainer position="bottom-right" autoClose={2000} />
      </body>
    </html>
  );
}
