'use client';

import type { ILocalEntity } from 'oneentry/dist/locales/localesInterfaces';
import { useEffect, useState } from 'react';

import { api } from '../api/api';

export const useGetLocales = () => {
  const [locales, setLocales] = useState<ILocalEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await api.Locales.getLocales();
        setLocales(result);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.message);
      }
      setLoading(false);
    })();
  }, []);
  return {
    loading,
    locales,
    error,
  };
};
