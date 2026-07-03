import Link from 'next/link';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import AddToCartButton from '@/components/layout/product/components/AddToCartButton';
import FavoritesButton from '@/components/shared/FavoritesButton';

import CardAnimations from '../../animations/CardAnimations';
import PriceDisplay from './PriceDisplay';
import ProductImage from './ProductImage';
import Stickers from './Stickers';

/**
 * ProductCard component displays a single product in a compact card format.
 * It includes the product image, title, price information, and action buttons.
 * The card is wrapped in CardAnimations for entrance animations and is clickable
 * to navigate to the full product page.
 * @param   {object}           props            - Component properties
 * @param   {IProductsEntity}  props.product    - Product entity object containing all product information
 * @param   {string}           props.lang       - Current language shortcode for localization and price formatting
 * @param   {number}           props.index      - Index of element for animation staggering calculation
 * @param   {IAttributeValues} props.dict       - Dictionary of attribute values from server API for labels and messages
 * @param   {number}           props.pagesLimit - Number of items per page, used for calculating animation delays
 * @returns {JSX.Element}                       A product card with image, title, price, and action buttons
 */
const ProductCard = ({
  product,
  lang,
  dict,
  index,
  pagesLimit,
}: {
  product: IProductsEntity;
  lang: string;
  index: number;
  dict: IAttributeValues;
  pagesLimit: number;
}): JSX.Element => {
  /** Extract product data from the product entity */
  const { id, statusIdentifier, attributeValues, localizeInfos } = product;

  /** Get product title from localized information */
  const title = localizeInfos?.title || '';

  return (
    <CardAnimations
      className="product-card group"
      index={index}
      pagesLimit={pagesLimit}
    >
      <article
        className="flex size-full flex-col items-center"
        aria-labelledby={`product-title-${id}`}
      >
        {/*
          SSR-paint marker. The inline script executes ONLY while the
          browser parses the initially-streamed HTML document (scripts from
          innerHTML fragments are inert, so RSC-payload inserts — client
          navigations, load-more appends — never run it). It marks itself,
          not a React-managed node, to avoid hydration-diff warnings; React
          skips hydration diffing inside dangerouslySetInnerHTML content.
          CardAnimations skips the entrance animation for cards containing
          `script[data-painted]`: they are already visible, and hiding them
          at hydration time makes the whole catalog flash. Requires CSP to
          allow inline scripts.
        */}
        <span
          hidden
          dangerouslySetInnerHTML={{
            __html:
              '<script>document.currentScript.setAttribute("data-painted","")</script>',
          }}
        />
        <div className="z-10 flex justify-between gap-5 self-stretch">
          <Stickers attributeValues={attributeValues} />
          <FavoritesButton {...product} />
        </div>

        {/** Product image display */}
        <ProductImage attributeValues={attributeValues} alt={title} />

        {/** Product information section including title, price and add to cart button */}
        <div className="z-10 mt-auto mb-5 flex w-full max-w-40 flex-col gap-2.5">
          <h2
            id={`product-title-${id}`}
            className="text-center text-sm leading-4 text-neutral-600"
            // test id for e2e testing
            data-testid="product-title"
          >
            {title}
          </h2>

          <PriceDisplay attributeValues={attributeValues} lang={lang} />

          <AddToCartButton
            id={id}
            productTitle={title}
            statusIdentifier={statusIdentifier || ''}
            units={attributeValues?.units_product?.value as number}
            dict={dict}
            height={42}
            className="btn btn-md btn-primary"
          />
        </div>

        {/** Clickable overlay that navigates to the product detail page */}
        <Link
          prefetch={true}
          href={'/' + lang + '/shop/product/' + id}
          className="absolute top-0 left-0 z-0 flex size-full"
          aria-label={`View details for ${title}`}
          tabIndex={-1}
        ></Link>
      </article>
    </CardAnimations>
  );
};

export default ProductCard;
