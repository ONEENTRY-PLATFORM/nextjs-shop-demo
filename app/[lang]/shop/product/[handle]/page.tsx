import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { FC } from 'react';

import { getDictionary } from '@/app/[lang]/dictionaries';
import { getProductById } from '@/app/api';
import type { PageProps } from '@/app/types/global';
import ProductSingle from '@/components/layout/product';
import type { Locale } from '@/i18n-config';

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
  const { isError, product } = await getProductById(
    Number(params.handle),
    params.lang,
  );

  if (isError || !product) {
    return notFound();
  }

  const { downloadLink, alt = 'alt' } =
    product.attributeValues.pic?.value || {};
  const indexable = product.isVisible;

  return {
    title: product?.localizeInfos.title,
    description: product?.attributeValues.description?.value[0]?.plainValue,
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
const ProductPageLayout: FC<PageProps> = async ({
  params: { handle, lang },
}) => {
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
      <div className="mx-auto flex w-full max-w-screen-xl flex-col bg-white">
        <ProductSingle lang={lang} product={product} dict={dict} />
      </div>
    </>
  );
};

export default ProductPageLayout;
