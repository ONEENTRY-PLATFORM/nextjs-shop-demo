import type { AttributeType } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

/**
 * Safely extracts the product title from localized information
 * @param   {IProductsEntity} product    - The product entity
 * @param   {string}          [langCode] - The language code
 * @param   {string}          fallback   - The fallback string if title is not found
 * @returns {string}                     The product title or a fallback string
 */
export const getProductTitle = (
  product: IProductsEntity,
  langCode?: string,
  fallback: string = '',
): string => {
  /** Return fallback if product or localizeInfos is missing */
  if (!product?.localizeInfos) {
    return fallback;
  }

  /** Check for title in specific language code */
  if (
    langCode &&
    product.localizeInfos[langCode] &&
    typeof product.localizeInfos[langCode] === 'object' &&
    'title' in product.localizeInfos[langCode] &&
    typeof product.localizeInfos[langCode].title === 'string'
  ) {
    return product.localizeInfos[langCode].title;
  }

  /** Check for title in default localizeInfos */
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
 * @param   {string}          name    - The attribute name.
 * @param   {IProductsEntity} product - The product entity.
 * @param   {string}          type    - The attribute type. 'image' | 'preview'
 * @returns {string}                  The product image URL or undefined.
 */
export const getProductImageUrl = (
  name: string,
  product: IProductsEntity,
  type: 'image' | 'preview' = 'image',
): string => {
  /** Get attribute data by name */
  const data = product?.attributeValues?.[name];

  /** Return empty string if data is missing */
  if (!data) {
    return '';
  }

  /** Extract picture value from data */
  const picValue = data.value;

  /** Handle array of images or single image */
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
    if (type === 'image') {
      return picValue.downloadLink;
    } else {
      return picValue.downloadLink;
    }
  }

  return '';
};

/**
 * Safely extracts the price from attribute values
 * @param   {AttributeType}      attributes - The product attributes
 * @returns {number | undefined}            The price value or undefined
 */
export const getProductPrice = (
  attributes: AttributeType,
): number | undefined => {
  /** Extract price value from attributes */
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
 * @param   {AttributeType}      attributes - The product attributes
 * @returns {number | undefined}            The sale price value or undefined
 */
export const getProductSalePrice = (
  attributes: AttributeType,
): number | undefined => {
  /** Extract sale price value from attributes */
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

/**
 * Safely extracts the product category from attribute values
 * @param   {IProductsEntity}                              product - The product entity.
 * @returns {{ value: string; title: string } | undefined}         The product category or undefined.
 */
export const getProductCategory = (
  product: IProductsEntity,
): { value: string; title: string } | undefined => {
  /** Extract category information from product attributes */
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
      title: product.attributeValues.category.value.title,
      value: product.attributeValues.category.value.value,
    };
  }
  return undefined;
};
