import { api } from './';

export async function getPages(activeLanguage: string) {
  const result = await api.Pages.getPages(activeLanguage);

  return result;
}

const { PROJECT_URL, APP_TOKEN } = process.env;

export async function getMenus() {
  const response = await fetch(
    PROJECT_URL + 'api/content/menus/marker/header',
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

export async function getProducts(page: number) {
  const responseConfig = await fetch(
    PROJECT_URL + `/api/content/pages/shop/config`,
    {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + APP_TOKEN,
        'Content-Type': 'application/json',
      },
    },
  );

  const config = await responseConfig.json();

  const responseProducts = await fetch(
    PROJECT_URL +
      `/api/content/products/page/url/shop?limit=${config.productsPerRow * config.rowsPerPage}&offset=${page * config.productsPerRow * config.rowsPerPage || 0}&sortOrder=DESC&sortKey=id`,
    {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + APP_TOKEN,
        'Content-Type': 'application/json',
      },
    },
  );
  const products = await responseProducts.json();

  return { products, config };
}

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
