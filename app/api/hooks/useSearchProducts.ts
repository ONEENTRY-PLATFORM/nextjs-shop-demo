'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { useContext, useEffect, useState } from 'react';

import { api } from '@/app/api';
import { LanguageContext } from '@/app/store/providers/LanguageContext';

export const useSearchProducts = ({ name }: { name: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<IProductsEntity[]>([]);
  const [refetch, setRefetch] = useState(false);
  const { activeLanguage } = useContext(LanguageContext);

  useEffect(() => {
    if (!name) {
      return;
    }
    (async () => {
      setLoading(true);
      const result = await api.Products.searchProduct(name, activeLanguage);
      setProducts(result as IProductsEntity[]);
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
