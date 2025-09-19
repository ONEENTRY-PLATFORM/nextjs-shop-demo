import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { FC } from 'react';

import { getDictionary } from '@/app/[lang]/dictionaries';
import { getProductById } from '@/app/api';
import ProductSingleServer from '@/components/layout/product/ProductSingleServer';
import type { Locale } from '@/i18n-config';
import { i18n } from '@/i18n-config';

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
  params: { handle: string; lang: string };
}): Promise<Metadata> {
  const { handle, lang } = await params;
  const { isError, product } = await getProductById(Number(handle), lang);

  if (isError || !product) {
    return notFound();
  }

  const { downloadLink, alt = 'alt' } =
    product.attributeValues.pic?.value || {};
  const indexable = product.isVisible;

  return {
    title: product?.localizeInfos.title,
    description: product?.attributeValues.description?.value[0]?.plainValue,
    alternates: {
      languages: Object.fromEntries(
        i18n.locales.map((l) => [l, `/${l}/shop/product/${handle}`]),
      ),
      canonical: `/${lang}/shop/product/${handle}`,
    },
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

/**
 * Product page
 * @async server component
 * @param params page params
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns Product page layout JSX.Element
 */

const ProductPageLayout: FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<{ handle: string; lang: any; product: any }>;
}> = async ({ params }) => {
  const { handle, lang } = await params;
  // Get the dictionary from the API and set the server provider.
  const dict = await getDictionary(lang as Locale);

  // Get product by current Id
  const { isError, product } = await getProductById(Number(handle), lang);

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
    name: localizeInfos.title,
    description: attributeValues.description?.value[0]?.plainValue,
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
      <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col bg-white">
        <ProductSingleServer lang={lang} product={product} dict={dict} />
      </div>
    </>
  );
};

export default ProductPageLayout;

/**
 * Pre-generation of a portion of product cards for each locale
 */
export async function generateStaticParams() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: Array<{ lang: string; handle: string; product: any }> = [];
  for (const lang of i18n.locales) {
    // We need to get an actual product ID to generate static params
    // For now, we'll use a placeholder - in a real implementation, you'd fetch product IDs
    const productId = 1; // Replace with actual product ID fetching logic
    const { product } = await getProductById(productId, lang);
    if (product) {
      params.push({ lang, handle: String(product.id), product });
    }
  }
  return params;
}
