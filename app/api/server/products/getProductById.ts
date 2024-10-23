import type { IError } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

export const getProductById = async (
  id: number,
  lang: string,
): Promise<{
  product: IProductsEntity | IError;
  isError: boolean;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const product = await api.Products.getProductById(id, langCode);

  if (typeError(product)) {
    return { isError: true, product: product };
  } else {
    return { isError: false, product: product };
  }
};
