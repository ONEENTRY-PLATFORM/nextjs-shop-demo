import Image from 'next/image';
import Link from 'next/link';
import type { IOrderProducts } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC } from 'react';

import Placeholder from '@/components/shared/Placeholder';
import { UsePrice } from '@/components/utils';

const ProductCard: FC<{ product: IOrderProducts; currency: string }> = ({
  product,
  currency,
}) => {
  const { id, title, price, quantity, previewImage } = product;
  const productImage = previewImage?.[0]?.downloadLink || '';
  const formattedPrice = UsePrice({
    amount: price,
    currency: currency,
  });
  const formattedSubtotal = UsePrice({
    amount: price * Number(quantity),
    currency: currency,
  });

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
          <b>Quantity:</b> {quantity}
        </div>
        <div className="text-base">
          <b>Subtotal:</b> {formattedSubtotal}
        </div>
      </div>
      <Link
        href={`/shop/product/` + id}
        className="absolute left-0 top-0 z-0 flex size-full"
      ></Link>
    </div>
  );
};

export default ProductCard;
