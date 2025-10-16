import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { memo, Suspense } from 'react';

import { getPageByUrl } from '@/app/api';
import { getImageUrl } from '@/app/api/hooks/useAttributesData';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import type { MetadataParams, PageProps } from '@/app/types/global';
import { generatePageMetadata } from '@/app/utils/generatePageMetadata';
import ProductsGridLayout from '@/components/layout/products-grid';
import ProductsGridLoader from '@/components/layout/products-grid/components/ProductsGridLoader';
import { i18n, type Locale } from '@/i18n-config';

import { getDictionary } from '../dictionaries';

export const dynamic = 'force-dynamic';

/**
 * Shop page
 * @param   {PageProps}            props - Page props containing params and searchParams
 * @returns {Promise<JSX.Element>}       Shop page layout JSX.Element
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 */
const ShopPageLayout = async (props: PageProps): Promise<JSX.Element> => {
  /** Extract search parameters from props */
  const searchParams = await props.searchParams;
  /** Extract route parameters from props */
  const params = await props.params;
  /** Destructure language from parameters */
  const { lang } = params;

  /** Get the dictionary from the API and set the server provider. */
  const [dict] = ServerProvider('dict', await getDictionary(lang as Locale));

  /** Get current Page ByUrl from api */
  const { page } = await getPageByUrl('shop', lang);

  /** Set the number of products to display per page */
  // TODO: Extract products per page limit from global settings
  const pagesLimit = 10;

  /** Memoize the loader component to prevent unnecessary re-renders */
  const MemoizedProductsGridLoader = memo(ProductsGridLoader);

  /** Return 404 page if shop page not found */
  if (!page) {
    return notFound();
  }

  /** Generate structured data for breadcrumbs to improve SEO */
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

  /** Render the shop page with structured data and product grid */
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
              params={params}
              searchParams={searchParams}
              pagesLimit={pagesLimit}
              dict={dict}
            />
          </Suspense>
        </div>
      </main>
    </>
  );
};

export default ShopPageLayout;

/**
 * Pre-generation of shop page
 * @returns {Promise<Array<{ lang: string }>>} Array of parameters for static generation
 */
export async function generateStaticParams(): Promise<Array<{ lang: string }>> {
  /** Initialize empty array to store static parameters */
  const params: Array<{ lang: string }> = [];
  /** Loop through all available locales and create parameter objects */
  for (const lang of i18n.locales) {
    params.push({ lang });
  }
  return params;
}

/**
 * Generate page metadata
 * @param   {MetadataParams}                           props        - Metadata params
 * @param   {Promise<{handle: string; lang: string;}>} props.params - Page params
 * @returns {Promise<Metadata>}                                     Metadata object
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/building-your-application/optimizing/metadata#dynamic-metadata Next.js docs}
 */
export async function generateMetadata({
  params,
}: MetadataParams): Promise<Metadata> {
  /** Extract handle and language from route parameters */
  const { handle, lang } = await params;
  /** Fetch the shop page by URL and language */
  const { isError, page } = await getPageByUrl('shop', lang);

  /** Return 404 page if page not found or an error occurred */
  if (isError || !page) {
    return notFound();
  }

  /** Extract page information from the page object */
  const { localizeInfos, isVisible, attributeValues } = page;

  /** Return metadata object */
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
