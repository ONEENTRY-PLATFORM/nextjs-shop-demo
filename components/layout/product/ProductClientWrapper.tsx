'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { Suspense } from 'react';

import ProductSingle from './index';

/**
 * Client wrapper for ProductSingle to ensure it's rendered in client context
 */
const ProductClientWrapper: FC<{
  product: IProductsEntity & {
    blocks?: Array<string>;
  };
  lang: string;
  dict: IAttributeValues;
}> = ({ product, lang, dict }) => {
  return (
    <Suspense fallback={<div className="min-h-screen">Loading product...</div>}>
      <ProductSingle product={product} lang={lang} dict={dict} />
    </Suspense>
  );
};

export default ProductClientWrapper;
