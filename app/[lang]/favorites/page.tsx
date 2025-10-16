import type { Metadata } from 'next';
import type { JSX } from 'react';

import WithSidebar from '@/app/[lang]/[page]/WithSidebar';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import type { PageProps } from '@/app/types/global';
import FavoritesPage from '@/components/layout/favorites';
import { i18n, type Locale } from '@/i18n-config';

import { getDictionary } from '../dictionaries';

/**
 * Favorites page
 * @param   {object}               props        - Page props
 * @param   {PageProps}            props.params - page params
 * @returns {Promise<JSX.Element>}              Favorites page layout JSX.Element
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 */
const FavoritesPageLayout = async ({
  params,
}: PageProps): Promise<JSX.Element> => {
  /** Extract language parameter from the route params */
  const { lang } = await params;
  /** Get dictionary and set to server provider */
  const [dict] = ServerProvider('dict', await getDictionary(lang as Locale));

  /** Render the favorites page layout with sidebar */
  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar lang={lang}>
          <FavoritesPage lang={lang} dict={dict} />
        </WithSidebar>
      </div>
    </section>
  );
};

export default FavoritesPageLayout;

/**
 * Pre-generation page params
 * @returns {Promise<object[]>} Static params for pre-generation
 */
export async function generateStaticParams(): Promise<object[]> {
  /** Initialize empty array to store static parameters */
  const params: Array<{ lang: string }> = [];
  /** Iterate through all supported locales and create parameter objects */
  for (const lang of i18n.locales) {
    params.push({ lang });
  }
  /** Return the array of static parameters for pre-rendering */
  return params;
}

/**
 * Generate page metadata
 * @param   {object}                    props        - Metadata params
 * @param   {Promise<{ lang: string }>} props.params - page params
 * @returns {Promise<Metadata>}                      metadata
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  /** Extract language parameter from params */
  const { lang } = await params;
  /** Set page title for SEO */
  const title = 'My orders';
  /** Set page description for SEO */
  const description = 'Order history and processing statuses.';

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
