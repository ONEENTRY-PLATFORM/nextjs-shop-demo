import type { IAttributesSetsEntity } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import type { IError } from 'oneentry/dist/base/utils';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export const getSingleAttributeByMarkerSet = async ({
  attributeMarker,
  setMarker,
  lang,
}: {
  attributeMarker: string;
  setMarker: string;
  lang: string;
}): Promise<{
  isError: boolean;
  attribute: IAttributesSetsEntity | IError;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const attribute = await api.AttributesSets.getSingleAttributeByMarkerSet(
    attributeMarker,
    setMarker,
    langCode,
  );
  return { isError: false, attribute: attribute };
};
