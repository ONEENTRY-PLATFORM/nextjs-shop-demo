import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPageByUrl } from '@/app/api/serverSideProps';
import CartPage from '@/components/layout/cart/CartPage';
import FavoritesPage from '@/components/layout/favorites/FavoritesPage';
import AboutPage from '@/components/layout/pages/AboutPage';
import ServicesPage from '@/components/layout/pages/ServicesPage';
import PaymentPage from '@/components/layout/payment/PaymentPage';
import LogoutPage from '@/components/layout/profile/LogoutPage';
import ProfilePage from '@/components/layout/profile/ProfilePage';

import WithSidebar from './WithSidebar';

const pages = [
  {
    templateType: 'withSidebar',
    name: 'profile',
    title: 'profile',
    component: <ProfilePage />,
  },
  {
    templateType: 'withSidebar',
    name: 'cart',
    title: 'cart',
    component: <CartPage />,
  },
  {
    templateType: 'withSidebar',
    name: 'payment',
    title: 'payment',
    component: <PaymentPage />,
  },
  {
    templateType: 'withSidebar',
    name: 'favorites',
    title: 'favorites',
    component: <FavoritesPage />,
  },
  {
    templateType: '',
    name: 'about_us',
    title: 'About us',
    component: <AboutPage />,
  },
  {
    templateType: '',
    name: 'services',
    title: 'Services',
    component: <ServicesPage />,
  },
  {
    templateType: 'withSidebar',
    name: 'logout',
    title: 'logout',
    component: <LogoutPage />,
  },
];

export async function generateMetadata({
  params,
}: {
  params: { page: string };
}): Promise<Metadata> {
  const { page, isError } = await getPageByUrl(params.page, 'en_US');

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
  const { page, isError } = await getPageByUrl(params.page, 'en_US');

  if (isError || !page) {
    return notFound();
  }

  const { pageUrl } = page;

  return (
    <div className="mx-auto flex min-h-80 w-full max-w-screen-xl flex-col overflow-hidden">
      {pages.map((p, _i) => {
        if (pageUrl !== p.name) {
          return;
        }

        return p.templateType === 'withSidebar' ? (
          <WithSidebar key={_i}>{p.component}</WithSidebar>
        ) : (
          <div key={_i}>{p.component}</div>
        );
      })}
    </div>
  );
}
