import type { BlockType } from 'oneentry/dist/blocks/blocksInterfaces';

import { api } from '../api/api';

export const getBlocks = async ({
  type,
  langCode,
}: {
  type: BlockType;
  langCode: string;
}) => {
  try {
    const blocks = await api.Blocks.getBlocks(type, langCode);
    return { isError: false, blocks: blocks };
  } catch (e) {
    return { isError: true, err: e };
  }
};
