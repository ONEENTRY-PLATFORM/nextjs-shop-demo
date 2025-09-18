'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { Suspense } from 'react';

import ProductSingle from './index';

interface ProductClientWrapperProps {
  product: IProductsEntity & {
    blocks?: Array<string>;
  };
  lang: string;
  dict: IAttributeValues;
}

/**
 * Client wrapper for ProductSingle to ensure it's rendered in client context
 * This component handles the client-side rendering of the product page
 */
const ProductClientWrapper: FC<ProductClientWrapperProps> = ({
  product,
  lang,
  dict,
}) => {
  // Validate required props
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  if (!lang) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Language not specified</p>
      </div>
    );
  }

  if (!dict) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Dictionary not loaded</p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading product...
        </div>
      }
    >
      <ProductSingle product={product} lang={lang} dict={dict} />
    </Suspense>
  );
};

export default ProductClientWrapper;
