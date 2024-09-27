import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getProductById } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import Product from '@/components/layout/product/ProductSingle';

// generateMetadata
export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const langCode = 'en_US';
  const { isError, product } = await getProductById(
    Number(params.handle),
    langCode,
  );

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

// ProductPage
export default async function ProductPage({
  params: { handle, lang },
}: {
  params: { handle: string; lang: string };
}) {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const { isError, product } = await getProductById(Number(handle), langCode);

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
    image: attributeValues.pic?.value?.downloadLink,
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
      <div className="mx-auto flex w-full max-w-screen-xl flex-col bg-white">
        <Product {...product} />
      </div>
    </>
  );
}
