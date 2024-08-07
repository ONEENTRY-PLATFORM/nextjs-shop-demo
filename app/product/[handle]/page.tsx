import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getProductById } from '@/app/api/serverSideProps';

import ProductsGroup from '../../../components/layout/product/ProductsGroup';
import Product from '../../../components/layout/product/ProductSingle';
import RelatedItems from '../../../components/layout/product/RelatedItems';

// const productsGroup = [
//   {
//     imageUrl: '/images/catalog-img-4.svg',
//     setName: 'Set Name',
//     itemCount: 1,
//     itemNames: '',
//     currentPrice: 2500,
//     originalPrice: 3200,
//   },
//   {
//     imageUrl: '/images/catalog-img-4.svg',
//     setName: 'Set Name',
//     itemCount: 1,
//     itemNames: '',
//     currentPrice: 2500,
//     originalPrice: 3200,
//   },
//   {
//     imageUrl: '/images/catalog-img-4.svg',
//     setName: 'Set Name',
//     itemCount: 1,
//     itemNames: '',
//     currentPrice: 2500,
//     originalPrice: 3200,
//   },
// ];

// const relatedItems = [
//   {
//     imageUrl: '/images/catalog-img-4.svg',
//     setName: 'Set Name',
//     itemCount: 1,
//     itemNames: '',
//     currentPrice: 2500,
//     originalPrice: 3200,
//   },
//   {
//     imageUrl: '/images/catalog-img-4.svg',
//     setName: 'Set Name',
//     itemCount: 1,
//     itemNames: '',
//     currentPrice: 2500,
//     originalPrice: 3200,
//   },
//   {
//     imageUrl: '/images/catalog-img-4.svg',
//     setName: 'Set Name',
//     itemCount: 1,
//     itemNames: '',
//     currentPrice: 2500,
//     originalPrice: 3200,
//   },
//   {
//     imageUrl: '/images/catalog-img-4.svg',
//     setName: 'Set Name',
//     itemCount: 1,
//     itemNames: '',
//     currentPrice: 2500,
//     originalPrice: 3200,
//   },
//   {
//     imageUrl: '/images/catalog-img-4.svg',
//     setName: 'Set Name',
//     itemCount: 1,
//     itemNames: '',
//     currentPrice: 2500,
//     originalPrice: 3200,
//   },
// ];

// const product = {
//   featuredImage: {
//     url: '/images/catalog-img-4.svg',
//     width: 300,
//     height: 300,
//     altText: '',
//   },
//   seo: {
//     title: '',
//     description: '',
//   },
//   id: 2458,
//   price: 2458,
//   tags: '',
//   title: 'title',
//   description:
//     "The developers' and CMS users' vast, unique experience became the basis of HeadlessCMS OneEntry. We know what the users want, so we took into account the needs of business owners, users and developers to create our product. All the tools we've developed are aimed to improve the processes of project management.",
//   availableForSale: true,
//   priceRange: {
//     minVariantPrice: {
//       currencyCode: 'usd',
//       amount: 100,
//     },
//     maxVariantPrice: {
//       currencyCode: 'usd',
//       amount: 4500,
//     },
//   },
// };

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProductById({
    id: Number(params.handle),
    langCode: 'en_US',
  });
  if (!product) return notFound();

  const { downloadLink, alt = 'alt' } = product.attributeValues.pic.value || {};
  const indexable = !product.isVisible;

  return {
    title: product.localizeInfos.title,
    description: product.attributeValues.description.value.plainValue,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: downloadLink
      ? {
          images: [
            {
              url: downloadLink,
              width: 300,
              height: 300,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProductById({
    id: Number(params.handle),
    langCode: 'en_US',
  });
  if (!product) return notFound();

  console.log(product);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.localizeInfos.title,
    description: product.attributeValues.description.value,
    image: product.attributeValues.pic.value.downloadLink,
    offers: {
      '@type': 'AggregateOffer',
      //   availability: product.availableForSale
      //     ? 'https://schema.org/InStock'
      //     : 'https://schema.org/OutOfStock',
      priceCurrency: product.attributeValues.currency.value,
      highPrice: product.additional.prices.max,
      lowPrice: product.additional.prices.min,
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
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col bg-white py-8">
          <Suspense
            fallback={
              <div className="relative aspect-square size-full max-h-[550px] overflow-hidden" />
            }
          />
          <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
            <Product product={product} />
            {/* <ProductsGroup
              title="These items are cheaper together"
              productsGroup={productsGroup}
            /> */}
            {/* <RelatedItems
              title="Features"
              relatedItems={relatedItems}
              parentId={1}
            /> */}
          </section>
        </div>
      </div>
    </>
  );
}
