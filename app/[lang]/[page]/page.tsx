import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { FC } from 'react';

import { getPageByUrl } from '@/app/api';
import { useServerProvider } from '@/app/store/providers/ServerProvider';
import AboutPage from '@/components/pages/AboutPage';
import CartPage from '@/components/pages/CartPage';
import ContactsPage from '@/components/pages/ContactsPage';
import FavoritesPage from '@/components/pages/FavoritesPage';
import PaymentCanceled from '@/components/pages/PaymentCanceled';
import PaymentPage from '@/components/pages/PaymentPage';
import PaymentSuccess from '@/components/pages/PaymentSuccess';
import ProfilePage from '@/components/pages/ProfilePage';
import ServicesPage from '@/components/pages/ServicesPage';

import WithSidebar from './WithSidebar';

export async function generateMetadata({
  params,
}: {
  params: { page: string; lang: string };
}): Promise<Metadata> {
  const { page, isError } = await getPageByUrl(params.page, params.lang);

  if (isError || !page) {
    return notFound();
  }

  const { localizeInfos } = page;

  return {
    title: localizeInfos.title,
    description: localizeInfos.title,
    openGraph: {
      type: 'article',
    },
  };
}

const Page: FC<{ params: { page: string; lang: string } }> = async ({
  params,
}) => {
  const lang = params.lang;
  const [dict] = useServerProvider('dict');
  const { page, isError } = await getPageByUrl(params.page, lang);

  if (isError || !page) {
    return notFound();
  }

  const { pageUrl, templateIdentifier } = page;

  const pages = [
    {
      templateType: templateIdentifier,
      name: 'profile',
      component: <ProfilePage lang={lang} />,
    },
    {
      templateType: templateIdentifier,
      name: 'cart',
      component: <CartPage page={page} lang={lang} />,
    },
    {
      templateType: templateIdentifier,
      name: 'payment',
      component: <PaymentPage page={page} lang={lang} />,
    },
    {
      templateType: templateIdentifier,
      name: 'favorites',
      component: <FavoritesPage page={page} lang={lang} dict={dict} />,
    },
    {
      templateType: templateIdentifier,
      name: 'about_us',
      component: <AboutPage page={page} lang={lang} />,
    },
    {
      templateType: templateIdentifier,
      name: 'services',
      component: <ServicesPage page={page} lang={lang} />,
    },
    {
      templateType: templateIdentifier,
      name: 'contact_us',
      component: <ContactsPage page={page} lang={lang} />,
    },
    {
      templateType: templateIdentifier,
      name: 'payment_success',
      component: <PaymentSuccess page={page} lang={lang} />,
    },
    {
      templateType: templateIdentifier,
      name: 'payment_canceled',
      component: <PaymentCanceled page={page} lang={lang} />,
    },
  ];

  return (
    <div className="mx-auto flex min-h-80 w-full max-w-screen-xl flex-col overflow-hidden">
      {pages.map((p, i) => {
        if (pageUrl !== p.name) {
          return;
        }
        return p.templateType === 'withSidebar' ? (
          <WithSidebar lang={lang} key={i}>
            {p.component}
          </WithSidebar>
        ) : (
          <div key={i}>{p.component}</div>
        );
      })}
    </div>
  );
};

export default Page;
