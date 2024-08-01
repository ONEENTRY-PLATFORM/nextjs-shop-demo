import React from "react";
import ProductCard from "./product-card/ProductCard";

interface RelatedItemsProps {
  title: string;
  relatedItems: Array<{
    imageUrl: string;
    setName: string;
    itemCount: number;
    itemNames: string;
    currentPrice: number;
    originalPrice: number;
  }>;
}

const RelatedItems: React.FC<RelatedItemsProps> = ({ title, relatedItems }) => {
  return (
    <section className="flex flex-col max-md:max-w-full">
      <h3 className="mb-5 text-base leading-5 uppercase text-neutral-600 max-md:max-w-full">
        {title}
      </h3>

      <div className="flex max-lg:flex-wrap gap-4 ">
        {relatedItems.map((product, i) => (
          <div
            key={i}
            className="box-border flex relative flex-col shrink-0 w-[calc(_20%_-_1rem_)] max-xl:w-[calc(_33.3333333%_-_1rem_)] max-md:w-[calc(_50%_-_1rem_)] max-sm:w-full"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );  
};

export default RelatedItems;
