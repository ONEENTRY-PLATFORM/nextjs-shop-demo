import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import CartPage from '@/components/layout/pages/CartPage';
import FavoritesPage from '@/components/layout/pages/FavoritesPage';
import OrdersPage from '@/components/layout/pages/OrdersPage';
import PaymentPage from '@/components/layout/pages/PaymentPage';
import ProfilePage from '@/components/layout/pages/ProfilePage';

import * as pageComponents from '../../components/layout/pages';
import { getPageByUrl } from '../api/serverSideProps';
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
    name: 'orders',
    title: 'orders',
    component: <OrdersPage />,
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
          page.component
        );
      })}
    </div>
  );
}
