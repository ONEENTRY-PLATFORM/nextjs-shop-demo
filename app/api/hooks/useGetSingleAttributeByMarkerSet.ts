'use client';

import type { IAttributesSetsEntity } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import { useContext, useEffect, useState } from 'react';

// eslint-disable-next-line import/no-cycle
import { LanguageContext } from '../../providers/LanguageContext';
import { api } from '../api/api';

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
        setAttributes(result);
      } catch (e: any) {
        setError((e as Error).message);
      }
      setLoading(false);
    })();
  }, [activeLanguage]);
  return {
    loading,
    error,
    attributes,
  };
};
