'use client';

import type { IAttributesSetsEntity } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import { useContext, useEffect, useState } from 'react';

import { api } from '@/app/api';
import { LanguageContext } from '@/app/store/providers/LanguageContext';

type AttributeByMarkerSetProps = {
  setMarker: string;
  attributeMarker: string;
};

export const useGetSingleAttributeByMarkerSet = ({
  setMarker,
  attributeMarker,
}: AttributeByMarkerSetProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [attributes, setAttributes] = useState<
    IAttributesSetsEntity | undefined
  >();
  const { activeLanguage } = useContext(LanguageContext);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await api.AttributesSets.getSingleAttributeByMarkerSet(
          attributeMarker,
          setMarker,
          activeLanguage,
        );
        setAttributes(result as IAttributesSetsEntity);
        setLoading(false);
      } catch (e: unknown) {
        setError((e as Error).message);
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLanguage]);

  return {
    loading,
    error,
    attributes,
  };
};
