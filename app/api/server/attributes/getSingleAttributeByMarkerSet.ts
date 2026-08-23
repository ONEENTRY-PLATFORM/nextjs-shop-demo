import { unstable_cache } from 'next/cache';
import type { IAttributesSetsEntity, IError } from 'oneentry/types';
import { cache } from 'react';

import { getApi, isError } from '@/app/api';
import { toLangCode } from '@/app/types/enum';

/**
 * Cross-request Data Cache layer: stores the attribute in the Next.js Data
 * Cache with a TTL and tags so repeat requests skip the OneEntry round-trip.
 * Takes positional primitives for a stable cache key.
 * @param   {string}          setMarker       - Text identifier (marker) of the attribute set.
 * @param   {string}          attributeMarker - Text identifier (marker) of the attribute in the set.
 * @param   {string}          lang            - Current language shortcode.
 * @returns {Promise<object>}                 Envelope with the attribute object.
 */
const fetchSingleAttributeByMarkerSet = unstable_cache(
  async (
    setMarker: string,
    attributeMarker: string,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    attribute?: IAttributesSetsEntity;
  }> => {
    const langCode = toLangCode(lang);

    const attribute =
      await getApi().AttributesSets.getSingleAttributeByMarkerSet(
        setMarker,
        attributeMarker,
        langCode,
      );

    if (isError(attribute)) {
      return { isError: true, error: attribute as IError };
    }

    return { isError: false, attribute };
  },
  ['oneentry-getSingleAttributeByMarkerSet'],
  { revalidate: 300, tags: ['oneentry', 'oneentry-attributes'] },
);

/**
 * Get a single attribute with data from the attribute sets with API AttributesSets.
 * React cache() deduplicates within a single render; the inner unstable_cache
 * layer deduplicates between requests (performance rule).
 * @param   {object}          props                 - Object containing the parameters.
 * @param   {string}          props.setMarker       - Text identifier (marker) of the attribute set.
 * @param   {string}          props.attributeMarker - Text identifier (marker) of the attribute in the set.
 * @param   {string}          props.lang            - Current language shortcode
 * @returns {Promise<object>}                       SingleAttribute|Error object.
 * @see {@link https://doc.oneentry.cloud/docs/attributes OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getSingleAttributeByMarkerSet = cache(
  async ({
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
  }> => fetchSingleAttributeByMarkerSet(setMarker, attributeMarker, lang),
);
