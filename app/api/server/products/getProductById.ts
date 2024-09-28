import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export const getProductById = async (
  id: number,
  lang: string,
): Promise<{
  product?: IProductsEntity;
  isError?: boolean;
  error?: unknown;
}> => {
  try {
    const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
    const product = await api.Products.getProductById(id, langCode);
    return { product: product };
  } catch (error) {
    return { isError: true, error };
  }
};
