'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { useContext, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line import/no-cycle
import { LanguageContext } from '../../store/providers/LanguageContext';
import { api } from '../api/api';

type Props = {
  marker?: string;
};
export const useGetSimilarProducts = ({ marker }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const products = useRef<IProductsEntity[]>();
  const { activeLanguage } = useContext(LanguageContext);
  useEffect(() => {
    (async () => {
      if (!marker) {
        return;
      }
      setLoading(true);
      try {
        const result = await api.Blocks.getSimilarProducts(
          marker,
          activeLanguage,
        );
        products.current = result;
      } catch (e: unknown) {
        setError((e as Error).message);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLanguage]);
  return {
    loading,
    error,
    products: products.current,
  };
};
