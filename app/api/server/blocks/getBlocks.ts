import type { IError } from 'oneentry/dist/base/utils';
import type {
  BlockType,
  IBlocksResponse,
} from 'oneentry/dist/blocks/blocksInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

export const getBlocks = async ({
  type,
  lang,
}: {
  type: BlockType;
  lang: string;
}): Promise<{
  isError: boolean;
  error?: IError;
  blocks?: IBlocksResponse;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const data = await api.Blocks.getBlocks(type, langCode);

  if (typeError(data)) {
    return { isError: true, error: data };
  } else {
    return { isError: false, blocks: data };
  }
};
