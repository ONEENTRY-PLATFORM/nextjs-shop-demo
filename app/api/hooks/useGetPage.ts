import {useContext, useEffect, useState} from 'react';
import {IPagesEntity} from 'oneentry/dist/pages/pagesInterfaces';
import {LanguageContext} from '../../providers/LanguageContext';
import {api} from '../api/api';

type UseGetPageProps = {
  pageUrl: string | undefined;
};

export const useGetPage = ({pageUrl}: UseGetPageProps) => {
  const [page, setPage] = useState<IPagesEntity>();
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);
  const {activeLanguage} = useContext(LanguageContext);

  useEffect(() => {
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
