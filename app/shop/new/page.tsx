/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type {
  IFilterParams,
  IProductsEntity,
} from 'oneentry/dist/products/productsInterfaces';
import { Suspense } from 'react';

import { getPageByUrl, getProducts } from '@/app/api/serverSideProps';
import ProductsGridLayout from '@/components/layout/catalog/ProductsGridLayout';
import { ProductsGridLoader } from '@/components/shared/Loader';

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
  const currentPage = Number(searchParams?.page) || 0;
  const pageLimit = 11;
  const totalProducts = await getProducts({
    limit: 100,
    offset: 0,
    params: { ...params, searchParams: searchParams },
  });
  const totalProductsCount = totalProducts?.products?.length || 0;
  const data = await getProducts({
    limit: pageLimit,
    offset: currentPage,
    params: { searchParams: searchParams },
  });

  const { isError, products } = data;
  if (isError || !products) {
    return notFound();
  }

  return (
    <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <Suspense fallback={<ProductsGridLoader limit={pageLimit} />}>
          <ProductsGridLayout
            gridItems={products.filter(
              (product: IProductsEntity) =>
                product.attributeValues.stickers?.value.value === 'new' &&
                product.attributeSetIdentifier !== 'service_product',
            )}
            totalPages={totalProductsCount / (pageLimit - 1)}
          />
        </Suspense>
      </div>
    </section>
  );
}
