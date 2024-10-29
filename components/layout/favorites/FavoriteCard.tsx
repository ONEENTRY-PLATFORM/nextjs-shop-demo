/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProductEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import { getProductById } from '@/app/api';

import ProductCard from '../products-grid/components/product-card/ProductCard';

const FavoriteCard: FC<{
  lang: any;
  dict: any;
  productId: number;
  index: number;
}> = async ({ lang, dict, productId, index }) => {
  const { product } = await getProductById(productId, lang);
  if (!product) {
    return;
  }
  return (
    <ProductCard
      product={product as IProductEntity}
      index={index as number}
      lang={lang}
      dict={dict}
    />
  );
};

export default FavoriteCard;
