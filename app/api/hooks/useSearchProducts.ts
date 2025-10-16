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
  /** Get language code from LanguageEnum */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  /** Loading state for search operation */
  const [loading, setLoading] = useState<boolean>(false);
  /** Store searched products */
  const [products, setProducts] = useState<IProductsEntity[]>([]);
  /** Refetch trigger state */
  const [refetch, setRefetch] = useState(false);

  /** search products on data change */
  useEffect(() => {
    /** Exit early if no search term provided */
    if (!name) {
      return;
    }
    /** Async function to search products */
    (async () => {
      /** Set loading state to true */
      setLoading(true);
      /** Search products using API */
      const result = await api.Products.searchProduct(name, langCode);
      /** Update products state with search results */
      setProducts(result as IProductsEntity[]);
      /** Set loading state to false */
      setLoading(false);
    })();
  }, [refetch, langCode, name]);

  /** Return search results and refetch function */
  return {
    loading,
    products,
    refetch() {
      setRefetch(!refetch);
    },
  };
};
