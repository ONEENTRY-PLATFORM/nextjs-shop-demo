import Image from 'next/image';
import Link from 'next/link';
// import type { IOrderProducts } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC } from 'react';
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
 * Order product card
 * @param product - product entity object
 * @param lang - current language shortcode
 * @param settings - settings object with localized titles
 *
 * @returns JSX.Element
 */
const ProductCard: FC<ProductCardProps> = memo(
  ({ product, lang, settings }: ProductCardProps) => {
    // extract data from product with fallbacks
    const id = product.id || 0;
    const title = product.title || '';
    const price = product.price || 0;
    const quantity = product.quantity || 0;
    const previewImage = product.previewImage || [];
    const productImage = previewImage?.[0]?.downloadLink || '';

    const formattedPrice = UsePrice({
      amount: price,
      lang,
    });
    const formattedSubtotal = UsePrice({
      amount: price * Number(quantity),
      lang,
    });

    // Extract settings with fallbacks
    const product_qty_title = settings?.product_qty_title || { value: '' };
    const product_card_title = settings?.product_card_title || { value: '' };

    return (
      <div className="relative flex w-full flex-row gap-4 py-2">
        <div className="relative h-[150px] w-[320px]">
          {productImage ? (
            <Image
              fill
              sizes="(min-width: 300px) 66vw, 100vw"
              src={productImage}
              alt={title}
              className="size-full shrink-0 object-cover"
            />
          ) : (
            <Placeholder />
          )}
        </div>
        <div className="mb-5 flex w-full flex-col gap-2.5">
          <h2 className="text-base">{title}</h2>
          <div className="text-base">{formattedPrice}</div>
          <div className="text-base">
            <b>{product_qty_title.value}:</b> {quantity}
          </div>
          <div className="text-base">
            <b>{product_card_title.value}:</b> {formattedSubtotal}
          </div>
        </div>
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
