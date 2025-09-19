/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { IError } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { memo, Suspense } from 'react';

import { getPageByUrl, getProducts, getProductsByPageUrl } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import type { MetadataParams } from '@/app/types/global';
import ProductsGridLayout from '@/components/layout/products-grid';
import ProductsGridLoader from '@/components/layout/products-grid/components/ProductsGridLoader';
import type { Locale } from '@/i18n-config';

import { getDictionary } from '../../dictionaries';

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
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { handle, lang } = params;

  // Get the dictionary from the API and set the server provider.
  const [dict] = ServerProvider('dict', await getDictionary(lang as Locale));

  // !!!extract products per page limit from global settings
  const pagesLimit = 10;

  // get page by url from the API
  const { page, isError: err } = await getPageByUrl(handle, lang);

  if (err) {
    return notFound();
  }

  // Check if this is a category page by checking page type
  const isCategory = page?.type === ('Category' as any);

  const combinedParams = { ...page, searchParams } as any;

  const currentPage = Number(searchParams?.page) || 1;

  // Get all products from api or get products byPageUrl
  const productsData: {
    isError: boolean;
    error?: IError;
    products?: IProductsEntity[];
    total: number;
  } = !isCategory
    ? await getProducts({
        lang: lang,
        offset: currentPage,
        limit: pagesLimit,
        params: combinedParams,
      })
    : await getProductsByPageUrl({
        lang: lang,
        offset: currentPage,
        limit: pagesLimit,
        params: combinedParams,
      });

  // Memoize the loader component
  const MemoizedProductsGridLoader = memo(ProductsGridLoader);

  if (!page || productsData.isError) {
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
