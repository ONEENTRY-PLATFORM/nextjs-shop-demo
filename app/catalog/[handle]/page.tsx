import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getProductById } from '@/app/api/serverSideProps';
// import { productsGroup } from '../../../components/data';
import ProductsGroup from '@/components/layout/product/ProductsGroup';
import Product from '@/components/layout/product/ProductSingle';
import RelatedItems from '@/components/layout/product/RelatedItems';

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const data = await getProductById(Number(params.handle), 'en_US');

  const { isError, product } = data;
  if (isError || !product) {
    return notFound();
  }

  const { downloadLink, alt = 'alt' } =
    product.attributeValues.pic?.value || {};
  const indexable = product.isVisible;

  return {
    title: product?.localizeInfos.title,
    description: product.attributeValues.description?.value?.plainValue,
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
  const data = await getProductById(Number(params.handle), 'en_US');
  console.log(data);

  const { isError, product } = data;
  if (isError || !product) {
    return notFound();
  }
  const { attributeValues, localizeInfos, additional, statusIdentifier } =
    product;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: localizeInfos.title,
    description: attributeValues.description?.value,
    image: attributeValues.pic.value?.downloadLink,
    offers: {
      '@type': 'AggregateOffer',
      availability: statusIdentifier
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: attributeValues.currency?.value,
      highPrice: additional.prices?.max,
      lowPrice: additional.prices?.min,
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
      <div className="mx-auto flex w-full max-w-screen-xl flex-col bg-white py-8">
        <Suspense
          fallback={
            <div className="relative aspect-square size-full overflow-hidden" />
          }
        >
          <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
            <Product {...product} />
            {Array.isArray(product.blocks) &&
              product.blocks.map((block: string) => {
                if (block === 'multiply_items_offer') {
                  return (
                    <span key={block}>
                      <ProductsGroup id={10} />
                    </span>
                  );
                } else if (block === 'similar') {
                  return (
                    <RelatedItems
                      key={block}
                      id={product.id}
                      title="Features"
                    />
                  );
                }
              })}
            {/*  */}
          </section>
        </Suspense>
      </div>
    </>
  );
}
