'use client';

import type { IPositionBlock } from 'oneentry/dist/pages/pagesInterfaces';
import { useContext, useEffect, useState } from 'react';

import { api } from '@/app/api';
import { LanguageContext } from '@/app/store/providers/LanguageContext';

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
        } catch (e: unknown) {
          console.log(e);
        }
        setLoading(false);
      })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, activeLanguage]);
  return {
    loading,
    blocks,
    refetch() {
      setRefetch(Date.now().toString());
    },
  };
};
