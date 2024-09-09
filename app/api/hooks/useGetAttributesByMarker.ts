'use client';

import type { IAttributesSetsEntity } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import { useContext, useEffect, useState } from 'react';

import { api } from '@/app/api';
import { LanguageContext } from '@/app/store/providers/LanguageContext';

type AttributeByMarkerSetProps = {
  setMarker: string;
};

export const useGetAttributesByMarker = ({
  setMarker,
}: AttributeByMarkerSetProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [refresh, setRefresh] = useState<number>(0);
  const [attributes, setAttributes] = useState<
    IAttributesSetsEntity[] | undefined
  >();
  const { activeLanguage } = useContext(LanguageContext);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await api.AttributesSets.getAttributesByMarker(
          setMarker,
          activeLanguage,
        );
        setAttributes(result);
      } catch (e: unknown) {
        setError((e as Error).message);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLanguage, refresh]);

  return {
    loading,
    error,
    attributes,
    refetch: () => setRefresh(Date.now()),
  };
};
