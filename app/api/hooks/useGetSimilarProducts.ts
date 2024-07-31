import {useContext, useEffect, useRef, useState} from 'react';
import {api} from '../api/api';
import {LanguageContext} from '../../providers/LanguageContext';
import {IBlockProduct} from 'oneentry/dist/blocks/blocksInterfaces';

type Props = {
  marker?: string;
};
export const useGetSimilarProducts = ({marker}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const products = useRef<IBlockProduct[]>();
  const {activeLanguage} = useContext(LanguageContext);
  useEffect(() => {
    (async () => {
      if (!marker) {
        return;
      }
      setLoading(true);
      try {
        const result = await api.Blocks.getSimilarProducts(
          marker,
          activeLanguage,
        );
        console.log(result);
        products.current = result;
      } catch (e: any) {
        setError((e as Error).message);
      }
      setLoading(false);
    })();
  }, [activeLanguage]);
  return {
    loading,
    error,
    products: products.current,
  };
};
