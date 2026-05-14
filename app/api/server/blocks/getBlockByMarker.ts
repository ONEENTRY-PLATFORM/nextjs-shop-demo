import type { IError } from 'oneentry/dist/base/utils';
import type { IBlockEntity } from 'oneentry/dist/blocks/blocksInterfaces';
import { cache } from 'react';

import { getApi } from '@/app/api';
import { toLangCode } from '@/app/types/enum';
import { isIError } from '@/app/utils/errorHandler';

/**
 * Get block by marker.
 * Wrapped in React cache() to deduplicate requests within a single render.
 * @param   {string}          marker - Marker of Block.
 * @param   {string}          lang   - Current language shortcode.
 * @returns {Promise<object>}        Return array of BlocksEntity object Promise.
 * @see {@link https://doc.oneentry.cloud/docs/blocks OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getBlockByMarker = cache(
  async (
    marker: string,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    block?: IBlockEntity;
  }> => {
    const langCode = toLangCode(lang);

    const data = await getApi().Blocks.getBlockByMarker(marker, langCode);

    if (isIError(data)) {
      return { isError: true, error: data };
    }

    return { isError: false, block: data };
  },
);
