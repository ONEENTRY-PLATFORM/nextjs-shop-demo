/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import type { IBlockEntity } from 'oneentry/dist/blocks/blocksInterfaces';
import { useContext, useEffect, useState } from 'react';

// eslint-disable-next-line import/no-cycle
import { LanguageContext } from '../../providers/LanguageContext';
import { api } from '../api/api';

type UseGetBlockByMarkerProps = {
  marker: string | undefined;
};

export const useGetBlockByMarker = ({ marker }: UseGetBlockByMarkerProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [block, setBlock] = useState<IBlockEntity>();
  const [refetch, setRefetch] = useState(false);
  const { activeLanguage } = useContext(LanguageContext);
  useEffect(() => {
    marker &&
      (async () => {
        setLoading(true);
        try {
          const result = await api.Blocks.getBlockByMarker(
            marker,
            activeLanguage,
          );
          setBlock(result);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          /* empty */
        }
        setLoading(false);
      })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, activeLanguage]);
  return {
    loading,
    block,
    refetch() {
      setRefetch(!refetch);
    },
  };
};
