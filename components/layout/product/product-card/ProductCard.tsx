import Image from 'next/image';
import React from 'react';

import AddToCartButton from './AddToCartButton';
import IconButton from './IconButton';
import PriceDisplay from './PriceDisplay';

interface ProductCardProps {
  product: {
    imageUrl: string;
    setName: string;
    itemCount: number;
    itemNames: string;
    currentPrice: number;
    originalPrice: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    imageUrl,
    setName,
    itemCount = 2,
    itemNames = 'itemNames',
    currentPrice,
    originalPrice,
  } = product;

  return (
    <article className="flex w-full flex-col items-center rounded-3xl bg-neutral-100 p-4">
      <header className="flex justify-between gap-5 self-stretch">
        <IconButton iconSrc="./icons/heart.svg" />
        <IconButton iconSrc="./icons/heart.svg" />
      </header>

      <div className="relative size-40">
        <Image
          fill
          src={imageUrl}
          alt={`Product image for ${setName}`}
          className="mt-7 size-40 shrink-0 bg-zinc-300 object-cover"
        />
      </div>

      <section className="mb-5 mt-12 flex w-[153px] max-w-full flex-col gap-2.5">
        <h2 className="text-center text-sm leading-4 text-neutral-600">
          {setName} ({itemCount} items)
        </h2>
        <p className="text-center text-sm leading-4 text-neutral-600">
          {itemNames}
        </p>
        <PriceDisplay
          currentPrice={currentPrice}
          originalPrice={originalPrice}
        />
        <AddToCartButton />
      </section>
    </article>
  );
};

export default ProductCard;
