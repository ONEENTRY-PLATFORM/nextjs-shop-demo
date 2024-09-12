/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';
import { Suspense } from 'react';

import { getPageByUrl, getProductsByUrl } from '@/app/api/serverSideProps';
import ProductsGridLayout from '@/components/layout/catalog/ProductsGridLayout';
import { ProductsGridLoader } from '@/components/shared/Loader';

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const { isError, page } = await getPageByUrl(params.handle, 'en_US');

  if (isError || !page) {
    return notFound();
  }
  const { localizeInfos, isVisible, attributeValues } = page;

  const {
    url,
    width,
    height,
    altText: alt,
  } = { url: '', width: 300, height: 300, altText: '' };

  return {
    title: localizeInfos.title,
    description: localizeInfos.plainContent,
    robots: {
      index: isVisible,
      follow: isVisible,
      googleBot: {
        index: isVisible,
        follow: isVisible,
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

export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: { handle: string };
  searchParams?: {
    search?: string;
    page?: string;
    filters?: IFilterParams[];
  };
}) {
  const pageLimit = 10;
  const currentPage = Number(searchParams?.page) || 0;

  const { page } = await getPageByUrl(params.handle, 'en_US');
  const { isError, products } = await getProductsByUrl({
    limit: pageLimit,
    offset: currentPage * pageLimit,
    params: { ...params, searchParams: searchParams },
  });

  if (isError || !products) {
    return notFound();
  }

  return (
    <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <Suspense fallback={<ProductsGridLoader />}>
          <ProductsGridLayout
            gridItems={products}
            totalPages={(page?.products || 0) / pageLimit}
          />
        </Suspense>
      </div>
    </section>
  );
}
