'use client';

import type { IError } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import { useContext, useEffect, useState } from 'react';

import { api } from '@/app/api';
import { LanguageContext } from '@/app/store/providers/LanguageContext';

export const useGetPage = (pageUrl: string) => {
  const [page, setPage] = useState<IPagesEntity | IError>();
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);
  const { activeLanguage } = useContext(LanguageContext);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    pageUrl &&
      (async () => {
        setLoading(true);
        const result = await api.Pages.getPageByUrl(pageUrl, activeLanguage);
        setPage(result);
        setLoading(false);
        setRefresh(false);
      })();
  }, [pageUrl, refresh, activeLanguage]);

  return {
    pageInfo: page,
    loading,
    refresh: setRefresh,
  };
};
