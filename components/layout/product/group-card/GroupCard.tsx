import React from "react";
import ProductImage from "./ProductImage";
import PriceDisplay from "./PriceDisplay";
import ApplyButton from "./ApplyButton";

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
    <article className="flex flex-row justify-between p-4 rounded-xl bg-neutral-100">
      <div className="flex gap-2.5">

        <div className="flex flex-col w-[37%]">
          <h2 className="mb-5 text-sm leading-4 text-neutral-600">
            {title}
          </h2>
          <PriceDisplay
            currentPrice={currentPrice}
            originalPrice={originalPrice}
          />
          <ApplyButton />
        </div>

        <div className="flex flex-row w-[63%] justify-between">
          <ProductImage imageSrc="./images/catalog-img-4.svg" />
          <div className="shrink-0 my-auto w-3 aspect-square fill-neutral-600">
            +
          </div>
          <ProductImage imageSrc="./images/catalog-img-4.svg" />
        </div>
      </div>
    </article>
  );
};

export default GroupCard;
