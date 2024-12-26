import type { IError } from 'oneentry/dist/base/utils';
import type {
  BlockType,
  IBlocksResponse,
} from 'oneentry/dist/blocks/blocksInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

interface HandleProps {
  type: BlockType;
  lang: string;
}

/**
 * Get blocks by parameters.
 * @async
 * @param type Available values : forCatalogProducts, forBasketPage, forErrorPage, forCatalogPages, forProductPreview, forProductPage, forSimilarProductBlock, forStatisticProductBlock, forProductBlock, forForm, forFormField, forNewsPage, forNewsBlock, forNewsPreview, forOneNewsPage, forUsualPage, forTextBlock, forSlider, forOrder, service
 * @param lang Current language shortcode
 * @see {@link https://doc.oneentry.cloud/docs/blocks OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry CMS docs}
 *
 * @returns Return array of BlocksEntity object Promise.
 */
export const getBlocks = async ({
  type,
  lang,
}: HandleProps): Promise<{
  isError: boolean;
  error?: IError;
  blocks?: IBlocksResponse;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  try {
    const data = await api.Blocks.getBlocks(type, langCode);

    if (typeError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, blocks: data };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { isError: true, error: e };
  }
};
