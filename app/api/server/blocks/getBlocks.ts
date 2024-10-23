import type { IError } from 'oneentry/dist/base/utils';
import type { BlockType } from 'oneentry/dist/blocks/blocksInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

export const getBlocks = async ({
  type,
  lang,
}: {
  type: BlockType;
  lang: string;
}) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const blocks = await api.Blocks.getBlocks(type, langCode);

  if (typeError(blocks)) {
    return { isError: true, blocks: blocks as IError };
  } else {
    return { isError: false, blocks: blocks };
  }
};
