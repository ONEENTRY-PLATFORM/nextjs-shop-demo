import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export const getRelatedProductsById = async (
  id: number,
  lang: string,
): Promise<{
  products?: IProductsEntity[];
  total?: number;
  error?: unknown;
}> => {
  try {
    const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
    const data = await api.Products.getRelatedProductsById(id, langCode);
    return { products: data.items, total: data.total };
  } catch (error) {
    return { error };
  }
};
