/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { IProductEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import { useGetProduct } from '@/app/api';

import ProductCard from '../products-grid/components/product-card/ProductCard';

const FavoriteCard: FC<{
  lang: any;
  dict: any;
  productId: number;
  index: number;
}> = ({ lang, dict, productId, index }) => {
  const { product } = useGetProduct({ id: productId });

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
