import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Key } from 'react';
import { Suspense } from 'react';

import Loader from '@/components/shared/Loader';

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
  } = { url: '', width: 300, height: 300, altText: '' };

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
  const data = await getAttributeByMarker({
    attributeMarker: 'category',
    setMarker: 'product',
    langCode: 'en_US',
  });
  const categories = data.attribute?.listTitles.map(
    (category: { title: string; value: string }) => {
      return {
        title: category.title,
        link: '/shop/category/' + category.value,
      };
    },
  );

  const { isError } = data;
  if (isError) {
    return notFound();
  }

  return (
    <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <Suspense fallback={<Loader />}>
          <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
            {categories.map(
              (category: { title: string; link: string }, i: Key) => {
                return (
                  <Link
                    key={i}
                    href={category.link}
                    className="relative flex w-1/4 grow flex-col justify-center text-2xl font-bold text-white max-md:w-full"
                  >
                    <div
                      className={`relative flex size-full h-64 overflow-hidden rounded-3xl p-6`}
                    >
                      <h2 className="z-10 mt-auto uppercase">
                        {category.title}
                      </h2>
                      <Image
                        fill
                        sizes="(min-width: 1024px) 66vw, 100vw"
                        src={'/images/card.svg'}
                        alt={category.title}
                        className="size-full rounded-3xl object-cover"
                      />
                    </div>
                  </Link>
                );
              },
            )}
          </div>
        </Suspense>
      </div>
    </section>
  );
}
