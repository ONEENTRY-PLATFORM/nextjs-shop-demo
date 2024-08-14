import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import CartPage from '@/components/layout/cart/CartPage';

import { getPageByUrl } from '../api/serverSideProps';

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

  const { localizeInfos } = page;

  return (
    <div className="mx-auto flex min-h-80 w-full max-w-screen-xl flex-col py-8">
      <h1 className="mb-8 text-3xl">{localizeInfos.title}</h1>
      {page.pageUrl === 'cart' && <CartPage />}
      {/* {page.pageUrl === 'favorites' && <FavoritesPage />} */}
    </div>
  );
}
