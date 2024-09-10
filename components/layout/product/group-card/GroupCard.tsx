import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import React from 'react';

import ApplyButton from './ApplyButton';
import PriceDisplay from './PriceDisplay';
import ProductImage from './ProductImage';

const GroupCard: React.FC<{
  product: IProductsEntity;
}> = ({ product }) => {
  const images = product.attributeValues?.more_pic.value;
  const pic1 = images[0]?.downloadLink;
  const pic2 = images[1]?.downloadLink;

  return (
    <div className="flex flex-row justify-between rounded-xl bg-[#F6F7F9] p-4 transition-shadow hover:shadow-lg">
      <div className="flex gap-2.5">
        <div className="flex w-[37%] flex-col">
          <h2 className="mb-5 text-sm leading-4 text-neutral-600">
            {product.localizeInfos.title}
          </h2>
          <PriceDisplay
            currentPrice={product.attributeValues?.sale.value}
            originalPrice={product.price}
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
    </div>
  );
};

export default GroupCard;
