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
      <div className="z-10 flex justify-between gap-5 self-stretch">
        <Stickers attributeValues={attributeValues} />
        <FavoritesButton {...product} />
      </div>

      {/** Product image display */}
      <ProductImage attributeValues={attributeValues} alt={title} />

      {/** Product information section including title, price and add to cart button */}
      <div className="z-10 mb-5 mt-auto flex w-full max-w-40 flex-col gap-2.5">
        <h2 className="text-center text-sm leading-4 text-neutral-600">
          {title}
        </h2>

        <PriceDisplay attributeValues={attributeValues} lang={lang} />

        <AddToCartButton
          id={id}
          productTitle={title}
          statusIdentifier={statusIdentifier || ''}
          units={attributeValues?.units_product?.value}
          dict={dict}
          height={42}
          className="btn btn-md btn-primary"
        />
      </div>

      {/** Clickable overlay that navigates to the product detail page */}
      <Link
        prefetch={true}
        href={'/' + lang + '/shop/product/' + id}
        className="absolute left-0 top-0 z-0 flex size-full"
      ></Link>
    </CardAnimations>
  );
};

export default ProductCard;
