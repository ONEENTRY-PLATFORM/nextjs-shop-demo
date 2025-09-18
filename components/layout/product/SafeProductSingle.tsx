'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import ProductSingle from './index';

/**
 * Safe wrapper for ProductSingle
 * This component simply renders the client-side ProductSingle with provided props.
 */
const SafeProductSingle: FC<{
  product: IProductsEntity & {
    blocks?: Array<string>;
  };
  lang: string;
  dict: IAttributeValues;
}> = ({ product, lang, dict }) => {
  return <ProductSingle product={product} lang={lang} dict={dict} />;
};

export default SafeProductSingle;
