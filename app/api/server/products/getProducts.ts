import { defineOneEntry } from 'oneentry';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

import getSearchParams from '../../utils/getSearchParams';

export const getProducts = async (props: {
  limit: number;
  offset: number;
  lang: string;
  params?: {
    handle?: string;
    searchParams?: {
      search?: string;
      in_stock?: string;
      color?: string;
      minPrice?: string;
      maxPrice?: string;
    };
  };
}): Promise<{
  products?: IProductsEntity[];
  total?: number;
  isError: boolean;
  err?: unknown;
}> => {
  const { limit, offset, params, lang } = props;
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  // const searchValue = params?.searchParams?.search || '';
  const expandedFilters = getSearchParams(params?.searchParams, params?.handle);

  // const api = defineOneEntry('https://react-native-course.oneentry.cloud', {
  //   token:
  //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmVhY3RfYXBwIiwic2VyaWFsTnVtYmVyIjoxLCJpYXQiOjE3MDA0ODAwMDYsImV4cCI6MTc0Nzk5OTk2MX0.gz3KTCITg6FhM_SwtuOZl3GsMr4MlVEPg9sw3d8Q0Po',
  //   langCode: 'en_US',
  // });
  // try {
  //   const response = await fetch(
  //     'https://react-native-course.oneentry.cloud/api/content/products/all',
  //     {
  //       method: 'POST',
  //       body: JSON.stringify([]),
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'x-app-token':
  //           'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmVhY3RfYXBwIiwic2VyaWFsTnVtYmVyIjoxLCJpYXQiOjE3MDA0ODAwMDYsImV4cCI6MTc0Nzk5OTk2MX0.gz3KTCITg6FhM_SwtuOZl3GsMr4MlVEPg9sw3d8Q0Po',
  //       },
  //     },
  //   );
  //   console.log(response);
  // } catch (err) {
  //   console.log(err);
  // }

  try {
    const data = await api.Products.getProducts(expandedFilters, langCode, {
      sortOrder: 'DESC',
      sortKey: 'id',
      offset: offset,
      limit: limit,
    });
    return {
      isError: false,
      products: data.items,
      total: data.total,
    };
  } catch (err) {
    return { isError: true, err: err };
  }
};
