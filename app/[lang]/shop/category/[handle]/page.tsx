import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type FC, memo, Suspense } from 'react';

import { getDictionary } from '@/app/[lang]/dictionaries';
import { getPageByUrl } from '@/app/api';
import { getChildPagesByParentUrl } from '@/app/api/server/pages/getChildPagesByParentUrl';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import type { MetadataParams, PageProps } from '@/app/types/global';
import ProductsGridLayout from '@/components/layout/products-grid';
import ProductsGridLoader from '@/components/layout/products-grid/components/ProductsGridLoader';
import type { Locale } from '@/i18n-config';
import { i18n } from '@/i18n-config';

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
    alternates: {
      languages: Object.fromEntries(
        i18n.locales.map((l) => [l, `/${l}/shop/category/${handle}`]),
      ),
      canonical: `/${lang}/shop/category/${handle}`,
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
 * Shop category page layout
 * @async server component
 * @param params page params
 * @param searchParams dynamic search params
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns Shop page layout JSX.Element
 */
const ShopCategoryLayout: FC<PageProps> = async (props) => {
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

  return (
    <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <Suspense fallback={<MemoizedProductsGridLoader />}>
          <ProductsGridLayout
            searchParams={searchParams}
            pagesLimit={pagesLimit}
            params={params}
            dict={dict}
            isCategory={true}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default ShopCategoryLayout;

/**
 * Pre-generation of category pages for each locale
 */
export async function generateStaticParams() {
  const params: Array<{ lang: string; handle: string }> = [];
  for (const lang of i18n.locales) {
    const { pages } = await getChildPagesByParentUrl('shop', lang);
    if (pages && Array.isArray(pages)) {
      for (const page of pages) {
        // Use page.url or page.slug as fallback
        const handle =
          'url' in page
            ? (page as { url: string }).url
            : 'slug' in page
              ? (page as { slug: string }).slug
              : '';
        if (handle) {
          params.push({ lang, handle });
        }
      }
    }
  }
  return params;
}
