import type { IAttributesSetsEntity } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import type { IError } from 'oneentry/dist/base/utils';

import { api } from '@/app/api';
import { getCachedData, setCachedData } from '@/app/api/utils/cache';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

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
  const cacheKey = `${setMarker}-${attributeMarker}-${langCode}`;

  // Check cache first
  const cached = getCachedData<IAttributesSetsEntity>(cacheKey);
  if (cached) {
    return { isError: false, attribute: cached };
  }

  try {
    const attribute = await api.AttributesSets.getSingleAttributeByMarkerSet(
      setMarker,
      attributeMarker,
      langCode,
    );

    if (isIError(attribute)) {
      return { isError: true, error: attribute as IError };
    } else {
      // Cache the result
      setCachedData<IAttributesSetsEntity>(cacheKey, attribute);
      return { isError: false, attribute: attribute };
    }
  } catch (error) {
    const apiError = handleApiError(error);
    return {
      isError: true,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.message,
      } as IError,
    };
  }
};
