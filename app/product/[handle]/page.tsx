import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getProductById } from '@/app/api/serverSideProps';

import { productsGroup, relatedItems } from '../../../components/data';
import ProductsGroup from '../../../components/layout/product/ProductsGroup';
import Product from '../../../components/layout/product/ProductSingle';
import RelatedItems from '../../../components/layout/product/RelatedItems';

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProductById(Number(params.handle), 'en_US');
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
  const product = await getProductById(Number(params.handle), 'en_US');

  if (!product) {
    return notFound();
  }

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

  const { blocks } = product;
  const hasBlocks = Array.isArray(blocks);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <div className="mx-auto w-full max-w-screen-xl">
        <div className="flex flex-col bg-white py-8">
          <Suspense
            fallback={
              <div className="relative aspect-square size-full max-h-[550px] overflow-hidden" />
            }
          />
          <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
            <Product product={product} />
            {hasBlocks &&
              blocks.map((block: string) => {
                if (block === 'multiply_items_offer') {
                  return (
                    <ProductsGroup
                      key={block}
                      title="These items are cheaper together"
                      productsGroup={productsGroup}
                    />
                  );
                } else if (block === 'similar') {
                  return (
                    <RelatedItems
                      key={block}
                      title="Features"
                      relatedItems={relatedItems}
                    />
                  );
                }
              })}
            {/*  */}
          </section>
        </div>
      </div>
    </>
  );
}
