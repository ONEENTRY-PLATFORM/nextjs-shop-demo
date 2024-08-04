import React from 'react';

import ProductCard from './product-card';

interface RelatedItemsProps {
  title: string;
  parentId: number;
  relatedItems: Array<{
    imageUrl: string;
    setName: string;
    itemCount: number;
    itemNames: string;
    currentPrice: number;
    originalPrice: number;
  }>;
}

const RelatedItems: React.FC<RelatedItemsProps> = ({
  title,
  relatedItems,
  parentId,
}) => {
  return (
    <section className="flex flex-col max-md:max-w-full">
      <h3 className="mb-5 text-base uppercase leading-5 text-neutral-600 max-md:max-w-full">
        {title}
      </h3>

      <div className="flex gap-4 max-lg:flex-wrap ">
        {relatedItems.map((product, i) => (
          <div
            key={i}
            className="relative box-border flex w-[calc(_20%_-_1rem_)] shrink-0 flex-col max-xl:w-[calc(_33.3333333%_-_1rem_)] max-md:w-[calc(_50%_-_1rem_)] max-sm:w-full"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedItems;
