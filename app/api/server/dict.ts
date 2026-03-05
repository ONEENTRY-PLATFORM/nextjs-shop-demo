import type { IAttributeValues } from 'oneentry/dist/base/utils';

import { getBlockByMarker } from '@/app/api';

/**
 * Dictionary - get block by Marker with API Blocks.
 * @param   {string}                    langCode - Current language code.
 * @returns {Promise<IAttributeValues>}          Current language dictionary.
 */
const dict = async (langCode: string): Promise<IAttributeValues> => {
  const { block, isError } = await getBlockByMarker('system_content', langCode);

  if (isError) {
    return {};
  }

  return { ...block?.attributeValues };
};

export default dict;
