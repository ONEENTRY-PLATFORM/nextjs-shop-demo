import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';

/**
 * Get search params for filter
 * @param searchParams
 * @param handle
 *
 * @returns expandedFilters object
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
) => {
  const expandedFilters:
    | Array<IFilterParams & { statusMarker?: string }>
    | undefined = [];

  // check if product has SKU or this is service product
  const servicesFilter: IFilterParams = {
    attributeMarker: 'sku',
    conditionMarker: 'nin',
    conditionValue: null,
    title: searchParams?.search || '',
    isNested: false,
  };
  expandedFilters.push(servicesFilter);

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

  if (searchParams?.in_stock) {
    expandedFilters.push({
      statusMarker: 'in_stock',
      attributeMarker: 'price',
      conditionValue: null,
      title: searchParams.search || '',
      isNested: false,
    });
  }

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

  if (searchParams?.minPrice) {
    const filter: IFilterParams = {
      attributeMarker: 'price',
      conditionMarker: 'mth',
      conditionValue: searchParams.minPrice,
      pageUrl: ['shop'],
      title: searchParams.search || '',
      isNested: false,
    };
    expandedFilters.push(filter);
  }

  if (searchParams?.maxPrice) {
    const filter: IFilterParams = {
      attributeMarker: 'price',
      conditionMarker: 'lth',
      conditionValue: searchParams.maxPrice,
      pageUrl: ['shop'],
      title: searchParams.search || '',
      isNested: false,
    };
    expandedFilters.push(filter);
  }

  return expandedFilters;
};

export default getSearchParams;
