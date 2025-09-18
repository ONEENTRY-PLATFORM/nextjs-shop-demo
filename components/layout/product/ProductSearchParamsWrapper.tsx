'use client';

import { useSearchParams } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import ProductSingle from '.';

const ProductSearchParamsWrapper: FC<{
  product: IProductsEntity & {
    blocks?: Array<string>;
  };
  lang: string;
  dict: IAttributeValues;
}> = ({ product, lang, dict }) => {
  // This will be called in a client component context, so it's safe
  // We're not actually using the searchParams in this component, but this
  // ensures that if any child components need searchParams, they'll work properly
  useSearchParams();

  return <ProductSingle product={product} lang={lang} dict={dict} />;
};

export default ProductSearchParamsWrapper;
