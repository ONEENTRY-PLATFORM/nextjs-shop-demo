import type { IError } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { useEffect, useState } from 'react';

import { api } from '../api/api';

export const useGetProductsByIds = ({
  items,
}: {
  items: number[];
}): { products: IProductsEntity[]; isLoading: boolean } => {
  const [products, setProducts] = useState<IProductsEntity[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const getProductsByIds = async (ids: number[]) => {
    setLoading(true);
    return await Promise.all(
      ids.map(async (id: number) => {
        const product = await api.Products.getProductById(id);
        if (!product || (product as IError).statusCode >= 400) {
          return undefined;
        } else {
          return product as IProductsEntity;
        }
      }),
    ).then((results) => {
      setLoading(false);
      return results.filter(
        (product): product is IProductsEntity => product !== undefined,
      );
    });
  };

  useEffect(() => {
    if (items.length > 0) {
      getProductsByIds(items.map((item) => item)).then((res) => {
        setProducts(res);
      });
    }
  }, [items]);

  return {
    products,
    isLoading,
  };
};
