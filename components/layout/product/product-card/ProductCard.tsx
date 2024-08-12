import Image from 'next/image';
import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { Key } from 'react';

import AddToCartButton from './AddToCartButton';
import IconButton from './IconButton';
import PriceDisplay from './PriceDisplay';

const ProductCard: React.FC<IProductsEntity> = (product) => {
  return (
    <article className="relative flex size-full flex-col items-center rounded-3xl bg-neutral-100 p-4">
      <header className="flex justify-between gap-5 self-stretch">
        {[product?.attributeValues?.stickers].map(
          (
            sticker: {
              value: {
                value: string;
                title: string;
              };
            },
            i: Key,
          ) => {
            return <IconButton key={i} sticker={sticker} />;
          },
        )}
      </header>

      <div className="relative size-40">
        <Image
          fill
          src={product.attributeValues?.pic.value.downloadLink}
          alt={`Product image`}
          className="mt-7 size-40 shrink-0 object-cover"
        />
      </div>

      <section className="z-10 mb-5 mt-12 flex w-[153px] max-w-full flex-col gap-2.5">
        <h2 className="text-center text-sm leading-4 text-neutral-600">
          {product.localizeInfos?.title}
          {/*  ({itemCount} items) */}
        </h2>
        <p className="text-center text-sm leading-4 text-neutral-600">
          {/* {itemNames} */}
        </p>
        <PriceDisplay
          currentPrice={product.attributeValues?.sale?.value}
          originalPrice={product.attributeValues?.price?.value}
        />
        <AddToCartButton />
      </section>
      <Link
        href={`product/` + product.id}
        className="absolute left-0 top-0 z-0 flex size-full"
      ></Link>
    </article>
  );
};

export default ProductCard;
