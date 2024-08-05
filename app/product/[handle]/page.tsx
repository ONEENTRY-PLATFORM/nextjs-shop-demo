import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import Product from '../../../components/layout/product/Product';
import ProductsGroup from '../../../components/layout/product/ProductsGroup';
import RelatedItems from '../../../components/layout/product/RelatedItems';

const productsGroup = [
  {
    imageUrl: '/images/catalog-img-4.svg',
    setName: 'Set Name',
    itemCount: 1,
    itemNames: '',
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: '/images/catalog-img-4.svg',
    setName: 'Set Name',
    itemCount: 1,
    itemNames: '',
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: '/images/catalog-img-4.svg',
    setName: 'Set Name',
    itemCount: 1,
    itemNames: '',
    currentPrice: 2500,
    originalPrice: 3200,
  },
];

const relatedItems = [
  {
    imageUrl: '/images/catalog-img-4.svg',
    setName: 'Set Name',
    itemCount: 1,
    itemNames: '',
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: '/images/catalog-img-4.svg',
    setName: 'Set Name',
    itemCount: 1,
    itemNames: '',
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: '/images/catalog-img-4.svg',
    setName: 'Set Name',
    itemCount: 1,
    itemNames: '',
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: '/images/catalog-img-4.svg',
    setName: 'Set Name',
    itemCount: 1,
    itemNames: '',
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: '/images/catalog-img-4.svg',
    setName: 'Set Name',
    itemCount: 1,
    itemNames: '',
    currentPrice: 2500,
    originalPrice: 3200,
  },
];

const product = {
  featuredImage: {
    url: '/images/catalog-img-4.svg',
    width: 300,
    height: 300,
    altText: '',
  },
  seo: {
    title: '',
    description: '',
  },
  id: 2458,
  price: 2458,
  tags: '',
  title: 'title',
  description:
    "The developers' and CMS users' vast, unique experience became the basis of HeadlessCMS OneEntry. We know what the users want, so we took into account the needs of business owners, users and developers to create our product. All the tools we've developed are aimed to improve the processes of project management.",
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
          <div className="">
            <Suspense
              fallback={
                <div className="relative aspect-square size-full max-h-[550px] overflow-hidden" />
              }
            />
          </div>
          <section className="relative mx-auto box-border flex w-full max-w-[1240px] shrink-0 grow flex-col self-stretch">
            <Product product={product} />
            <ProductsGroup
              title="These items are cheaper together"
              productsGroup={productsGroup}
            />
            <RelatedItems
              title="Features"
              relatedItems={relatedItems}
              parentId={1}
            />
          </section>
        </div>
      </div>
    </>
  );
}
