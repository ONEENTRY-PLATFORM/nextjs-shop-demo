'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { useEffect, useState } from 'react';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

/**
 * Search products with Products API
 * @param   {object} props      - Search parameters
 * @param   {string} props.name - Product name
 * @param   {string} props.lang - Current language shortcode
 * @returns {object}            Array with ProductEntity objects
 * @see {@link https://doc.oneentry.cloud/docs/catalog OneEntry CMS docs}
 */
export const useSearchProducts = ({
  name,
  lang,
}: {
  name: string;
  lang: string;
}): {
  loading: boolean;
  products: IProductsEntity[];
  refetch: () => void;
} => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<IProductsEntity[]>([]);
  const [refetch, setRefetch] = useState(false);

  // search products on data change
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
