import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC, Key } from 'react';

import FavoritesButton from '../../../shared/FavoritesButton';
import AddToCartButton from '../../product/components/AddToCartButton';
import PriceDisplay from './PriceDisplay';
import ProductImage from './ProductImage';
import Sticker from './Sticker';

const ProductCard: FC<{
  product: IProductsEntity;
  lang: string;
}> = ({ product, lang }) => {
  const { id, attributeValues, localizeInfos } = product;
  const title = localizeInfos?.title;
  const productImage = attributeValues.pic?.value;
  const sale = attributeValues?.sale;
  const price = attributeValues?.price;

  return (
    <div className="product-card">
      {/* stickers */}
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

      {/* ProductImage */}
      <ProductImage
        imageSrc={
          Array.isArray(productImage)
            ? productImage[0]?.downloadLink
            : productImage?.downloadLink
        }
        alt={title}
      />

      {/* Product Data */}
      <div className="z-10 mb-5 mt-auto flex w-full max-w-[160px] flex-col gap-2.5">
        <h2 className="text-center text-sm leading-4 text-neutral-600">
          {title}
        </h2>

        <PriceDisplay
          currentPrice={attributeValues.sale?.value}
          originalPrice={attributeValues.price?.value}
        />

        <AddToCartButton
          product={product}
          height={42}
          className="btn btn-md btn-primary"
        />
      </div>

      <Link
        href={'/' + lang + '/shop/product/' + id}
        className="absolute left-0 top-0 z-0 flex size-full"
      ></Link>
    </div>
  );
};

export default ProductCard;
