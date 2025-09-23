/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
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
 *
 * @async server component
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @param params page params
 * @param searchParams
 * @returns Shop page layout JSX.Element
 */
const ShopCatalogPage: FC<any> = async (props: {
  params: Promise<{ handle: any; lang: any }>;
  searchParams: Promise<any>;
}) => {
  const searchParams = await props.searchParams;
  const params = await props.params;

  // Get the dictionary from the API and set the server provider.
  const [dict] = ServerProvider(
    'dict',
    await getDictionary(params.lang as Locale),
  );

  // !!!extract products per page limit from global settings
  const pagesLimit = 10;

  // Memoize the loader component
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

  // Return metadata object
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
