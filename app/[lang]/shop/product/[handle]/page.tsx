import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import { getDictionary } from '@/app/[lang]/dictionaries';
import { getProductById, getProducts } from '@/app/api';
import {
  getImageUrl,
  getString,
  getText,
} from '@/app/api/hooks/useAttributesData';
import { generatePageMetadata } from '@/app/utils/generatePageMetadata';
import ProductSingleServer from '@/components/layout/product/ProductSingleServer';
import type { Locale } from '@/i18n-config';
import { i18n } from '@/i18n-config';

/**
 * Product page
 *
 * @async server component
 * @param params page params
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns Product page layout JSX.Element
 */
const ProductPageLayout: FC<{
  params: Promise<{ handle: string; lang: string }>;
}> = async ({ params }) => {
  const { lang, handle } = await params;
  // Get the dictionary from the API and set the server provider.
  const dict = await getDictionary(lang as Locale);

  // Get product by current Id
  const { product, isError } = await getProductById(Number(handle), lang);

  if (isError || !product) {
    return notFound();
  }

  // extract data from product
  const { attributeValues, localizeInfos, additional, statusIdentifier } =
    product;

  /**
   * product Json liked data
   * https://json-ld.org/
   */
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: localizeInfos?.title,
    description: getText('description', attributeValues, 'plain'),
    image: getImageUrl('pic', attributeValues),
    offers: {
      '@type': 'AggregateOffer',
      availability: statusIdentifier
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: getString('currency', attributeValues),
      highPrice: additional?.prices?.max || 1,
      lowPrice: additional?.prices?.min || 1,
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
      <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col bg-white">
        <ProductSingleServer
          lang={lang}
          product={product as IProductsEntity}
          dict={dict}
        />
      </div>
    </>
  );
};

export default ProductPageLayout;

/**
 * Pre-generation of a portion of product cards for each locale
 */
export async function generateStaticParams() {
  const params: Array<{ lang: string; handle: string }> = [];
  for (const lang of i18n.locales) {
    const { products } = await getProducts({
      lang,
      params: {},
      offset: 0,
      limit: 100,
    });

    if (products && Array.isArray(products)) {
      for (const product of products) {
        if (product) {
          params.push({ lang, handle: String(product.id) });
        }
      }
    }
  }
  return params;
}

/**
 * Generate page metadata
 * @async server component
 * @param params page params
 * @see {@link https://nextjs.org/docs/app/building-your-application/optimizing/metadata#dynamic-metadata Next.js docs}
 * @returns metadata
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string; lang: string }>;
}): Promise<Metadata> {
  const { handle, lang } = await params;
  const result = await getProductById(Number(handle), lang);
  const { product, isError } = result;

  if (isError || !product) {
    return notFound();
  }
  const { attributeValues, localizeInfos, isVisible } = product;

  // Return metadata object
  return generatePageMetadata({
    handle: handle,
    title: localizeInfos.title,
    description: localizeInfos.plainContent,
    isVisible: isVisible,
    imageUrl: getImageUrl('pic', attributeValues),
    imageAlt: localizeInfos.title,
    lang: lang,
    baseUrl: `/${lang}/shop/product/${handle}`,
  });
}
