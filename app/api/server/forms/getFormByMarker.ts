import { unstable_cache } from 'next/cache';
import type { IError, IFormsEntity } from 'oneentry/types';
import { cache } from 'react';

import { getApi, isError } from '@/app/api';
import { toLangCode } from '@/app/types/enum';

/**
 * Cross-request Data Cache layer: stores the form in the Next.js Data Cache
 * with a TTL and tags so repeat requests skip the OneEntry round-trip.
 * @param   {string}          marker - Form marker.
 * @param   {string}          lang   - Current language shortcode.
 * @returns {Promise<object>}        Envelope with the form entity.
 */
const fetchFormByMarker = unstable_cache(
  async (
    marker: string,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    form?: IFormsEntity;
  }> => {
    const data = await getApi().Forms.getFormByMarker(marker, toLangCode(lang));

    if (isError(data)) {
      return { isError: true, error: data };
    }

    return { isError: false, form: data };
  },
  ['oneentry-getFormByMarker'],
  { revalidate: 300, tags: ['oneentry', 'oneentry-forms'] },
);

/**
 * Get a form by its marker.
 *
 * Exists so Server Components can resolve `moduleFormConfigs[0].id` instead of
 * hardcoding it: the identifier changes whenever the form is recreated in the
 * admin panel, and a stale literal on the read side silently stops matching the
 * records the write side submits — reviews get sent and never show up.
 *
 * React cache() deduplicates within a single render; the inner unstable_cache
 * layer deduplicates between requests (performance rule).
 * @async
 * @param   {string}          marker - Form marker, e.g. `comment_to_product`.
 * @param   {string}          lang   - Current language shortcode.
 * @returns {Promise<object>}        Envelope with the form entity, or an error.
 * @see {@link https://doc.oneentry.cloud/docs/forms OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getFormByMarker = cache(
  async (
    marker: string,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    form?: IFormsEntity;
  }> => fetchFormByMarker(marker, lang),
);
