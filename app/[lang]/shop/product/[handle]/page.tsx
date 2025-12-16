import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

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
 * Product page.
 * @param   {object}                                    props        - Page props.
 * @param   {Promise<{ handle: string; lang: string }>} props.params - Page params with handle and lang.
 * @returns {Promise<JSX.Element>}                                   Promise<JSX.Element> - Product page layout.
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 */
const ProductPageLayout = async ({
  params,
}: {
  params: Promise<{ handle: string; lang: string }>;
}): Promise<JSX.Element> => {
  const { lang, handle } = await params;
  /** Get the dictionary from the API and set the server provider. */
  const dict = await getDictionary(lang as Locale);

  /** Get product by current Id */
  const { product, isError } = await getProductById(Number(handle), lang);

  /** Return 404 page if product not found or an error occurred */
  if (isError || !product) {
    return notFound();
  }

  /** Extract data from product for structured data generation */
  const { attributeValues, localizeInfos, additional, statusIdentifier } =
    product;

  /**
   * Product JSON-LD structured data for SEO
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
          dict={dict}
          product={product as IProductsEntity}
        />
      </div>
    </>
  );
};

export default ProductPageLayout;

/**
 * Pre-generation of a portion of product cards for each locale.
 * @returns {Promise<Array<{ lang: string; handle: string }>>} Array of parameters for static generation.
 */
export async function generateStaticParams(): Promise<
  Array<{ lang: string; handle: string }>
> {
  const params: Array<{ lang: string; handle: string }> = [];
  /** Iterate through each supported locale to generate params */
  for (const lang of i18n.locales) {
    /** Fetch products for the current locale with a limit of 100 */
    const { products } = await getProducts({
      lang,
      params: {},
      offset: 0,
      limit: 100,
    });

    /** Process products and add them to the params array */
    if (products && Array.isArray(products)) {
      for (const product of products) {
        if (product) {
          /** Add product ID as handle parameter for static generation */
          params.push({ lang, handle: String(product.id) });
        }
      }
    }
  }
  return params;
}

/**
 * Generate page metadata.
 * @param   {object}                                    props        - Page params with handle and lang.
 * @param   {Promise<{ handle: string; lang: string }>} props.params - Page params with handle and lang.
 * @returns {Promise<Metadata>}                                      Metadata object.
 * @see {@link https://nextjs.org/docs/app/building-your-application/optimizing/metadata#dynamic-metadata Next.js docs}
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string; lang: string }>;
}): Promise<Metadata> {
  const { handle, lang } = await params;
  /** Fetch product data by ID for the current locale */
  const result = await getProductById(Number(handle), lang);
  const { product, isError } = result;

  /** Return 404 page if product not found or an error occurred */
  if (isError || !product) {
    return notFound();
  }
  /** Extract required data from product for metadata generation */
  const { attributeValues, localizeInfos, isVisible } = product;

  /** Generate and return metadata object using the extracted data */
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
