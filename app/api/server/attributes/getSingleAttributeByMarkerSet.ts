import type { IAttributesSetsEntity } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import type { IError } from 'oneentry/dist/base/utils';

import { getApi } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { isIError } from '@/app/utils/errorHandler';

/**
 * Get a single attribute with data from the attribute sets with API AttributesSets.
 * @param   {object}          props                 - Object containing the parameters.
 * @param   {string}          props.setMarker       - Text identifier (marker) of the attribute set.
 * @param   {string}          props.attributeMarker - Text identifier (marker) of the attribute in the set.
 * @param   {string}          props.lang            - Current language shortcode
 * @returns {Promise<object>}                       SingleAttribute|Error object.
 * @see {@link https://doc.oneentry.cloud/docs/attributes OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSingleAttributeByMarkerSet: any = async ({
  setMarker,
  attributeMarker,
  lang,
}: {
  setMarker: string;
  attributeMarker: string;
  lang: string;
}): Promise<{
  isError: boolean;
  error?: IError;
  attribute?: IAttributesSetsEntity;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  const attribute = await getApi().AttributesSets.getSingleAttributeByMarkerSet(
    setMarker,
    attributeMarker,
    langCode,
  );

  if (isIError(attribute)) {
    return { isError: true, error: attribute as IError };
  }

  return { isError: false, attribute };
};
