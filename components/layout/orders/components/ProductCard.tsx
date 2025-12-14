/* eslint-disable jsdoc/reject-any-type */
import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import { memo } from 'react';

import Placeholder from '@/components/shared/Placeholder';
import { UsePrice } from '@/components/utils/utils';

interface ProductCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  lang: string;
  settings: {
    product_qty_title: {
      value: string;
    };
    product_card_title: {
      value: string;
    };
  };
}

/**
 * Order product card component.
 * Displays a product item in an order with its image, title, price, quantity, and subtotal.
 * Memoized to prevent unnecessary re-renders.
 * @param   {ProductCardProps} props          - Component props
 * @param   {any}              props.product  - Product entity object containing product details
 * @param   {string}           props.lang     - Current language shortcode for price formatting
 * @param   {object}           props.settings - Settings object with localized titles for quantity and subtotal
 * @returns {JSX.Element}                     Product card with image, details, and link to product page
 */
const ProductCard = memo(
  ({ product, lang, settings }: ProductCardProps): JSX.Element => {
    /** Extract product data with fallback values */
    const id = product.id || 0;
    const title = product.title || '';
    const price = product.price || 0;
    const quantity = product.quantity || 0;
    const previewImage = product.previewImage || [];
    const productImage = previewImage?.[0]?.downloadLink || '';

    /** Format the product price using the UsePrice utility */
    const formattedPrice = UsePrice({
      amount: price,
      lang,
    });

    /** Calculate and format the subtotal (price * quantity) */
    const formattedSubtotal = UsePrice({
      amount: price * Number(quantity),
      lang,
    });

    /** Extract localized settings with fallback values */
    const product_qty_title = settings?.product_qty_title || { value: '' };
    const product_card_title = settings?.product_card_title || { value: '' };

    /** Render the product card */
    return (
      <div className="relative flex w-full flex-row gap-4 py-2">
        {/** Product image container */}
        <div className="relative h-37.5 w-[320px]">
          {productImage ? (
            /** Display product image if available */
            <Image
              fill
              sizes="(min-width: 300px) 66vw, 100vw"
              src={productImage}
              alt={title}
              className="size-full shrink-0 object-cover"
            />
          ) : (
            /** Display placeholder if no image is available */
            <Placeholder />
          )}
        </div>

        {/** Product details section */}
        <div className="mb-5 flex w-full flex-col gap-2.5">
          {/** Product title */}
          <h2 className="text-base">{title}</h2>
          {/** Formatted product price */}
          <div className="text-base">{formattedPrice}</div>
          {/** Quantity with localized label */}
          <div className="text-base">
            <b>{product_qty_title.value}:</b> {quantity}
          </div>
          {/** Subtotal with localized label */}
          <div className="text-base">
            <b>{product_card_title.value}:</b> {formattedSubtotal}
          </div>
        </div>

        {/** Link to product page for more details */}
        <Link
          prefetch={true}
          href={'/' + lang + '/shop/product/' + id}
          className="absolute left-0 top-0 z-0 flex size-full rounded-lg transition-shadow duration-500 hover:shadow-xl"
          aria-label={`View details for ${title}`}
        ></Link>
      </div>
    );
  },
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;
