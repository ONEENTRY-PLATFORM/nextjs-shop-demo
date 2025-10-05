/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { memo, Suspense } from 'react';

import { getChildPagesByParentUrl, getPageByUrl } from '@/app/api';
import { getImageUrl } from '@/app/api/hooks/useAttributesData';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import type { MetadataParams } from '@/app/types/global';
import { generatePageMetadata } from '@/app/utils/generatePageMetadata';
import ProductsGridLayout from '@/components/layout/products-grid';
import ProductsGridLoader from '@/components/layout/products-grid/components/ProductsGridLoader';
import { i18n, type Locale } from '@/i18n-config';

import { getDictionary } from '../../dictionaries';

/**
 * Shop catalog page
 * @async
 * @param   {object}                                                    props              - page props
 * @param   {Promise<{ handle: string; lang: string }>}                 props.params       - page params
 * @param   {Promise<{ [key: string]: string | string[] | undefined }>} props.searchParams - search params
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns {Promise<JSX.Element>}                                                         Shop page layout JSX.Element
 */
const ShopCatalogPage = async (props: {
  params: Promise<{ handle: string; lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<JSX.Element> => {
  const searchParams = await props.searchParams;
  const params = await props.params;

  // Get the dictionary from the API and set the server provider.
  const [dict] = ServerProvider(
    'dict',
    await getDictionary(params.lang as Locale),
  );

  // Set the number of products to display per page
  // TODO: Extract products per page limit from global settings
  const pagesLimit = 10;

  // Memoize the loader component to prevent unnecessary re-renders
  const MemoizedProductsGridLoader = memo(ProductsGridLoader);

  return (
    <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <Suspense fallback={<MemoizedProductsGridLoader />}>
          <ProductsGridLayout
            params={params}
            searchParams={searchParams}
            pagesLimit={pagesLimit}
            dict={dict}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default ShopCatalogPage;

/**
 * Pre-generation of shop page
 * @returns {Promise<Array<{ lang: string; handle: string }>>} - static paths
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
 * @async
 * @param   {MetadataParams}    params - page params
 * @returns {Promise<Metadata>}        metadata
 * @see {@link https://nextjs.org/docs/app/building-your-application/optimizing/metadata#dynamic-metadata Next.js docs}
 */
export async function generateMetadata({
  params,
}: MetadataParams): Promise<Metadata> {
  const { handle, lang } = await params;
  const { isError, page } = await getPageByUrl(handle, lang);

  // Handle case when page is not found or an error occurred
  if (isError || !page) {
    return notFound();
  }

  // Extract data from page object
  const { localizeInfos, isVisible, attributeValues } = page;

  // Return metadata object with page information
  return generatePageMetadata({
    handle: handle,
    title: localizeInfos.title,
    description: localizeInfos.plainContent,
    isVisible: isVisible,
    imageUrl: getImageUrl('opengraph_image', attributeValues),
    imageAlt: localizeInfos.title,
    lang: lang,
    baseUrl: '',
  });
}
