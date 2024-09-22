import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';

export const getProductById = async (
  id: number,
  langCode: string,
): Promise<{
  product?: IProductsEntity;
  isError: boolean;
  err?: unknown;
}> => {
  try {
    const product = await api.Products.getProductById(id, langCode);
    return { isError: false, product: product };
  } catch (err) {
    return { isError: true, err };
  }
};
