import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import ProductsGridLayout from '@/components/layout/catalog/ProductsGridLayout';

import { getProducts } from '../../api/serverSideProps';

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const {
    url,
    width,
    height,
    altText: alt,
  } = { url: '', width: 300, height: 300, altText: '' };
  const indexable = true;

  return {
    title: '',
    description: '',
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function PromotionPage({
  params,
}: {
  params: { handle: string };
}) {
  const data = await getProducts({ limit: 10, offset: 0, params });

  const { isError, products } = data;
  if (isError || !products) {
    return notFound();
  }
  console.log(products);

  return (
    <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <Suspense
          fallback={
            <div className="relative aspect-square size-full max-h-[550px] overflow-hidden" />
          }
        />
        <ProductsGridLayout gridItems={products} />
      </div>
    </section>
  );
}
