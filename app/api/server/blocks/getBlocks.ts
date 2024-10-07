import type { BlockType } from 'oneentry/dist/blocks/blocksInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export const getBlocks = async ({
  type,
  lang,
}: {
  type: BlockType;
  lang: string;
}) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const blocks = await api.Blocks.getBlocks(type, langCode);
  return { isError: false, blocks: blocks };
};
