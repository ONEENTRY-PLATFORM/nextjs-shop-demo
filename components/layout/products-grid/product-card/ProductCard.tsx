import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC, Key } from 'react';

import { LanguageEnum } from '@/app/types/enum';
import CardAnimations from '@/components/layout/products-grid/components/CardAnimations';

import FavoritesButton from '../../../shared/FavoritesButton';
import AddToCartButton from '../../product/components/AddToCartButton';
import PriceDisplay from './PriceDisplay';
import ProductImage from './ProductImage';
import Sticker from './Sticker';

const ProductCard: FC<{
  product: IProductsEntity;
  lang: string;
  index: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}> = ({ product, lang, dict, index }) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const { id, attributeValues, localizeInfos } = product;

  const attributes = attributeValues[langCode] || attributeValues;
  const title = localizeInfos[langCode]?.title || localizeInfos?.title;
  const productImage = attributes.pic?.value;

  return (
    <CardAnimations className="product-card group" index={index}>
      {/* stickers */}
      <div className="z-10 flex justify-between gap-5 self-stretch">
        {[attributes.stickers].map(
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
          currentPrice={attributes.sale?.value}
          originalPrice={attributes.price?.value}
          lang={lang}
        />

        <AddToCartButton
          product={product}
          dict={dict}
          height={42}
          className="btn btn-md btn-primary"
        />
        {/* <Suspense>
          <AddToCartButton
            product={product}
            dict={dict}
            height={42}
            className="btn btn-md btn-primary"
          />
        </Suspense> */}
      </div>

      <Link
        href={'/' + lang + '/shop/product/' + id}
        className="absolute left-0 top-0 z-0 flex size-full"
      ></Link>
    </CardAnimations>
  );
};

export default ProductCard;
