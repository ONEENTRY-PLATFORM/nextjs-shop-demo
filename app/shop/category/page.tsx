/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import { Suspense } from 'react';

import CategoriesGrid from '@/components/layout/categories/CategoriesGrid';
import { CategoriesLoader } from '@/components/shared/Loader';

import {
  getChildPagesByParentUrl,
  getPageByUrl,
} from '../../api/serverSideProps';

export async function generateMetadata(): Promise<Metadata> {
  const { isError, page } = await getPageByUrl('category', 'en_US');

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

const CategoryPage = async () => {
  // export default async function CategoryPage() {
  const langCode = 'en_US';
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
      link: '/shop/category/' + page.pageUrl,
      imgSrc: page.attributeValues.pic.value[0].downloadLink,
    };
  });
  console.log(pages[0].attributeValues.pic.value[0].downloadLink);

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
