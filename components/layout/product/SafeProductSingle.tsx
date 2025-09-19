'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import ProductSingleServer from './ProductSingleServer';

/**
 * Safe wrapper for ProductSingle
 * This component simply renders the server-side ProductSingleServer with provided props.
 */
const SafeProductSingle: FC<{
  product: IProductsEntity & {
    blocks?: Array<string>;
  };
  lang: string;
  dict: IAttributeValues;
}> = ({ product, lang, dict }) => {
  return <ProductSingleServer product={product} lang={lang} dict={dict} />;
};

export default SafeProductSingle;
