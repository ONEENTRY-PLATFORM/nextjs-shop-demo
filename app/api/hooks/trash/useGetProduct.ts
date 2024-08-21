/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { useContext, useEffect, useState } from 'react';

import { LanguageContext } from '../../../store/providers/LanguageContext';
import { api } from '../../api/api';

type UseGetProductProps = {
  id: number;
};

export const useGetProduct = ({ id }: UseGetProductProps) => {
  const [product, setProduct] = useState<IProductsEntity>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const { activeLanguage } = useContext(LanguageContext);
  const [refetch, setRefetch] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await api.Products.getProductById(id, activeLanguage);
        result && setProduct(result);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.message);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
