import type { IAttributeValues } from 'oneentry/dist/base/utils';

import { getBlockByMarker } from '@/app/api';
import { handleApiError } from '@/app/utils/errorHandler';

/**
 * Dictionary - get block by Marker with API Blocks.
 * @param   {string}                    langCode - Current language code.
 * @returns {Promise<IAttributeValues>}          Current language dictionary.
 */
const dict = async (langCode: string): Promise<IAttributeValues> => {
  /** Fetch system content block for specified language */
  try {
    /** Get block by marker and language code */
    const { block, isError } = await getBlockByMarker(
      'system_content',
      langCode,
    );

    /** Return attribute values if block exists, otherwise empty object */
    if (isError) {
      return {};
    } else {
      return { ...block?.attributeValues };
    }
  } catch (error) {
    /** Handle API errors and return empty object */
    const apiError = handleApiError('dict', error);
    // eslint-disable-next-line no-console
    console.log('Dictionary fetch error:', apiError.message);
    return {};
  }
};

export default dict;
