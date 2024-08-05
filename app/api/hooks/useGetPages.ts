'use client';

import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import { useContext, useEffect, useState } from 'react';

import { LanguageContext } from '../../store/providers/LanguageContext';
import { api } from '../api/api';

type useGetPagesProps = object;

// eslint-disable-next-line no-empty-pattern
export const useGetPages = ({}: useGetPagesProps) => {
  const [pages, setPages] = useState<IPagesEntity[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { activeLanguage } = useContext(LanguageContext);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await api.Pages.getPages(activeLanguage);
        setPages(result);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.message);
      }
    })();
    setLoading(false);
  }, [activeLanguage]);
  return {
    loading,
    pages,
    error,
  };
};
