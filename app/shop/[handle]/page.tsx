/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type {
  IFilterParams,
  IProductsEntity,
} from 'oneentry/dist/products/productsInterfaces';
import { Suspense } from 'react';

import ProductsGridLayout from '@/components/layout/catalog/ProductsGridLayout';
import Loader from '@/components/shared/Loader';

import {
  getPageByUrl,
  getProducts,
  getProductsTotalCount,
} from '../../api/serverSideProps';

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const data = await getPageByUrl('shop', 'en_US');
  const { isError, page } = data;

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
  const { totalCount } = await getProductsTotalCount({
    params: { ...params, searchParams: searchParams },
  });

  const { isError, products } = await getProducts({
    limit: pageLimit,
    offset: currentPage,
    params: { ...params, searchParams: searchParams },
  });

  if (isError || !products) {
    return notFound();
  }

  return (
    <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <Suspense fallback={<Loader />}>
          <ProductsGridLayout
            gridItems={products}
            totalPages={(totalCount || 0) / pageLimit}
          />
        </Suspense>
      </div>
    </section>
  );
}
