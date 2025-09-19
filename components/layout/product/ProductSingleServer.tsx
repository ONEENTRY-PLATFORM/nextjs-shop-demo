import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import { getBlockByMarker, getRelatedProductsById } from '@/app/api';

import ProductSingle from './index';

interface ProductSingleServerProps {
  product: IProductsEntity & {
    blocks?: Array<string>;
  };
  lang: string;
  dict: IAttributeValues;
}

/**
 * Server wrapper for ProductSingle that handles async data fetching
 *
 * @param product product entity object
 * @param lang current language shortcode
 * @param dict dictionary from server api
 *
 * @returns Product single wrapped in server component
 */
const ProductSingleServer: FC<ProductSingleServerProps> = async ({
  product,
  lang,
  dict,
}) => {
  // Validate required props
  if (!product || !lang || !dict) {
    return (
      <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
        <div className="flex items-center justify-center min-h-[400px]">
          {!product && <p>Product not found</p>}
          {!lang && <p>Language not specified</p>}
          {!dict && <p>Dictionary not loaded</p>}
        </div>
      </section>
    );
  }

  // extract data from product
  const { localizeInfos, blocks, id } = product;

  // Validate required product data
  if (!localizeInfos?.title) {
    return (
      <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Invalid product data</p>
        </div>
      </section>
    );
  }

  // Get all related products by Id with error handling
  let relatedProductsData = {
    products: [] as IProductsEntity[],
    total: 0,
  };

  try {
    const result = await getRelatedProductsById(id, lang);
    if (!result.isError && result.products) {
      relatedProductsData = {
        products: result.products,
        total: result.products.length,
      };
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to load related products:', error);
    // Continue with empty related products
  }

  const { products, total } = relatedProductsData;

  // Prepare blocks data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blocksData: Record<string, any> = {};
  if (Array.isArray(blocks)) {
    for (const blockMarker of blocks) {
      if (blockMarker === 'multiply_items_offer' || blockMarker === 'similar') {
        const { isError, block } = await getBlockByMarker(blockMarker, lang);
        if (!isError && block) {
          blocksData[blockMarker] = block;
        }
      }
    }
  }

  return (
    <ProductSingle
      product={product}
      lang={lang}
      dict={dict}
      relatedProducts={products as IProductsEntity[]}
      relatedProductsTotal={total}
      blocksData={blocksData}
    />
  );
};

export default ProductSingleServer;
