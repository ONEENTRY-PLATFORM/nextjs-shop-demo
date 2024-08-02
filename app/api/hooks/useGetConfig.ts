'use client';

import type { IPageConfig } from 'oneentry/dist/pages/pagesInterfaces';
import { useEffect, useState } from 'react';

import { api } from '../api/api';

type UseGetConfigProps = {
  pageUrl?: string;
};
export const useGetConfig = ({ pageUrl }: UseGetConfigProps) => {
  const [config, setConfig] = useState<IPageConfig | null>(null);
  const [limit, setLimit] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [numColumns, setNumColumns] = useState<number>(1);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    pageUrl &&
      (async () => {
        setLoading(true);
        const result = await api.Pages.getConfigPageByUrl(pageUrl);
        setLimit((result.productsPerRow || 1) * (result.rowsPerPage || 2));
        setConfig(result);
        setNumColumns(result?.productsPerRow || 1);
        setLoading(false);
      })();
  }, [pageUrl, refetch]);

  return {
    config,
    limit,
    loading,
    numColumns,
    refetchConfig: () => setRefetch(!refetch),
  };
};
