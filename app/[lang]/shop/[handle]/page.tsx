/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { IError } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { memo, Suspense } from 'react';

import { getChildPagesByParentUrl, getPageByUrl, getProducts } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import type { MetadataParams } from '@/app/types/global';
import ProductsGridLayout from '@/components/layout/products-grid';
import ProductsGridLoader from '@/components/layout/products-grid/components/ProductsGridLoader';
import { i18n, type Locale } from '@/i18n-config';

import { getDictionary } from '../../dictionaries';

/**
 * Shop catalog page
 *
 * @async server component
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @param params page params
 * @param searchParams
 * @returns Shop page layout JSX.Element
 */
const ShopCatalogPage: FC<any> = async (props: {
  params: Promise<{ handle: any; lang: any }>;
  searchParams: any;
}) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { handle, lang } = params;

  // Get the dictionary from the API and set the server provider.
  const [dict] = ServerProvider('dict', await getDictionary(lang as Locale));

  // !!!extract products per page limit from global settings
  const pagesLimit = 10;

  const combinedParams = { handle: handle, searchParams: searchParams } as any;

  const currentPage = Number(searchParams?.page) || 1;

  // Get all products from api or get products byPageUrl
  const productsData: {
    isError: boolean;
    error?: IError;
    products?: IProductsEntity[];
    total: number;
  } = await getProducts({
    lang: lang,
    offset: 0,
    limit: currentPage * pagesLimit,
    params: combinedParams,
  });

  // Memoize the loader component
  const MemoizedProductsGridLoader = memo(ProductsGridLoader);

  if (productsData.isError) {
    return notFound();
  }

  return (
    <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <Suspense fallback={<MemoizedProductsGridLoader />}>
          <ProductsGridLayout
            params={{ handle, lang }}
            currentPage={currentPage}
            pagesLimit={pagesLimit}
            dict={dict}
            productsData={productsData as any}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default ShopCatalogPage;

/**
 * Pre-generation of shop page
 */
export async function generateStaticParams() {
  const params: Array<{ lang: string; handle: string }> = [];
  for (const lang of i18n.locales) {
    const { pages }: any = await getChildPagesByParentUrl('shop', lang);

    if (pages && Array.isArray(pages)) {
      for (const page of pages) {
        if (page) {
          const handle = page.pageUrl;
          params.push({ lang, handle });
        }
      }
    }
  }
  return params;
}

/**
 * Generate page metadata
 * @async server component
 * @param params page params
 * @see {@link https://nextjs.org/docs/app/building-your-application/optimizing/metadata#dynamic-metadata Next.js docs}
 * @returns metadata
 */
export async function generateMetadata({
  params,
}: MetadataParams): Promise<Metadata> {
  const { handle, lang } = await params;
  const { isError, page } = await getPageByUrl(handle, lang);

  if (isError || !page) {
    return notFound();
  }

  // extract data from page
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
