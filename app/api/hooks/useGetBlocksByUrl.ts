'use client';

import type { IPositionBlock } from 'oneentry/dist/pages/pagesInterfaces';
import { useContext, useEffect, useState } from 'react';

// eslint-disable-next-line import/no-cycle
import { LanguageContext } from '../../providers/LanguageContext';
import { api } from '../api/api';

type UseGetBlockProps = {
  pageUrl: string | undefined;
};

export const useGetBlocksByUrl = ({ pageUrl }: UseGetBlockProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [blocks, setBlocks] = useState<IPositionBlock[]>();
  const [refetch, setRefetch] = useState('');

  const { activeLanguage } = useContext(LanguageContext);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    pageUrl &&
      (async () => {
        setLoading(true);
        try {
          const result = await api.Pages.getBlocksByPageUrl(
            pageUrl,
            activeLanguage,
          );
          setBlocks(result);
        } catch (e) {}
        setLoading(false);
      })();
  }, [refetch, activeLanguage]);
  return {
    loading,
    blocks,
    refetch() {
      setRefetch(Date.now().toString());
    },
  };
};
