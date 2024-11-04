'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { useEffect, useState } from 'react';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export const useSearchProducts = ({
  name,
  lang,
}: {
  name: string;
  lang: string;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<IProductsEntity[]>([]);
  const [refetch, setRefetch] = useState(false);
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  useEffect(() => {
    if (!name) {
      return;
    }
    (async () => {
      setLoading(true);
      const result = await api.Products.searchProduct(name, langCode);
      setProducts(result as IProductsEntity[]);
      setLoading(false);
    })();
  }, [refetch, langCode, name]);

  return {
    loading,
    products,
    refetch() {
      setRefetch(!refetch);
    },
  };
};
