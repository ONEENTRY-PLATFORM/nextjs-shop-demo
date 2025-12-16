import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import { getBlockByMarker, getRelatedProductsById } from '@/app/api';

import ProductSingle from './index';

/**
 * Server wrapper component for ProductSingle that handles all async data fetching and validation.
 *
 * This component serves as a server-side container that:
 * 1. Validates required input props
 * 2. Extracts necessary data from the product entity
 * 3. Fetches related products based on the current product ID
 * 4. Retrieves block data for specific block markers
 * 5. Handles errors gracefully and provides fallback UI
 *
 * The component ensures all necessary data is loaded before rendering the client-side ProductSingle component,
 * improving performance by reducing client-side data fetching and providing a better user experience
 * with proper error handling.
 * @param   {object}                                       props         - Component properties containing product data and configuration
 * @param   {IProductsEntity & { blocks?: Array<string> }} props.product - Product entity object containing all product information including optional blocks array
 * @param   {string}                                       props.lang    - Current language shortcode used for localization and API requests
 * @param   {IAttributeValues}                             props.dict    - Dictionary of attribute values from server API used for translations and labels
 * @returns {Promise<JSX.Element>}                                       A Promise that resolves to a JSX element containing the ProductSingle component
 */
const ProductSingleServer = async ({
  lang,
  dict,
  product,
}: {
  product: IProductsEntity & {
    blocks?: Array<string>;
  };
  lang: string;
  dict: IAttributeValues;
}): Promise<JSX.Element> => {
  /** Validate required props */
  if (!product || !lang || !dict) {
    return (
      <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
        <div className="flex items-center justify-center min-h-100">
          {!product && <p>Product not found</p>}
          {!lang && <p>Language not specified</p>}
          {!dict && <p>Dictionary not loaded</p>}
        </div>
      </section>
    );
  }

  /** Extract essential product information needed for data fetching */
  const { localizeInfos, blocks, id } = product;

  /** Validate required product data */
  if (!localizeInfos?.title) {
    return (
      <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
        <div className="flex items-center justify-center min-h-100">
          <p>Invalid product data</p>
        </div>
      </section>
    );
  }

  /**
   * Fetch related products using the current product's ID and language
   * Initialize with empty data structure for type safety and fallback
   */
  let relatedProductsData = {
    products: [] as IProductsEntity[],
    total: 0,
  };

  try {
    /** Call API to get related products by current product ID */
    const result = await getRelatedProductsById(id, lang);

    /** Process successful response - only update if no error and products exist */
    if (!result.isError && result.products) {
      relatedProductsData = {
        products: result.products,
        total: result.products.length,
      };
    }
  } catch (error) {
    /**
     * Log warning for debugging purposes without blocking execution
     * This allows the main product to still render even if related products fail to load
     */
    // eslint-disable-next-line no-console
    console.warn('Failed to load related products:', error);
    /** Continue with empty related products (graceful degradation) */
  }

  /** Destructure the final related products data for passing to child component */
  const { products, total } = relatedProductsData;

  /**
   * Prepare block data for specified block markers
   * Using any type temporarily due to unknown block structure - should be typed properly
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blocksData: Record<string, any> = {};

  /** Only process blocks if they exist and are an array */
  if (Array.isArray(blocks)) {
    /** Iterate through each block marker to fetch corresponding block data */
    for (const blockMarker of blocks) {
      /**
       * Only process specific block types that are supported
       * Currently supports 'multiply_items_offer' (bulk purchase offers) and 'similar' (similar products section)
       */
      if (blockMarker === 'multiply_items_offer' || blockMarker === 'similar') {
        /** Fetch block data by marker and language */
        const { isError, block } = await getBlockByMarker(blockMarker, lang);

        /** Only add to blocksData if successful and block data exists */
        if (!isError && block) {
          blocksData[blockMarker] = block;
        }
      }
    }
  }

  return (
    <ProductSingle
      lang={lang}
      dict={dict}
      product={product}
      relatedProducts={products as IProductsEntity[]}
      relatedProductsTotal={total}
      blocksData={blocksData}
    />
  );
};

export default ProductSingleServer;
