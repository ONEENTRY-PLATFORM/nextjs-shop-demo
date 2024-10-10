import type { IAttributesSetsEntity } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import type { IError } from 'oneentry/dist/base/utils';

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
  isError: boolean;
  attribute: IAttributesSetsEntity | IError;
}> => {
  const attribute = await api.AttributesSets.getSingleAttributeByMarkerSet(
    attributeMarker,
    setMarker,
    langCode,
  );
  return { isError: false, attribute: attribute };
};
