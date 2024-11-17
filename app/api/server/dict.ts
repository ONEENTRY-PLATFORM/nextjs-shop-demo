import type { IAttributeValues } from 'oneentry/dist/base/utils';

import { getBlockByMarker } from '@/app/api';

/**
 * Dictionary - get block by Marker with API Blocks
 *
 * @param langCode Current language code
 *
 * @returns Current language dictionary
 */
const dict = async (langCode: string): Promise<IAttributeValues> => {
  try {
    const { block, isError } = await getBlockByMarker(
      'system_content',
      langCode,
    );

    if (isError) {
      return {};
    } else {
      return { ...block?.attributeValues };
    }
  } catch (e) {
    console.log(e);
    return {};
  }
};

export default dict;
