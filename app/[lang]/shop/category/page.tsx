/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import { Suspense } from 'react';

import { getPageByUrl } from '@/app/api';
import { getChildPagesByParentUrl } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import CategoriesGrid from '@/components/layout/categories/CategoriesGrid';
import { CategoriesLoader } from '@/components/shared/Loader';

// generateMetadata
export async function generateMetadata({
  params,
}: {
  params: { handle: string; lang: string };
}): Promise<Metadata> {
  const langCode = LanguageEnum[params.lang as keyof typeof LanguageEnum];
  const { isError, page } = await getPageByUrl('category', langCode);

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

// CategoryPage
const CategoryPage = async ({
  params: { lang },
}: {
  params: { lang: string };
}) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const { pages, isError } = await getChildPagesByParentUrl(
    'category',
    langCode,
  );

  if (isError || !pages) {
    return notFound();
  }

  const categories = pages.map((page: IPagesEntity) => {
    return {
      title: page.localizeInfos.title,
      link: lang + '/shop/category/' + page.pageUrl,
      imgSrc: page.attributeValues.pic?.value[0].downloadLink,
    };
  });

  return (
    <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <Suspense fallback={<CategoriesLoader />}>
          <CategoriesGrid categories={categories} />
        </Suspense>
      </div>
    </section>
  );
};

export default CategoryPage;
