import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import { getDictionary } from '@/app/[lang]/dictionaries';
import { getProductById } from '@/app/api';
import ProductClientWrapper from '@/components/layout/product/ProductClientWrapper';

interface ProductParams {
  handle: string;
  lang: string;
}

interface ProductPageProps {
  params: Promise<ProductParams>;
}

interface ProductJsonLd {
  '@context': string;
  '@type': string;
  name: string | undefined;
  image: string[];
  description: string | undefined;
  sku: string | undefined;
  brand: {
    '@type': string;
    name: string | undefined;
  };
  offers: {
    '@type': string;
    url: string;
    priceCurrency: string | undefined;
    price: number | undefined;
    availability: string;
  };
}

/**
 * Generate page metadata
 * @param params Page parameters containing handle and language
 * @returns Page metadata
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle, lang } = await params;

  // Validate product ID
  const productId = Number(handle);
  if (isNaN(productId)) {
    return notFound();
  }

  const { product, isError } = await getProductById(productId, lang);

  if (isError || !product) {
    return notFound();
  }

  const { attributeValues } = product;

  const title = (attributeValues?.title?.value as string) || 'Product';
  const description = (attributeValues?.description?.value as string) || '';
  const image = (attributeValues?.pic?.value?.downloadLink as string) || '';

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

interface ProductPageLayoutProps {
  product: IProductsEntity;
  lang: string;
  dict: IAttributeValues;
}

/**
 * Product page layout component
 * @param props Product page layout props
 * @returns JSX Element
 */
const ProductPageLayout: FC<ProductPageLayoutProps> = ({
  product,
  lang,
  dict,
}) => {
  if (!product) {
    return notFound();
  }

  const { attributeValues, sku, statusIdentifier: marker, id } = product;

  // Product structured data
  // https://developers.google.com/search/docs/appearance/structured-data/product
  const productJsonLd: ProductJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: attributeValues.title?.value as string,
    image: attributeValues.pic?.value?.downloadLink
      ? [attributeValues.pic?.value?.downloadLink as string]
      : [],
    description: attributeValues.description?.value as string,
    sku: sku || undefined,
    brand: {
      '@type': 'Brand',
      name: marker || undefined,
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${lang}/shop/product/${id}`,
      priceCurrency: attributeValues.currency?.value as string,
      price: attributeValues.price?.value as number,
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

/**
 * Product page component
 * @param props Product page props
 * @returns Product page
 */
const ProductPage = async ({ params }: ProductPageProps) => {
  const { handle, lang } = await params;

  // Validate product ID
  const productId = Number(handle);
  if (isNaN(productId)) {
    return notFound();
  }

  const { product, isError } = await getProductById(productId, lang);

  if (isError || !product) {
    return notFound();
  }

  const dict = await getDictionary(lang as keyof typeof getDictionary);

  return <ProductPageLayout product={product} lang={lang} dict={dict} />;
};

export default ProductPage;
