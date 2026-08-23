import type { IFilterParams } from 'oneentry/types';

/**
 * Get search params for filter
 * @param   {object}          searchParams          - Search parameters
 * @param   {string}          searchParams.search   - Search query
 * @param   {string}          searchParams.in_stock - In stock
 * @param   {string}          searchParams.color    - Color
 * @param   {string}          searchParams.minPrice - Min price
 * @param   {string}          searchParams.maxPrice - Max price
 * @param   {string}          handle                - Category handle
 * @returns {IFilterParams[]}                       Expanded filters object
 */
const getSearchParams = (
  searchParams?: {
    search?: string;
    in_stock?: string;
    color?: string;
    minPrice?: string;
    maxPrice?: string;
  },
  handle?: string,
): IFilterParams[] => {
  /** Initialize array to store expanded filters with optional status marker */
  const expandedFilters: Array<IFilterParams & { statusMarker?: string }> = [];

  /**
   * Exclude service products (e.g. the delivery product, id 83) from the catalog.
   *
   * In the current OneEntry data real products have NO `sku` attribute, while
   * the service product is the only entity matching `sku nin null`. So we keep
   * products whose `sku` is null (`in null`) and drop the service one.
   *
   * ⚠️ This is admin-config dependent (see mismatch-log B.3 / C.7.5). If real
   * products get a populated `sku` again, this condition must be revisited —
   * historically it was `nin null` (keep products that HAVE a sku).
   */
  const servicesFilter: IFilterParams = {
    attributeMarker: 'sku',
    conditionMarker: 'in',
    conditionValue: null,
    title: searchParams?.search || '',
    isNested: false,
  };
  /** Add services filter to expanded filters array */
  expandedFilters.push(servicesFilter);

  /** Add stickers filter if handle is provided */
  if (handle) {
    const stickersFilter: IFilterParams = {
      attributeMarker: 'stickers',
      conditionMarker: 'in',
      conditionValue: handle,
      title: searchParams?.search || '',
      isNested: false,
    };
    expandedFilters.push(stickersFilter);
  }

  /**
   * Add stock availability filter if in_stock parameter is provided.
   *
   * The UI treats a product as out of stock when its status is not `in_stock`
   * OR its `units_product` is < 1 (see AddToCartButton), so the filter must
   * match both: the status marker alone still returns zero-unit products.
   */
  if (searchParams?.in_stock) {
    expandedFilters.push({
      statusMarker: 'in_stock',
      attributeMarker: 'units_product',
      conditionMarker: 'mth',
      conditionValue: 0,
      title: searchParams.search || '',
      isNested: false,
    });
  }

  /** Add color filter if color parameter is provided */
  if (searchParams?.color) {
    const newFilter: IFilterParams = {
      attributeMarker: 'color',
      conditionMarker: 'in',
      conditionValue: searchParams.color,
      title: searchParams.search || '',
      isNested: false,
    };
    expandedFilters.push(newFilter);
  }

  /** Add minimum price filter if minPrice parameter is provided */
  if (searchParams?.minPrice) {
    const filter: IFilterParams = {
      attributeMarker: 'price',
      conditionMarker: 'mth',
      conditionValue: searchParams.minPrice,
      pageUrl: 'shop',
      title: searchParams.search || '',
      isNested: false,
    };
    expandedFilters.push(filter);
  }

  /** Add maximum price filter if maxPrice parameter is provided */
  if (searchParams?.maxPrice) {
    const filter: IFilterParams = {
      attributeMarker: 'price',
      conditionMarker: 'lth',
      conditionValue: searchParams.maxPrice,
      pageUrl: 'shop',
      title: searchParams.search || '',
      isNested: false,
    };
    expandedFilters.push(filter);
  }

  /** Return expanded filters array or empty array if no filters are applied */
  return expandedFilters.length > 0 ? expandedFilters : [];
};

export default getSearchParams;
