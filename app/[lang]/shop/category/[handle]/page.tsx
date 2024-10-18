import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { Suspense } from 'react';

import { getDictionary } from '@/app/[lang]/dictionaries';
import { getPageByUrl, getProductsByPageUrl } from '@/app/api';
import { useServerProvider } from '@/app/store/providers/ServerProvider';
import type { PageProps } from '@/app/types/global';
import ProductsGridLayout from '@/components/layout/products-grid/ProductsGridLayout';
import ProductsGridLoader from '@/components/layout/products-grid/ProductsGridLoader';
import type { Locale } from '@/i18n-config';

// generateMetadata
export async function generateMetadata({
  params: { handle, lang },
}: {
  params: { handle: string; lang: string };
}): Promise<Metadata> {
  const { isError, page } = await getPageByUrl(handle, lang);

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

// CatalogPage
const CatalogPage: FC<PageProps> = async ({ params, searchParams }) => {
  const [dict] = useServerProvider(
    'dict',
    await getDictionary(params.lang as Locale),
  );
  const pageLimit = 10;
  const currentPage = Number(searchParams?.page) || 0;

  const { isError, products, total } = await getProductsByPageUrl({
    lang: params.lang,
    limit: pageLimit,
    offset: currentPage * pageLimit,
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
