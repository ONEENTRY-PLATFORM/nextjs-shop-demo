'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { useContext, useEffect, useState } from 'react';

import { api } from '@/app/api';
import { LanguageContext } from '@/app/store/providers/LanguageContext';

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
      } catch (e) {
        console.log(e);
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
