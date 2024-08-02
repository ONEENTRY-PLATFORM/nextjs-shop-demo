'use client';

import type { IProductStatusEntity } from 'oneentry/dist/product-statuses/productStatusesInterfaces';
import { useContext, useEffect, useState } from 'react';

// eslint-disable-next-line import/no-cycle
import { LanguageContext } from '../../providers/LanguageContext';
import { api } from '../api/api';

type UseGetStatusProps = {
  marker?: string;
};

export const useGetStatus = ({ marker }: UseGetStatusProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<IProductStatusEntity>();
  const { activeLanguage } = useContext(LanguageContext);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        if (!marker) {
          return;
        }
        const result = await api.ProductStatuses.getProductsByStatusMarker(
          marker,
          activeLanguage,
        );
        setStatus(result);
      } catch (e: any) {
        setError(e);
      }
      setLoading(false);
    })();
  }, [activeLanguage, marker]);

  return {
    loading,
    error,
    status,
  };
};
