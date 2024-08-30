import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { Suspense } from 'react';

import { getPageByUrl, getProducts } from '@/app/api/serverSideProps';
import ProductsGridLayout from '@/components/layout/catalog/ProductsGridLayout';

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
  console.log(attributeValues);

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
}: {
  params: { handle: string };
}) {
  const data = await getProducts({ limit: 10, offset: 0 });
  // const data = await getProductsByUrl({ limit: 10, offset: 0, params });
  // !!! Как получить продукты по категории?

  const { isError, products } = data;
  if (isError || !products) {
    return notFound();
  }
  console.log(products[2].attributeValues.category.value.value);

  return (
    <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <Suspense
          fallback={
            <div className="relative aspect-square size-full max-h-[550px] overflow-hidden" />
          }
        />
        <ProductsGridLayout
          gridItems={products.filter(
            (product: IProductsEntity) =>
              product.attributeValues.category?.value.value === params.handle &&
              product.attributeSetIdentifier !== 'service_product',
          )}
        />
      </div>
    </section>
  );
}
