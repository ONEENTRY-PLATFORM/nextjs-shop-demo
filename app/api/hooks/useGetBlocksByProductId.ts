import {useContext, useEffect, useState} from 'react';
import {LanguageContext} from '../../providers/LanguageContext';
import {IPositionBlock} from 'oneentry/dist/pages/pagesInterfaces';

type UseGetBlocksByProductIdProps = {
  productId?: string | number;
};

export const useGetBlocksByProductId = ({
  productId,
}: UseGetBlocksByProductIdProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [blocks, setBlocks] = useState<IPositionBlock[]>();
  const [refresh, setRefresh] = useState<number>(0);
  const {activeLanguage} = useContext(LanguageContext);
  useEffect(() => {
    (async () => {
      if (!productId) {
        return;
      }
      setLoading(true);
      try {
        const preresult = await fetch(
          `https://react-native-course.oneentry.cloud/api/content/products/${productId}/blocks?langCode=${activeLanguage}`,
          {
            headers: {
              'x-app-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmVhY3RfYXBwIiwic2VyaWFsTnVtYmVyIjoxLCJpYXQiOjE3MDA0ODAwMDYsImV4cCI6MTc0Nzk5OTk2MX0.gz3KTCITg6FhM_SwtuOZl3GsMr4MlVEPg9sw3d8Q0Po',
            },
          },
        );
        const result = await preresult.json();
        setBlocks(result);
      } catch (e: any) {
        setError((e as Error).message);
      }
      setLoading(false);
    })();
  }, [activeLanguage, productId, refresh]);
  return {
    loading,
    blocks,
    refetch: () => setRefresh(Date.now()),
  };
};
