import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { FC } from 'react';

import { getPageByUrl } from '@/app/api';
import { getChildPagesByParentUrl } from '@/app/api';
import type { PageProps } from '@/app/types/global';
import CategoriesGrid from '@/components/layout/categories';

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
  params: { handle: string; lang: string };
}): Promise<Metadata> {
  const { lang } = await params;
  const { isError, page } = await getPageByUrl('category', lang);

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
 * Category page
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
  const categories = pages.map((page: IPagesEntity) => {
    return {
      title: page.localizeInfos.title,
      link: '/' + lang + '/shop/category/' + page.pageUrl,
      imgSrc: page.attributeValues.opengraph_image?.value[0]?.downloadLink,
    };
  });

  return (
    <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <CategoriesGrid categories={categories} />
      </div>
    </section>
  );
};

export default CategoryPage;
