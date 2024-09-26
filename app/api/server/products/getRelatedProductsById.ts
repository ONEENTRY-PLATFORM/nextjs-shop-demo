import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';

export const getRelatedProductsById = async (
  id: number,
  langCode: string,
): Promise<{
  products?: IProductsEntity[];
  total?: number;
  isError: boolean;
  err?: unknown;
}> => {
  try {
    const data = await api.Products.getRelatedProductsById(id, langCode);
    return { isError: false, products: data.items, total: data.total };
  } catch (err) {
    return { isError: true, err };
  }
};
