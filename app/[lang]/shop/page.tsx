import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';
import { Suspense } from 'react';

import { getBlockByMarker, getPageByUrl, getProducts } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import ProductsGridLayout from '@/components/layout/catalog/ProductsGridLayout';
import { ProductsGridLoader } from '@/components/shared/Loader';

export async function generateMetadata(): Promise<Metadata> {
  const langCode = 'en_US';
  const { isError, page } = await getPageByUrl('shop', langCode);
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

const ShopPage = async ({
  searchParams,
  params: { lang },
}: {
  searchParams?: {
    search?: string;
    page?: string;
    filters?: IFilterParams[];
  };
  params: { lang: string };
}) => {
  const currentPage = Number(searchParams?.page) || 0;

  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const { page } = await getPageByUrl('shop', langCode);
  const { block } = await getBlockByMarker('main_catalog', langCode);

  const pageLimit = block?.quantity || 10;

  const { isError, products, total } = await getProducts({
    limit: pageLimit,
    offset: currentPage * pageLimit,
    langCode: langCode,
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
            totalPages={(total || 0) / pageLimit}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default ShopPage;
