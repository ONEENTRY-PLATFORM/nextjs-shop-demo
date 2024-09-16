/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import CategoriesGrid from '@/components/layout/categories/CategoriesGrid';
import Loader, { CategoriesLoader } from '@/components/shared/Loader';

import { getAttributeByMarker, getPageByUrl } from '../../api/serverSideProps';

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const data = await getPageByUrl('shop', 'en_US');
  const { isError, page } = data;
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

export default async function CategoryPage({
  params,
}: {
  params: { handle: string };
}) {
  const langCode = 'en_US';

  const { isError, attribute } = await getAttributeByMarker({
    attributeMarker: 'category',
    setMarker: 'product',
    langCode: langCode,
  });

  if (isError) {
    return notFound();
  }

  const categories = attribute?.listTitles.map(
    (category: { title: string; value: string }) => {
      return {
        title: category.title,
        link: '/shop/category/' + category.value,
      };
    },
  );

  return (
    <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <Suspense fallback={<CategoriesLoader />}>
          <CategoriesGrid categories={categories} />
        </Suspense>
      </div>
    </section>
  );
}
