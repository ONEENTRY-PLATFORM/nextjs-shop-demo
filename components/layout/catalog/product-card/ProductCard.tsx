import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { Key } from 'react';

import AddToCartButton from '../../product/components/AddToCartButton';
import FavoritesButton from './FavoritesButton';
import PriceDisplay from './PriceDisplay';
import ProductImage from './ProductImage';
import Sticker from './Sticker';

const ProductCard: React.FC<IProductsEntity> = (product) => {
  const { id, attributeValues, localizeInfos } = product;
  const productImage = attributeValues.pic.value;

  return (
    <div className="relative flex size-full flex-col items-center rounded-[20px] bg-[#F6F7F9] p-4 transition-shadow duration-500 hover:shadow-xl">
      <div className="z-10 flex justify-between gap-5 self-stretch">
        {[attributeValues.stickers].map(
          (
            sticker: {
              value: {
                value: string;
                title: string;
                extended: {
                  value: {
                    downloadLink: string;
                  };
                };
              };
            },
            i: Key,
          ) => {
            return <Sticker key={i} sticker={sticker} />;
          },
        )}
        <FavoritesButton {...product} />
      </div>

      <ProductImage
        imageSrc={
          productImage.length
            ? productImage[0].downloadLink
            : productImage.downloadLink
        }
        alt={localizeInfos.title}
      />

      <div className="z-10 mb-5 mt-auto flex w-[153px] max-w-full flex-col gap-2.5">
        <h2 className="text-center text-sm leading-4 text-neutral-600">
          {localizeInfos.title}
        </h2>

        <PriceDisplay
          currentPrice={attributeValues.sale?.value}
          originalPrice={attributeValues.price?.value}
        />

        <AddToCartButton
          product={product}
          height={42}
          className="rounded-3xl border border-solid border-orange-500 px-4 py-2.5 text-center text-sm font-bold uppercase text-orange-500"
        />
      </div>
      <Link
        href={`/shop/product/` + id}
        className="absolute left-0 top-0 z-0 flex size-full"
      ></Link>
    </div>
  );
};

export default ProductCard;
