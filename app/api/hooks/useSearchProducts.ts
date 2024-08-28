'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { useContext, useEffect, useState } from 'react';

import { LanguageContext } from '../../store/providers/LanguageContext';
import { api } from '../api/api';

export const useSearchProducts = ({ name }: { name: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<IProductsEntity[]>([]);
  const { activeLanguage } = useContext(LanguageContext);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    if (!name) {
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const result = await api.Products.searchProduct(name, activeLanguage);
        setProducts(result);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        /** */
      }
      setLoading(false);
    })();
  }, [refetch, activeLanguage, name]);

  return {
    loading,
    products,
    refetch() {
      setRefetch(!refetch);
    },
  };
};
