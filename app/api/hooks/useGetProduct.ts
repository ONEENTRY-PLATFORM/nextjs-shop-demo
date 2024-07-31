import {useContext, useEffect, useState} from 'react';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';
import {LanguageContext} from '../../providers/LanguageContext';
import {api} from '../api/api';

type UseGetProductProps = {
  id: number | null;
};

export const useGetProduct = ({id}: UseGetProductProps) => {
  const [product, setProduct] = useState<IProductsEntity>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const {activeLanguage} = useContext(LanguageContext);
  const [refetch, setRefetch] = useState(false);
  useEffect(() => {
    id &&
      (async () => {
        setLoading(true);
        try {
          let result = await api.Products.getProductById(id, activeLanguage);
          result && setProduct(result);
        } catch (e: any) {
          console.log(e);
          setError(e?.message);
        }
        setLoading(false);
      })();
  }, [activeLanguage, refetch]);

  return {
    error,
    loading,
    product,
    refetch() {
      setRefetch(!refetch);
    },
  };
};
