import Image from 'next/image';
import Link from 'next/link';
import type { IOrderProducts } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC } from 'react';

import Placeholder from '@/components/shared/Placeholder';
import { UsePrice } from '@/components/utils';

/**
 * Order product card
 * @param product product entity object
 * @param lang current language shortcode
 * @param settings
 *
 * @returns JSX.Element
 */
const ProductCard: FC<{
  product: IOrderProducts;
  lang: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: Record<string, any>;
}> = ({ product, lang, settings }) => {
  // extract data from product
  const { id, title, price, quantity, previewImage } = product;
  const productImage = previewImage?.[0]?.downloadLink || '';
  const formattedPrice = UsePrice({
    amount: price,
    lang,
  });
  const formattedSubtotal = UsePrice({
    amount: price * Number(quantity),
    lang,
  });

  const { product_qty_title, product_card_title } = settings;

  return (
    <div className="relative flex w-full flex-row gap-4">
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
        className="absolute left-0 top-0 z-0 flex size-full rounded-lg hover:border hover:border-solid"
      ></Link>
    </div>
  );
};

export default ProductCard;
