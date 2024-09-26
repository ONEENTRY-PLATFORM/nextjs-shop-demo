import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPageByUrl } from '@/app/api';
import CartPage from '@/components/layout/cart/CartPage';
import FavoritesPage from '@/components/layout/favorites/FavoritesPage';
import AboutPage from '@/components/layout/pages/AboutPage';
import ContactsPage from '@/components/layout/pages/ContactsPage';
import PaymentCanceled from '@/components/layout/pages/PaymentCanceled';
import PaymentSuccess from '@/components/layout/pages/PaymentSuccess';
import ServicesPage from '@/components/layout/pages/ServicesPage';
import PaymentPage from '@/components/layout/payment/PaymentPage';
import ProfilePage from '@/components/layout/profile/ProfilePage';

import WithSidebar from './WithSidebar';

export async function generateMetadata({
  params,
}: {
  params: { page: string };
}): Promise<Metadata> {
  const langCode = 'en_US';
  const { page, isError } = await getPageByUrl(params.page, langCode);

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

export default async function Page({ params }: { params: { page: string } }) {
  const langCode = 'en_US';
  const { page, isError } = await getPageByUrl(params.page, langCode);

  if (isError || !page) {
    return notFound();
  }

  const { pageUrl, templateIdentifier } = page;

  const pages = [
    {
      templateType: templateIdentifier,
      name: 'profile',
      component: <ProfilePage page={page} />,
    },
    {
      templateType: templateIdentifier,
      name: 'cart',
      component: <CartPage page={page} />,
    },
    {
      templateType: templateIdentifier,
      name: 'payment',
      component: <PaymentPage page={page} />,
    },
    {
      templateType: templateIdentifier,
      name: 'favorites',
      component: <FavoritesPage page={page} />,
    },
    {
      templateType: templateIdentifier,
      name: 'about_us',
      component: <AboutPage page={page} />,
    },
    {
      templateType: templateIdentifier,
      name: 'services',
      component: <ServicesPage page={page} />,
    },
    {
      templateType: templateIdentifier,
      name: 'contact_us',
      component: <ContactsPage page={page} />,
    },
    {
      templateType: templateIdentifier,
      name: 'payment_success',
      component: <PaymentSuccess page={page} />,
    },
    {
      templateType: templateIdentifier,
      name: 'payment_canceled',
      component: <PaymentCanceled page={page} />,
    },
  ];

  return (
    <div className="mx-auto flex min-h-80 w-full max-w-screen-xl flex-col overflow-hidden">
      {pages.map((p, i) => {
        if (pageUrl !== p.name) {
          return;
        }

        return p.templateType === 'withSidebar' ? (
          <WithSidebar data={''} key={i}>
            {p.component}
          </WithSidebar>
        ) : (
          <div key={i}>{p.component}</div>
        );
      })}
    </div>
  );
}
