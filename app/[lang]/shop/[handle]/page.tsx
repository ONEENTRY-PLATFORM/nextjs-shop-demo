/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { Suspense } from 'react';

import { getPageByUrl, getProducts } from '@/app/api';
import { useServerProvider } from '@/app/store/providers/ServerProvider';
import { LanguageEnum } from '@/app/types/enum';
import type { PageProps } from '@/app/types/global';
import ProductsGridLayout from '@/components/layout/products-grid/ProductsGridLayout';
import ProductsGridLoader from '@/components/layout/products-grid/ProductsGridLoader';
import type { Locale } from '@/i18n-config';

import { getDictionary } from '../../dictionaries';

export async function generateMetadata({
  params,
}: {
  params: { handle: string; lang: string };
}): Promise<Metadata> {
  const langCode = LanguageEnum[params.lang as keyof typeof LanguageEnum];
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
    url: attributeValues?.icon?.downloadLink,
    width: 300,
    height: 300,
    altText: localizeInfos?.title,
  };

  return {
    title: localizeInfos?.title,
    description: localizeInfos?.plainContent,
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

const CatalogPage: FC<PageProps> = async ({ params, searchParams }) => {
  const [dict] = useServerProvider(
    'dict',
    await getDictionary(params.lang as Locale),
  );
  const pageLimit = 10;
  const currentPage = Number(searchParams?.page) || 0;

  const { isError, products, total } = await getProducts({
    limit: currentPage * pageLimit || pageLimit,
    offset: 0,
    lang: params.lang,
    params: { ...params, searchParams: searchParams },
  });

  if (isError) {
    return notFound();
  }

  if (!products) {
    return <ProductsGridLoader />;
  }

  return (
    <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <Suspense fallback={<ProductsGridLoader />}>
          <ProductsGridLayout
            gridItems={products}
            total={total}
            totalPages={total / pageLimit}
            lang={params.lang}
            dict={dict}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default CatalogPage;
