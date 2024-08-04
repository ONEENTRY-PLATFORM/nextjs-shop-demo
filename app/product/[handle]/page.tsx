import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import Page from '@/app/product/[handle]/ProductPage';

const product = {
  featuredImage: {
    url: '',
    width: '',
    height: '',
    altText: '',
  },
  seo: {
    title: '',
    description: '',
  },
  id: 2458,
  tags: '',
  title: 'title',
  description: 'description',
  availableForSale: true,
  priceRange: {
    minVariantPrice: {
      currencyCode: 'usd',
      amount: 100,
    },
    maxVariantPrice: {
      currencyCode: 'usd',
      amount: 4500,
    },
  },
};

const HIDDEN_PRODUCT_TAG = '';
export async function generateMetadata({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
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

export default async function ProductPage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params,
}: {
  params: { handle: string };
}) {
  if (!product) return notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="flex flex-col bg-white py-8">
          <div className="size-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square size-full max-h-[550px] overflow-hidden" />
              }
            />
          </div>

          <Page />
        </div>
      </div>
    </>
  );
}
