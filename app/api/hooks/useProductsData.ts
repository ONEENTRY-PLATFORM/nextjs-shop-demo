import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

/**
 * Safely extracts the product title from localized information.
 * The SDK already unwraps the locale requested by the API call, so
 * `localizeInfos.title` is the localized title — no per-locale indexing.
 * @param   {IProductsEntity} product  - The product entity
 * @param   {string}          fallback - The fallback string if title is not found
 * @returns {string}                   The product title or a fallback string
 */
export const getProductTitle = (
  product: IProductsEntity,
  fallback: string = '',
): string => {
  /** Title from the SDK-unwrapped localize infos */
  const title = product?.localizeInfos?.title;
  return typeof title === 'string' && title ? title : fallback;
};

/**
 * Safely extracts the price from attribute values
 * @param   {IAttributeValues}   attributes - The product attributes
 * @returns {number | undefined}            The price value or undefined
 */
export const getProductPrice = (
  attributes: IAttributeValues,
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
 * @param   {IAttributeValues}   attributes - The product attributes
 * @returns {number | undefined}            The sale price value or undefined
 */
export const getProductSalePrice = (
  attributes: IAttributeValues,
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
  /**
   * `category` is a list-type attribute: its value is an array of
   * `{ title, value }` options (a lone object is normalized too, just in
   * case). Take the first selected option and return its title/value pair.
   */
  const raw = product?.attributeValues?.category?.value;
  const first = (Array.isArray(raw) ? raw[0] : raw) as
    { title?: unknown; value?: unknown } | null | undefined;

  if (
    first &&
    typeof first === 'object' &&
    first.title != null &&
    first.value != null
  ) {
    return {
      title: String(first.title),
      value: String(first.value),
    };
  }
  return undefined;
};
