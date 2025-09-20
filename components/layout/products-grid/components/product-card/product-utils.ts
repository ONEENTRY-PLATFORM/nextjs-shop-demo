import type { AttributeType } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

/**
 * Safely extracts the product title from localized information
 * @param product The product entity
 * @param langCode The language code
 * @param fallback The fallback string if title is not found
 * @returns The product title or a fallback string
 */
export const getProductTitle = (
  product: IProductsEntity,
  langCode?: string,
  fallback = '',
): string => {
  if (!product?.localizeInfos) {
    return fallback;
  }

  if (
    langCode &&
    product.localizeInfos[langCode] &&
    typeof product.localizeInfos[langCode] === 'object' &&
    'title' in product.localizeInfos[langCode] &&
    typeof product.localizeInfos[langCode].title === 'string'
  ) {
    return product.localizeInfos[langCode].title;
  }

  if (
    typeof product.localizeInfos === 'object' &&
    'title' in product.localizeInfos &&
    typeof product.localizeInfos.title === 'string'
  ) {
    return product.localizeInfos.title;
  }

  return fallback;
};

/**
 * Safely extracts the product image URL from attribute values
 * @param attributes The product attributes
 * @returns The product image URL or undefined
 */
export const getProductImageUrl = (
  attributes: AttributeType,
): string | undefined => {
  if (!attributes || !attributes.pic) {
    return undefined;
  }

  const picValue = attributes.pic.value;

  if (Array.isArray(picValue) && picValue.length > 0) {
    const firstImage = picValue[0];
    if (
      firstImage &&
      typeof firstImage === 'object' &&
      'downloadLink' in firstImage &&
      typeof firstImage.downloadLink === 'string'
    ) {
      return firstImage.downloadLink;
    }
  } else if (
    picValue &&
    typeof picValue === 'object' &&
    'downloadLink' in picValue &&
    typeof picValue.downloadLink === 'string'
  ) {
    return picValue.downloadLink;
  }

  return undefined;
};

/**
 * Safely extracts the price from attribute values
 * @param attributes The product attributes
 * @returns The price value or undefined
 */
export const getProductPrice = (
  attributes: AttributeType,
): number | undefined => {
  if (
    attributes?.price &&
    typeof attributes.price === 'object' &&
    'value' in attributes.price &&
    typeof attributes.price.value === 'number'
  ) {
    return attributes.price.value;
  }
  return undefined;
};

/**
 * Safely extracts the sale price from attribute values
 * @param attributes The product attributes
 * @returns The sale price value or undefined
 */
export const getProductSalePrice = (
  attributes: AttributeType,
): number | undefined => {
  if (
    attributes?.sale &&
    typeof attributes.sale === 'object' &&
    'value' in attributes.sale &&
    typeof attributes.sale.value === 'number'
  ) {
    return attributes.sale.value;
  }
  return undefined;
};
