import type { Metadata } from 'next';
import type { JSX } from 'react';
import { Suspense } from 'react';

import { getBlockByMarker, getPageByUrl } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import type { PageProps } from '@/app/types/global';
import OrdersPage from '@/components/layout/orders';
import Loader from '@/components/shared/Loader';
import { i18n, type Locale } from '@/i18n-config';

import { getDictionary } from '../../dictionaries';

/** OneEntry page marker for the orders page (metadata source). */
const PAGE_MARKER = 'orders';

/**
 * Orders page
 * @param   {PageProps}                 props        - Page props
 * @param   {Promise<{ lang: string }>} props.params - Page params
 * @returns {Promise<JSX.Element>}                   Orders page layout JSX.Element
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 */
const OrdersPageLayout = async ({
  params,
}: PageProps): Promise<JSX.Element> => {
  /** Extract language parameter from route params */
  const { lang } = await params;

  /** Get the dictionary from the API and set the server provider. */
  const [dict] = ServerProvider('dict', await getDictionary(lang as Locale));

  /** Get block by marker from the API. */
  const { block } = await getBlockByMarker('orders_settings', lang);

  /**
   * Render the orders page content (the sidebar is provided by the group
   * layout). A missing/incomplete `orders_settings` block must not kill the
   * page — the components degrade to English fallback labels.
   */
  return (
    <Suspense fallback={<Loader />}>
      <OrdersPage
        lang={lang}
        dict={dict}
        settings={block?.attributeValues ?? {}}
      />
    </Suspense>
  );
};

export default OrdersPageLayout;

/**
 * Pre-generation page params
 * @returns {Promise<object[]>} Static params for pre-generation
 */
export async function generateStaticParams(): Promise<object[]> {
  /** Initialize an empty array to hold the static parameters */
  const params: Array<{ lang: string }> = [];
  /** Loop through all available locales and create parameter objects */
  for (const lang of i18n.locales) {
    params.push({ lang });
  }
  /** Return the array of static parameters for pre-rendering */
  return params;
}

/**
 * Generates metadata for the orders page, including title, description, OpenGraph tags and canonical URL
 * @param   {object}                    metadataParams        - Metadata params
 * @param   {Promise<{ lang: string }>} metadataParams.params - An object containing the language parameter
 * @returns {Promise<Metadata>}                               Promise resolving to Metadata object with page metadata information
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  /** Extract the language parameter from the route params */
  const { lang } = await params;

  /** Get localized page content from the CMS (marker `orders`), if the page exists */
  const { page } = await getPageByUrl(PAGE_MARKER, lang);

  /** Page title from CMS localize infos with an English code fallback */
  const title = page?.localizeInfos?.title || 'My orders';
  /** Page description from CMS plain content with an English code fallback */
  const description =
    page?.localizeInfos?.plainValue || 'Order history and processing statuses.';

  /** Return metadata object with SEO information */
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${lang}/orders`,
      type: 'website',
    },
    alternates: {
      canonical: `/${lang}/orders`,
    },
  };
}
