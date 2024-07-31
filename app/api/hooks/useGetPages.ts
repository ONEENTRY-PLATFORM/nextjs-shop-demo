import {useContext, useEffect, useState} from 'react';
import {IPagesEntity} from 'oneentry/dist/pages/pagesInterfaces';
import {LanguageContext} from '../../providers/LanguageContext';
import {api} from '../api/api';

type useGetPagesProps = {};

export const useGetPages = ({}: useGetPagesProps) => {
  const [pages, setPages] = useState<IPagesEntity[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const {activeLanguage} = useContext(LanguageContext);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await api.Pages.getPages(activeLanguage);
        setPages(result);
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
