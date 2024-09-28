import type { IBlockEntity } from 'oneentry/dist/blocks/blocksInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export const getBlockByMarker = async (
  marker: string,
  lang: string,
): Promise<{
  block?: IBlockEntity;
  isError: boolean;
  error?: unknown;
}> => {
  try {
    const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
    const block = await api.Blocks.getBlockByMarker(marker, langCode);
    return { isError: false, block: block };
  } catch (e) {
    return { isError: true, error: e };
  }
};
