import React from 'react';

import ApplyButton from './ApplyButton';
import PriceDisplay from './PriceDisplay';
import ProductImage from './ProductImage';

interface GroupCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  title: string;
  currentPrice: number;
  originalPrice: number;
}

const GroupCard: React.FC<GroupCardProps> = ({
  product,
  title,
  currentPrice,
  originalPrice,
}) => {
  const images = product.attributeValues.more_pic.value;
  const pic1 = images[0].downloadLink;
  const pic2 = images[1].downloadLink;

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
          {pic1 && <ProductImage imageSrc={pic1} />}
          <div className="my-auto aspect-square w-3 shrink-0 fill-neutral-600">
            +
          </div>
          {pic2 && <ProductImage imageSrc={pic2} />}
        </div>
      </div>
    </article>
  );
};

export default GroupCard;
