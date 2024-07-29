import React from 'react';
import ProductImage from './ProductImage';
import PriceDisplay from './PriceDisplay';
import ApplyButton from './ApplyButton';

interface GroupCardProps {
  title: string;
  currentPrice: number;
  originalPrice: number;
}

const GroupCard: React.FC<GroupCardProps> = ({ title, currentPrice, originalPrice }) => {
  return (
    <article className="flex flex-row justify-start p-4 rounded-xl bg-neutral-100">
      <div className="flex gap-2.5 justify-center">
        
        <div className="flex flex-col mr-2.5">
          <h2 className="mb-5 text-sm leading-4 text-neutral-600">
            {title}
          </h2>
          <PriceDisplay 
            currentPrice={currentPrice} 
            originalPrice={originalPrice} 
          />
          <ApplyButton />
        </div>

        <ProductImage imageSrc='' />

        <div className="shrink-0 my-auto w-3 aspect-square fill-neutral-600">
          +
        </div>

        <ProductImage imageSrc='' />

      </div>
    </article>
  );
};

export default GroupCard;