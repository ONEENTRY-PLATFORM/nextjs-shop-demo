import type { IAttributesSetsEntity } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';

import { api } from '@/app/api';

export const getSingleAttributeByMarkerSet = async ({
  attributeMarker,
  setMarker,
  langCode,
}: {
  attributeMarker: string;
  setMarker: string;
  langCode: string;
}): Promise<{
  attribute?: IAttributesSetsEntity;
  isError: boolean;
  err?: unknown;
}> => {
  try {
    const attribute = await api.AttributesSets.getSingleAttributeByMarkerSet(
      attributeMarker,
      setMarker,
      langCode,
    );
    return { isError: false, attribute: attribute };
  } catch (e) {
    return { isError: true, err: e };
  }
};
