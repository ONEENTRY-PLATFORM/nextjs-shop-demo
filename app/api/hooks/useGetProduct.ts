'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { useEffect, useState } from 'react';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

type UseGetProductProps = {
  id: number;
  lang: string;
};

export const useGetProduct = ({ id, lang }: UseGetProductProps) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  const [product, setProduct] = useState<IProductsEntity>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await api.Products.getProductById(id, langCode);
        setProduct(result);
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    })();
  }, [id, langCode, refetch]);

  return {
    error,
    loading,
    product,
    refetch() {
      setRefetch(!refetch);
    },
  };
};
