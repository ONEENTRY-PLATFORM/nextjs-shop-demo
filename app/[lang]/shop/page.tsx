import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { memo, Suspense } from 'react';

import { getPageByUrl, getProducts } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import type { MetadataParams, PageProps } from '@/app/types/global';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import ProductsGridLayout from '@/components/layout/products-grid';
import ProductsGridLoader from '@/components/layout/products-grid/components/ProductsGridLoader';
import type { Locale } from '@/i18n-config';
import { i18n } from '@/i18n-config';

import { getDictionary } from '../dictionaries';

/**
 * Generate page metadata
 * @async server component
 * @param params page params
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/building-your-application/optimizing/metadata#dynamic-metadata Next.js docs}
 * @returns metadata
 */
export async function generateMetadata({
  params,
}: MetadataParams): Promise<Metadata> {
  const { lang } = await params;
  const { isError, page } = await getPageByUrl('shop', lang);

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
    altText: localizeInfos.title,
  };

  return {
    title: localizeInfos.title,
    description: localizeInfos.plainContent,
    alternates: {
      languages: Object.fromEntries(i18n.locales.map((l) => [l, `/${l}/shop`])),
      canonical: `/${lang}/shop`,
    },
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

/**
 * Shop page
 * @async server component
 * @param params page params
 * @param searchParams dynamic search params
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns Shop page layout JSX.Element
 */
const ShopPageLayout: FC<PageProps> = async (props) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { lang } = await params;
  // Get the dictionary from the API and set the server provider.
  const [dict] = ServerProvider('dict', await getDictionary(lang as Locale));

  // Get current Page ByUrl from api
  const { page } = await getPageByUrl('shop', lang);

  // !!! Get pages limit
  const pagesLimit = 10;

  // Memoize the loader component
  const MemoizedProductsGridLoader = memo(ProductsGridLoader);

  if (!page) {
    return notFound();
  }

  // Fetch products data
  const { isError, products, total } = await getProducts({
    lang: lang,
    offset: 0,
    limit: pagesLimit,
    params: { ...params, searchParams },
  });

  const productsData = {
    isError,
    products: products || [],
    total,
  };

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${lang}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.localizeInfos.title,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${lang}/shop`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <main className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
        <div className="flex w-full flex-col items-center gap-5">
          <Suspense fallback={<MemoizedProductsGridLoader />}>
            <ProductsGridLayout
              pagesLimit={pagesLimit}
              dict={dict}
              params={params}
              searchParams={searchParams}
              productsData={productsData}
            />
          </Suspense>
        </div>
      </main>
    </>
  );
};

export default ShopPageLayout;
