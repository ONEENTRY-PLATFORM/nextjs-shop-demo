import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// import * as pageComponents from '../../components/layout/pages';
import { getPageByUrl } from '@/app/api/serverSideProps';
import CartPage from '@/components/layout/cart/CartPage';
import FavoritesPage from '@/components/layout/favorites/FavoritesPage';
import AboutPage from '@/components/layout/pages/AboutPage';
import ServicesPage from '@/components/layout/pages/ServicesPage';
import PaymentPage from '@/components/layout/payment/PaymentPage';
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
    // openGraph: {
    //   publishedTime: page.createdAt,
    //   modifiedTime: page.updatedAt,
    //   type: 'article',
    // },
  };
}

export default async function Page({ params }: { params: { page: string } }) {
  const { page, isError } = await getPageByUrl(params.page, 'en_US');

  if (isError || !page) {
    return notFound();
  }

  const { pageUrl } = page;

  return (
    <div className="mx-auto flex min-h-80 w-full max-w-screen-xl flex-col">
      {pages.map((page, _i) => {
        if (pageUrl !== page.name) {
          return;
        }

        return page.templateType === 'withSidebar' ? (
          <WithSidebar key={_i}>{page.component}</WithSidebar>
        ) : (
          <div key={_i}>{page.component}</div>
        );
      })}
    </div>
  );
}
