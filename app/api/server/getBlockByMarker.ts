import type { IBlockEntity } from 'oneentry/dist/blocks/blocksInterfaces';

import { api } from '@/app/api';

export const getBlockByMarker = async (
  marker: string,
  langCode: string,
): Promise<{
  block?: IBlockEntity;
  isError: boolean;
  error?: unknown;
}> => {
  try {
    const block = await api.Blocks.getBlockByMarker(marker, langCode);
    return { isError: false, block: block };
  } catch (e) {
    return { isError: true, error: e };
  }
};
