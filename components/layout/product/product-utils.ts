import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

/**
 * Safely extracts the product title from localized information
 * @param product The product entity
 * @param fallback The fallback string if title is not found
 * @returns The product title or a fallback string
 */
export const getProductTitle = (
  product: IProductsEntity,
  fallback = 'Product',
): string => {
  if (
    product?.localizeInfos &&
    typeof product.localizeInfos === 'object' &&
    'title' in product.localizeInfos &&
    typeof product.localizeInfos.title === 'string'
  ) {
    return product.localizeInfos.title;
  }
  return fallback;
};

/**
 * Safely extracts the product description from attribute values
 * @param product The product entity
 * @returns The product description or undefined
 */
export const getProductDescription = (
  product: IProductsEntity,
): string | undefined => {
  if (
    product?.attributeValues?.description &&
    typeof product.attributeValues.description === 'object' &&
    'value' in product.attributeValues.description &&
    typeof product.attributeValues.description.value === 'string'
  ) {
    return product.attributeValues.description.value;
  }
  return undefined;
};

/**
 * Safely extracts the product price from attribute values
 * @param product The product entity
 * @returns The product price or undefined
 */
export const getProductPrice = (
  product: IProductsEntity,
): number | undefined => {
  if (
    product?.attributeValues?.price &&
    typeof product.attributeValues.price === 'object' &&
    'value' in product.attributeValues.price &&
    typeof product.attributeValues.price.value === 'number'
  ) {
    return product.attributeValues.price.value;
  }
  return undefined;
};

/**
 * Safely extracts the product image URL from attribute values
 * @param product The product entity
 * @returns The product image URL or placeholder
 */
export const getProductImageUrl = (product: IProductsEntity): string => {
  if (
    product?.attributeValues?.pic &&
    typeof product.attributeValues.pic === 'object' &&
    'value' in product.attributeValues.pic &&
    product.attributeValues.pic.value &&
    typeof product.attributeValues.pic.value === 'object' &&
    'downloadLink' in product.attributeValues.pic.value &&
    typeof product.attributeValues.pic.value.downloadLink === 'string'
  ) {
    return product.attributeValues.pic.value.downloadLink;
  }
  return '/placeholder.jpg';
};

/**
 * Safely extracts the product category from attribute values
 * @param product The product entity
 * @returns The product category or undefined
 */
export const getProductCategory = (
  product: IProductsEntity,
): { value: string; title: string } | undefined => {
  if (
    product?.attributeValues?.category &&
    typeof product.attributeValues.category === 'object' &&
    'value' in product.attributeValues.category &&
    product.attributeValues.category.value &&
    typeof product.attributeValues.category.value === 'object' &&
    'value' in product.attributeValues.category.value &&
    'title' in product.attributeValues.category.value &&
    typeof product.attributeValues.category.value.value === 'string' &&
    typeof product.attributeValues.category.value.title === 'string'
  ) {
    return {
      value: product.attributeValues.category.value.value,
      title: product.attributeValues.category.value.title,
    };
  }
  return undefined;
};
