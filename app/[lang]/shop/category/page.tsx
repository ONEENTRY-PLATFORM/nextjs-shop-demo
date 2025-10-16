import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { JSX } from 'react';

import { getPageByUrl } from '@/app/api';
import { getChildPagesByParentUrl } from '@/app/api';
import { getImageUrl } from '@/app/api/hooks/useAttributesData';
import type { PageProps } from '@/app/types/global';
import { generatePageMetadata } from '@/app/utils/generatePageMetadata';
import CategoriesGrid from '@/components/layout/categories';
import { i18n } from '@/i18n-config';

/**
 * Category page
 * @async
 * @param   {{params: Promise<{ lang: string }>}} params        - Page props with params promise containing lang
 * @param   {Promise<{ lang: string }>}           params.params - Page params promise with lang property
 * @returns {Promise<JSX.Element>}                              Category page layout JSX.Element
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 */
const CategoryPage = async ({ params }: PageProps): Promise<JSX.Element> => {
  /** Extract language parameter from the route params */
  const { lang } = await params;
  /** Get child pages by parent url */
  const { pages, isError } = await getChildPagesByParentUrl('category', lang);

  /** Return 404 page if there's an error or no pages found */
  if (isError || !pages || !Array.isArray(pages)) {
    return notFound();
  }

  /** Extract categories data from pages for display in the grid */
  const categories = pages?.map((page: IPagesEntity) => {
    return {
      title: page.localizeInfos.title,
      link: '/' + lang + '/shop/category/' + page.pageUrl,
      imgSrc: getImageUrl('opengraph_image', page.attributeValues),
    };
  });

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
        name: 'Categories',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${lang}/shop/category`,
      },
    ],
  };

  /** Render the category page with structured data and categories grid */
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
          <CategoriesGrid categories={categories} />
        </div>
      </main>
    </>
  );
};

export default CategoryPage;

/**
 * Pre-generation of category pages for each locale
 * @returns {Promise<Array<{ lang: string; handle: string }>>} Array of static parameters
 */
export async function generateStaticParams(): Promise<
  Array<{ lang: string; handle: string }>
> {
  /** Initialize an empty array to store static parameters */
  const params: Array<{ lang: string; handle: string }> = [];
  /** Loop through all available locales */
  for (const lang of i18n.locales) {
    /** Fetch the category page by URL for the current language */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { page }: any = await getPageByUrl('category', lang);
    /** Check if page exists */
    if (page) {
      const handle =
        'pageUrl' in page ? (page as { pageUrl: string }).pageUrl : '';

      params.push({ lang, handle });
    }
  }
  return params;
}

/**
 * Generate page metadata
 * @async
 * @param   {{params: Promise<{ handle: string; lang: string }>}} params - page params
 * @returns {Promise<Metadata>}                                          metadata
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/building-your-application/optimizing/metadata#dynamic-metadata Next.js docs}
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string; lang: string }>;
}): Promise<Metadata> {
  /** Extract handle and language from route parameters */
  const { handle, lang } = await params;
  /** Fetch the category page by URL and language */
  const { isError, page } = await getPageByUrl('category', lang);

  /** Return 404 page if there's an error or page not found */
  if (isError || !page) {
    return notFound();
  }
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
