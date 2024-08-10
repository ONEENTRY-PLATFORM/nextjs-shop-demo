/* eslint-disable @next/next/no-img-element */
import React from 'react';

import DeleteButton from './DeleteButton';
import QuantitySelector from './QuantitySelector';

interface ProductCardProps {
  imageSrc: string;
  productName: string;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageSrc,
  productName,
  price,
}) => {
  return (
    <article className="flex w-full justify-between gap-5 border border-solid border-neutral-400 bg-white max-md:flex-wrap max-sm:flex max-sm:flex-row">
      <div className="flex justify-between gap-5">
        <div className="relative mb-auto box-border flex shrink-0 flex-row self-center">
          <img
            loading="lazy"
            src={imageSrc}
            alt=""
            className="aspect-square w-[23px] shrink-0 self-start"
          />
        </div>
        <div className="h-[151px] w-[129px] shrink-0 rounded-xl bg-slate-300" />
        <div className="flex flex-col gap-5 self-start text-neutral-600">
          <h2 className="text-base leading-8">{productName}</h2>
          <p className="text-xl font-bold leading-8">$ {price}</p>
        </div>
      </div>
      <div className="flex gap-5 self-start text-xl font-bold leading-8 text-neutral-600 max-sm:flex max-sm:flex-row">
        <QuantitySelector />
        <DeleteButton />
      </div>
    </article>
  );
};

export default ProductCard;
