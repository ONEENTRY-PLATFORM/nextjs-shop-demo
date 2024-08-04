import type { Metadata } from 'next';
// import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import ProductsGridLayout from '@/components/layout/catalog/ProductsGridLayout';

export async function generateMetadata({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  console.log(params);
  const {
    url,
    width,
    height,
    altText: alt,
  } = { url: '', width: 300, height: 300, altText: '' };
  const indexable = true;

  return {
    title: '',
    description: '',
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
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

export default async function CatalogPage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params,
}: {
  params: { handle: string };
}) {
  return (
    <section className="relative mx-auto box-border flex w-full max-w-[1240px] shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <div className="size-full basis-full lg:basis-4/6">
          <Suspense
            fallback={
              <div className="relative aspect-square size-full max-h-[550px] overflow-hidden" />
            }
          />
        </div>
        <ProductsGridLayout items={[]} />
      </div>
    </section>
  );
}
