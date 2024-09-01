import React from 'react';

import PriceDisplay from './PriceDisplay';
import ApplyButton from './ApplyButton';
import ProductImage from './ProductImage';

interface GroupCardProps {
  title: string;
  currentPrice: number;
  originalPrice: number;
}

const GroupCard: React.FC<GroupCardProps> = ({
  title,
  currentPrice,
  originalPrice,
}) => {
  return (
    <article className="flex flex-row justify-between rounded-xl bg-neutral-100 p-4">
      <div className="flex gap-2.5">
        <div className="flex w-[37%] flex-col">
          <h2 className="mb-5 text-sm leading-4 text-neutral-600">{title}</h2>
          <PriceDisplay
            currentPrice={currentPrice}
            originalPrice={originalPrice}
          />
          <ApplyButton />
        </div>

        <div className="flex w-[63%] flex-row justify-between">
          <ProductImage imageSrc="/images/catalog-img-4.svg" />
          <div className="my-auto aspect-square w-3 shrink-0 fill-neutral-600">
            +
          </div>
          <ProductImage imageSrc="/images/catalog-img-4.svg" />
        </div>
      </div>
    </article>
  );
};

export default GroupCard;
