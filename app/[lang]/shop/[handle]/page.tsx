/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';
import { Suspense } from 'react';

import { getPageByUrl, getProducts } from '@/app/api';
import ProductsGridLayout from '@/components/layout/catalog/ProductsGridLayout';
import { ProductsGridLoader } from '@/components/shared/Loader';

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const langCode = 'en_US';
  const data = await getPageByUrl(params.handle, langCode);
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
  } = {
    url: attributeValues.icon?.downloadLink,
    width: 300,
    height: 300,
    altText: localizeInfos.title,
  };

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
  const langCode = 'en_US';

  const currentPage = Number(searchParams?.page) || 0;

  const { isError, products, total } = await getProducts({
    langCode: langCode,
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
            totalPages={(total || 0) / pageLimit}
          />
        </Suspense>
      </div>
    </section>
  );
}
