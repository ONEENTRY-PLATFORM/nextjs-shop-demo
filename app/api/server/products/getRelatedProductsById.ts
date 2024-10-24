import type { IError } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

export const getRelatedProductsById = async (
  id: number,
  lang: string,
): Promise<{
  isError: boolean;
  error?: IError;
  products?: IProductsEntity[] | IError;
  total: number;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const data = await api.Products.getRelatedProductsById(id, langCode);

  if (typeError(data)) {
    return { isError: true, error: data as IError, total: 0 };
  } else {
    return {
      isError: false,
      products: data.items,
      total: data.total,
    };
  }
};
