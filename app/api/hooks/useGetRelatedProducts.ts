'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { useContext, useEffect, useState } from 'react';

// eslint-disable-next-line import/no-cycle
import { LanguageContext } from '../../providers/LanguageContext';
import { api } from '../api/api';

// eslint-disable-next-line @typescript-eslint/naming-convention
type useGetRelatedProductsProps = {
  id: number | undefined;
};

export const useGetRelatedProducts = ({ id }: useGetRelatedProductsProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<IProductsEntity[]>([]);
  const { activeLanguage } = useContext(LanguageContext);
  const [refetch, setRefetch] = useState(false);
  useEffect(() => {
    id &&
      (async () => {
        setLoading(true);
        try {
          const result = await api.Products.getRelatedProductsById(
            id,
            activeLanguage,
          );
          setProducts(result);
        } catch (e) {}
        setLoading(false);
      })();
  }, [refetch, activeLanguage, id]);
  return {
    loading,
    products,
    refetch() {
      setRefetch(!refetch);
    },
  };
};
