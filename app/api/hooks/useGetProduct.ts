'use client';

import type {
  IProductEntity,
  IProductsEntity,
} from 'oneentry/dist/products/productsInterfaces';
import { useContext, useEffect, useState } from 'react';

import { api } from '@/app/api';
import { LanguageContext } from '@/app/store/providers/LanguageContext';

type UseGetProductProps = {
  id: number;
};

export const useGetProduct = ({ id }: UseGetProductProps) => {
  const [product, setProduct] = useState<IProductsEntity>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [refetch, setRefetch] = useState(false);
  const { activeLanguage } = useContext(LanguageContext);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await api.Products.getProductById(id, activeLanguage);
        setProduct(result as IProductEntity);
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    })();
  }, [id, activeLanguage, refetch]);

  return {
    error,
    loading,
    product,
    refetch() {
      setRefetch(!refetch);
    },
  };
};
