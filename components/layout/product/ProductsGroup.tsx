import React from "react";
import GroupCard from "./group-card/GroupCard";

interface ProductsGroupProps {
  title: string;
  productsGroup: Array<{
    imageUrl: string;
    setName: string;
    itemCount: number;
    itemNames: string;
    currentPrice: number;
    originalPrice: number;
  }>;
}

const ProductsGroup: React.FC<ProductsGroupProps> = ({ title, productsGroup }) => {
  return (
    <section className="flex flex-col mb-8 max-md:max-w-full">

      <h3 className="mb-5 text-base leading-5 uppercase text-neutral-600 max-md:max-w-full">
        {title}
      </h3>

      <div className="flex flex-row gap-2.5 justify-between max-md:max-w-full">
        {productsGroup.map((item, i) => (
          <div
            key={i}
            className="box-border flex relative flex-col shrink-0 w-[32.5%] max-md:w-full"
          >
            <GroupCard
              title={item.setName}
              currentPrice={item.currentPrice}
              originalPrice={item.originalPrice}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductsGroup;
