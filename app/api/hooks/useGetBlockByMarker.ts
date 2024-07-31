import {useContext, useEffect, useState} from 'react';
import {LanguageContext} from '../../providers/LanguageContext';
import {api} from '../api/api';
import {IBlockEntity} from 'oneentry/dist/blocks/blocksInterfaces';
//import { logJSON } from "../../utils/logJSON";

type UseGetBlockByMarkerProps = {
  marker: string | undefined;
};

export const useGetBlockByMarker = ({marker}: UseGetBlockByMarkerProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [block, setBlock] = useState<IBlockEntity>();
  const [refetch, setRefetch] = useState(false);
  const {activeLanguage} = useContext(LanguageContext);
  useEffect(() => {
    marker &&
      (async () => {
        setLoading(true);
        try {
          const result = await api.Blocks.getBlockByMarker(
            marker,
            activeLanguage,
          );
          //logJSON(result);
          setBlock(result);
        } catch (e) {}
        setLoading(false);
      })();
  }, [refetch, activeLanguage]);
  return {
    loading,
    block,
    refetch() {
      setRefetch(!refetch);
    },
  };
};
