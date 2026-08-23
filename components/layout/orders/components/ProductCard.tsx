import Image from 'next/image';
import Link from 'next/link';
import type { IAttributeValues, IOrderProducts } from 'oneentry/types';
import type { JSX } from 'react';
import { memo } from 'react';

import Placeholder from '@/components/shared/Placeholder';
import { UsePrice } from '@/components/utils/utils';

interface ProductCardProps {
  product: IOrderProducts;
  lang: string;
  /** Parent order currency — order line items share it (orders rule). */
  currency?: string;
  settings: IAttributeValues | undefined;
}

/**
 * Order product card component.
 * Displays a product item in an order with its image, title, price, quantity, and subtotal.
 * Memoized to prevent unnecessary re-renders.
 * @param   {ProductCardProps} props          - Component props
 * @param   {IOrderProducts}   props.product  - Order product line item containing product details
 * @param   {string}           props.lang     - Current language shortcode for price formatting
 * @param   {IAttributeValues} props.settings - Block attribute values with localized titles for quantity and subtotal
 * @returns {JSX.Element}                     Product card with image, details, and link to product page
 */
const ProductCard = memo(
  ({ product, lang, currency, settings }: ProductCardProps): JSX.Element => {
    /** Extract product data with fallback values */
    const id = product.id || 0;
    const title = product.title || '';
    const price = product.price || 0;
    const quantity = product.quantity || 0;

    /**
     * Preview image — the SDK types it as a single picture object, but older
     * responses returned an array, so unwrap both shapes defensively.
     */
    const previewImage = product.previewImage;
    const productImage =
      (Array.isArray(previewImage)
        ? previewImage[0]?.downloadLink
        : previewImage?.downloadLink) || '';

    /** Format the product price using the UsePrice utility */
    const formattedPrice = UsePrice({
      amount: price,
      lang,
      currency,
    });

    /** Calculate and format the subtotal (price * quantity) */
    const formattedSubtotal = UsePrice({
      amount: price * Number(quantity),
      lang,
      currency,
    });

    /** Extract localized settings with fallback values — the CMS block may be incomplete */
    const productQtyTitle =
      (settings?.product_qty_title?.value as string) || 'Quantity';
    const productCardTitle =
      (settings?.product_card_title?.value as string) || 'Subtotal';

    /** Render the product card */
    return (
      <div className="relative flex w-full flex-row gap-4 py-2">
        {/** Product image container */}
        <div className="relative h-37.5 w-80">
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
            <b>{productQtyTitle}:</b> {quantity}
          </div>
          {/** Subtotal with localized label */}
          <div className="text-base">
            <b>{productCardTitle}:</b> {formattedSubtotal}
          </div>
        </div>

        {/** Link to product page for more details — no prefetch on repeating list cards */}
        <Link
          prefetch={false}
          href={'/' + lang + '/shop/product/' + id}
          className="absolute top-0 left-0 z-0 flex size-full rounded-lg transition-shadow duration-500 hover:shadow-xl"
          aria-label={`View details for ${title}`}
        ></Link>
      </div>
    );
  },
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;
