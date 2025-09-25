import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { FC } from 'react';

import { getPageByUrl } from '@/app/api';
import { getChildPagesByParentUrl } from '@/app/api';
import { getImageUrl } from '@/app/api/hooks/useAttributesData';
import type { PageProps } from '@/app/types/global';
import { generatePageMetadata } from '@/app/utils/generatePageMetadata';
import CategoriesGrid from '@/components/layout/categories';
import { i18n } from '@/i18n-config';

/**
 * Category page
 *
 * @async server component
 * @param params page params
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns Category page layout JSX.Element
 */
const CategoryPage: FC<PageProps> = async ({ params }) => {
  const { lang } = await params;
  // Get child pages by parent url
  const { pages, isError } = await getChildPagesByParentUrl('category', lang);

  if (isError || !pages || !Array.isArray(pages)) {
    return notFound();
  }

  // extract categories data from pages
  const categories = pages?.map((page: IPagesEntity) => {
    return {
      title: page.localizeInfos.title,
      link: '/' + lang + '/shop/category/' + page.pageUrl,
      imgSrc: getImageUrl('opengraph_image', page.attributeValues),
    };
  });

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
        name: 'Categories',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${lang}/shop/category`,
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
          <CategoriesGrid categories={categories} />
        </div>
      </main>
    </>
  );
};

export default CategoryPage;

/**
 * Pre-generation of category pages for each locale
 */
export async function generateStaticParams() {
  const params: Array<{ lang: string; handle: string }> = [];
  for (const lang of i18n.locales) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { page }: any = await getPageByUrl('category', lang);
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
 * @async server component
 * @param params page params
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/building-your-application/optimizing/metadata#dynamic-metadata Next.js docs}
 * @returns metadata
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string; lang: string }>;
}): Promise<Metadata> {
  const { handle, lang } = await params;
  const { isError, page } = await getPageByUrl('category', lang);

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
