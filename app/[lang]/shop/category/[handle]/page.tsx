import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type JSX, memo, Suspense } from 'react';

import { getDictionary } from '@/app/[lang]/dictionaries';
import { getChildPagesByParentUrl, getPageByUrl } from '@/app/api';
import { getImageUrl } from '@/app/api/hooks/useAttributesData';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import type { MetadataParams } from '@/app/types/global';
import { generatePageMetadata } from '@/app/utils/generatePageMetadata';
import ProductsGridLayout from '@/components/layout/products-grid';
import ProductsGridLoader from '@/components/layout/products-grid/components/ProductsGridLoader';
import type { Locale } from '@/i18n-config';
import { i18n } from '@/i18n-config';

/**
 * Shop category page layout
 * @param   {object}               props              - Page props
 * @param   {object}               props.params       - page params
 * @param   {object}               props.searchParams - dynamic search params
 * @returns {Promise<JSX.Element>}                    Shop page layout JSX.Element
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 */
const ShopCategoryLayout = async (props: {
  params: Promise<{ lang: string; handle: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: any;
}): Promise<JSX.Element> => {
  /** Extract route parameters from props */
  const params = await props.params;
  /** Destructure language and handle from parameters */
  const { lang, handle } = params;
  /** Access searchParams without await to keep page static */
  const searchParams = await props.searchParams;

  /** Get the dictionary from the API and set the server provider. */
  const [dict] = ServerProvider('dict', await getDictionary(lang as Locale));

  /** Fetch category page data from the CMS */
  const { page } = await getPageByUrl(handle, lang);

  /** Set products per page limit */
  // TODO: Extract products per page limit from global settings
  const pagesLimit = 10;

  /** Memoize the loader component to prevent unnecessary re-renders */
  const MemoizedProductsGridLoader = memo(ProductsGridLoader);

  /** Show 404 page if category page not found */
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
        name: 'Shop',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${lang}/shop`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: page.localizeInfos.title,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${lang}/shop/category/${handle}`,
      },
    ],
  };

  /** Render the shop category page with structured data and product grid */
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <main className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
        <div className="flex w-full flex-col items-center gap-5 bg-white">
          <Suspense fallback={<MemoizedProductsGridLoader />}>
            <ProductsGridLayout
              params={params}
              searchParams={searchParams}
              pagesLimit={pagesLimit}
              dict={dict}
              isCategory={true}
            />
          </Suspense>
        </div>
      </main>
    </>
  );
};

export default ShopCategoryLayout;

/**
 * Pre-generation pages for each locale
 * @returns {Promise<{lang: string; handle: string;}[]>} Static params for pre-generation
 */
export async function generateStaticParams(): Promise<
  {
    lang: string;
    handle: string;
  }[]
> {
  /** Initialize empty array to store static parameters */
  const params: Array<{ lang: string; handle: string }> = [];
  /** Loop through all available locales */
  for (const lang of i18n.locales) {
    /** Fetch child pages for the shop parent URL in the current language */
    const { pages } = await getChildPagesByParentUrl('shop', lang);
    /** Check if pages exist and are in array format */
    if (pages && Array.isArray(pages)) {
      /** Iterate through each page to extract handle */
      for (const page of pages) {
        const handle = page.pageUrl || '';
        params.push({ lang, handle });
      }
    }
  }
  return params;
}

/**
 * Generate page metadata
 * @param   {object}            metadataParams        - Metadata params
 * @param   {MetadataParams}    metadataParams.params - page params
 * @returns {Promise<Metadata>}                       metadata
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/building-your-application/optimizing/metadata#dynamic-metadata Next.js docs}
 */
export async function generateMetadata({
  params,
}: MetadataParams): Promise<Metadata> {
  /** Extract handle and language from route parameters */
  const { handle, lang } = await params;
  /** Fetch page data by URL and language */
  const { isError, page } = await getPageByUrl(handle, lang);

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
