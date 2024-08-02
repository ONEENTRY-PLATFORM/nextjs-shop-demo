/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { useContext, useEffect, useState } from 'react';

// eslint-disable-next-line import/no-cycle
import { LanguageContext } from '../../providers/LanguageContext';
import { api } from '../api/api';

type UseGetProductProps = {
  id: number | null;
};

export const useGetProduct = ({ id }: UseGetProductProps) => {
  const [product, setProduct] = useState<IProductsEntity>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const { activeLanguage } = useContext(LanguageContext);
  const [refetch, setRefetch] = useState(false);
  useEffect(() => {
    id &&
      (async () => {
        setLoading(true);
        try {
          const result = await api.Products.getProductById(id, activeLanguage);
          result && setProduct(result);
        } catch (e: any) {
          setError(e?.message);
        }
        setLoading(false);
      })();
  }, [activeLanguage, refetch]);

  return {
    error,
    loading,
    product,
    refetch() {
      setRefetch(!refetch);
    },
  };
};
