'use client';

import { useSearchParams } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import ProductSingle from '.';

const ProductSearchParamsClient: FC<{
  product: IProductsEntity & {
    blocks?: Array<string>;
  };
  lang: string;
  dict: IAttributeValues;
}> = ({ product, lang, dict }) => {
  // Безопасно используем useSearchParams в клиентском компоненте
  try {
    useSearchParams();
    // eslint-disable-next-line no-empty, @typescript-eslint/no-unused-vars
  } catch (e) {}

  return <ProductSingle product={product} lang={lang} dict={dict} />;
};

export default ProductSearchParamsClient;
