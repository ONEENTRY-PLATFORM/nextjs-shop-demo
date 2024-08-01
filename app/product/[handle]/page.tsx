import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Suspense } from "react";

const product = {
  featuredImage: {
    url: "",
    width: "",
    height: "",
    altText: "",
  },
  seo: {
    title: "",
    description: "",
  },
  id: 2458,
  tags: "",
  title: "title",
  description: "description",
  availableForSale: true,
  priceRange: {
    minVariantPrice: {
      currencyCode: "usd",
      amount: 100,
    },
    maxVariantPrice: {
      currencyCode: "usd",
      amount: 4500,
    },
  },
};

const HIDDEN_PRODUCT_TAG = "";
export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  console.log(params);
  
  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage({ params }: {
  params: { handle: string };
}) {
  console.log(params);
  
  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
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
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            ></Suspense>
          </div>

          <div className="basis-full lg:basis-2/6">
            ProductDescription
          </div>
        </div>
        <RelatedProducts id={product.id} />
      </div>
    </>
  );
}

async function RelatedProducts({ id }: { id: number }) {
  const relatedProducts = [];

  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">
        Related Products
      </h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {id}
      </ul>
    </div>
  );
}
