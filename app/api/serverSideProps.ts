import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';

import { api } from './';

// const { PROJECT_URL, APP_TOKEN } = process.env;
const PROJECT_URL = 'https://react-native-course.oneentry.cloud';
const APP_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmVhY3RfYXBwIiwic2VyaWFsTnVtYmVyIjoxLCJpYXQiOjE3MDA0ODAwMDYsImV4cCI6MTc0Nzk5OTk2MX0.gz3KTCITg6FhM_SwtuOZl3GsMr4MlVEPg9sw3d8Q0Po';

export async function getMenus() {
  const response = await fetch(
    PROJECT_URL + '/api/content/menus/marker/header',
    {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + APP_TOKEN,
        'Content-Type': 'application/json',
      },
    },
  );
  return await response.json();
}

export async function getPages(activeLanguage: string) {
  const result = await api.Pages.getPages(activeLanguage);

  return result;
}

export async function getProducts({ limit = 10, offset = 0 }) {
  const expandedFilters: IFilterParams[] | undefined = [];

  const products = await api.Products.getProducts(expandedFilters, 'en_US', {
    sortOrder: 'DESC',
    sortKey: 'id',
    offset: offset,
    limit: limit,
  });

  return { products };
}

// api.Products.getProductsByPageId
// api.Products.

export async function getProduct(id: number) {
  const response = await fetch(PROJECT_URL + `api/content/products/${id}`, {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + APP_TOKEN,
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

export async function getFilterProduct(data: unknown) {
  const response = await fetch(
    PROJECT_URL +
      `/api/content/products/conditions-filter?offset=0&limit=30&sortOrder=DESC&sortKey=id`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + APP_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  return await response.json();
}

export async function searchProducts(text: string) {
  const response = await fetch(
    PROJECT_URL + `/api/content/products/quick/search?lang=en_US&name=${text}`,
    {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + APP_TOKEN,
        'Content-Type': 'application/json',
      },
    },
  );

  return await response.json();
}

export async function getStatus(statusId: unknown) {
  const response = await fetch(
    PROJECT_URL + `/api/content/product-statuses/${statusId}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return await response.json();
}

export async function getLocales() {
  const response = await fetch(
    PROJECT_URL + `/api/content/locales/active/all`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return await response.json();
}
