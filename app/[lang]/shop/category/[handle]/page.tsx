import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type FC, memo, Suspense } from 'react';

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
 * @async server component
 * @param params page params
 * @param searchParams dynamic search params
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns Shop page layout JSX.Element
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ShopCategoryLayout: FC<any> = async (props: any) => {
  // Access searchParams without await to keep page static
  const searchParams = await props.searchParams;

  const params = await props.params;
  const { lang, handle } = await params;
  // Get the dictionary from the API and set the server provider.
  const [dict] = ServerProvider('dict', await getDictionary(lang as Locale));

  // get page by url from api
  const { page } = await getPageByUrl(handle, lang);

  // !!!extract products per page limit from global settings
  const pagesLimit = 10;

  // Memoize the loader component
  const MemoizedProductsGridLoader = memo(ProductsGridLoader);

  if (!page) {
    return notFound();
  }

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
 */
export async function generateStaticParams() {
  const params: Array<{ lang: string; handle: string }> = [];
  for (const lang of i18n.locales) {
    const { pages } = await getChildPagesByParentUrl('shop', lang);
    if (pages && Array.isArray(pages)) {
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
 * @async server component
 * @param params page params
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
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
