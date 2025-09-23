import type { IAttributesSetsEntity } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import type { IError } from 'oneentry/dist/base/utils';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

interface HandleProps {
  attributeMarker: string;
  setMarker: string;
  lang: string;
}
/**
 * Get a single attribute with data from the attribute sets with API AttributesSets.
 * @async
 * @param attributeMarker Text identifier (marker) of the attribute in the set.
 * @param setMarker Text identifier (marker) of the attribute set.
 * @param lang Current language shortcode
 * @see {@link https://doc.oneentry.cloud/docs/attributes OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 *
 * @returns SingleAttribute|Error object.
 */
export const getSingleAttributeByMarkerSet = async ({
  setMarker,
  attributeMarker,
  lang,
}: HandleProps): Promise<{
  isError: boolean;
  error?: IError;
  attribute?: IAttributesSetsEntity;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  try {
    const attribute = await api.AttributesSets.getSingleAttributeByMarkerSet(
      setMarker,
      attributeMarker,
      langCode,
    );

    if (typeError(attribute)) {
      return { isError: true, error: attribute as IError };
    } else {
      return { isError: false, attribute: attribute };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { isError: true, error: e };
  }
};
