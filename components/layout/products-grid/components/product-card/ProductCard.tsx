import Link from 'next/link';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import AddToCartButton from '@/components/layout/product/components/AddToCartButton';
import FavoritesButton from '@/components/shared/FavoritesButton';

import CardAnimations from '../../animations/CardAnimations';
import PriceDisplay from './PriceDisplay';
import ProductImage from './ProductImage';
import Stickers from './Stickers';

interface ProductCardProps {
  product: IProductsEntity;
  lang: string;
  index: number;
  dict: IAttributeValues;
  pagesLimit: number;
}

/**
 * Product card
 *
 * @param {IProductsEntity} props.product - product entity object
 * @param {string} props.lang - Current language shortcode
 * @param {number} props.dict - dictionary from server api
 * @param {IAttributeValues} props.index - Index of element for animations stagger
 * @param {number} props.pagesLimit - used for animations
 * @returns Product card
 */
const ProductCard: FC<ProductCardProps> = ({
  product,
  lang,
  dict,
  index,
  pagesLimit,
}) => {
  const { id, statusIdentifier, attributeValues, localizeInfos } = product;

  const title = localizeInfos?.title || '';
  return (
    <CardAnimations
      className="product-card group"
      index={index}
      pagesLimit={pagesLimit}
    >
      <div className="z-10 flex justify-between gap-5 self-stretch">
        <Stickers attributeValues={attributeValues} />
        <FavoritesButton {...product} />
      </div>

      {/* ProductImage */}
      <ProductImage attributeValues={attributeValues} alt={title} />

      {/* Product Data */}
      <div className="z-10 mb-5 mt-auto flex w-full max-w-[160px] flex-col gap-2.5">
        <h2 className="text-center text-sm leading-4 text-neutral-600">
          {title}
        </h2>

        <PriceDisplay attributeValues={attributeValues} lang={lang} />

        <AddToCartButton
          id={id}
          productTitle={title}
          statusIdentifier={statusIdentifier || ''}
          units={attributeValues.units_product.value}
          dict={dict}
          height={42}
          className="btn btn-md btn-primary"
        />
      </div>

      <Link
        prefetch={true}
        href={'/' + lang + '/shop/product/' + id}
        className="absolute left-0 top-0 z-0 flex size-full"
      ></Link>
    </CardAnimations>
  );
};

export default ProductCard;
