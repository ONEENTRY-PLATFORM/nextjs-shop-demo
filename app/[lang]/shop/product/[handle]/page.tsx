/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type FC } from 'react';

import { getDictionary } from '@/app/[lang]/dictionaries';
import { getProductById } from '@/app/api';
import ProductClientWrapper from '@/components/layout/product/ProductClientWrapper';

/**
 * Generate page metadata
 * @async server component
 * @param params page params
 * @returns page metadata
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string; lang: string }>;
}): Promise<Metadata> {
  const { handle, lang } = await params;

  const { product } = await getProductById(Number(handle), lang);

  if (!product) {
    return notFound();
  }
  const { attributeValues } = product;

  const title = attributeValues?.title?.value || 'Product';
  const description = attributeValues?.description?.value || '';
  const image = attributeValues?.pic?.value?.downloadLink || '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

/**
 * Product page layout
 * @param product product entity object
 * @param lang current language shortcode
 * @param dict dictionary from server api
 *
 * @returns JSX.Element
 */
const ProductPageLayout: FC<{
  product: Awaited<ReturnType<typeof getProductById>>;
  lang: string;
  dict: Awaited<ReturnType<typeof getDictionary>>;
}> = async ({
  product,
  lang,
  dict,
}: {
  product: any;
  lang: any;
  dict: any;
}) => {
  if (!product) {
    return notFound();
  }

  const { attributeValues } = product;

  // Product structured data
  // https://developers.google.com/search/docs/appearance/structured-data/product
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: attributeValues.title?.value,
    image: attributeValues.pic?.value?.downloadLink
      ? [attributeValues.pic?.value?.downloadLink]
      : [],
    description: attributeValues.description?.value,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.marker,
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${lang}/shop/product/${product.id}`,
      priceCurrency: attributeValues.currency?.value,
      price: attributeValues.price?.value,
      availability: attributeValues.in_stock?.value
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
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
      <main className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col bg-white">
        <ProductClientWrapper lang={lang} product={product} dict={dict} />
      </main>
    </>
  );
};

const ProductPage = async ({
  params,
}: {
  params: Promise<{ handle: string; lang: string }>;
}) => {
  const { handle, lang } = await params;
  const product = await getProductById(Number(handle), lang);
  const dict = await getDictionary(lang as any);

  return <ProductPageLayout product={product} lang={lang} dict={dict} />;
};

export default ProductPage;
