import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { Suspense } from 'react';

import { getBlockByMarker, getPageByUrl, getProducts } from '@/app/api';
import ProductsGridLayout from '@/components/layout/catalog/ProductsGridLayout';
import { ProductsGridLoader } from '@/components/shared/Loader';

export async function generateMetadata({
  params,
}: {
  params: { page: string; lang: string };
}): Promise<Metadata> {
  const { isError, page } = await getPageByUrl('shop', params.lang);
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

const ShopPage: FC<{
  params: {
    lang: string;
  };
  searchParams?: {
    search?: string;
    page?: string;
    filters?: IFilterParams[];
  };
}> = async ({ params: { lang }, searchParams }) => {
  const { page } = await getPageByUrl('shop', lang);
  const { block } = await getBlockByMarker('main_catalog', lang);

  const currentPage = Number(searchParams?.page) || 0;
  const pageLimit = block?.quantity || 10;

  const { isError, products, total } = await getProducts({
    limit: pageLimit,
    offset: currentPage * pageLimit,
    lang,
    params: { searchParams: searchParams },
  });

  if (isError || !products || !page) {
    return <div>isError</div>;
  }

  return (
    <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <Suspense fallback={<ProductsGridLoader />}>
          <ProductsGridLayout
            gridItems={products}
            total={total}
            totalPages={total / pageLimit}
            lang={lang}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default ShopPage;
