'use client';

import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import { useEffect, useState } from 'react';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

// langCode,
// langCode: string;

export const useGetPage = (pageUrl: string, lang: string) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  const [page, setPage] = useState<IPagesEntity>();
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    pageUrl &&
      (async () => {
        // !!! refresh??
        setLoading(true);
        const result = await api.Pages.getPageByUrl(pageUrl, langCode);
        setPage(result);
        setLoading(false);
        setRefresh(false);
      })();
  }, [pageUrl, refresh, langCode]);

  return {
    pageInfo: page,
    loading,
    refresh: setRefresh,
  };
};
