import type { IError } from 'oneentry/dist/base/utils';
import type { IPositionBlock } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Get all blocks by page url.
 * @async
 * @param   {string} props.lang    - Current language shortcode
 * @param   {string} props.pageUrl - Page URL
 * @param            root0
 * @param            root0.lang
 * @param            root0.pageUrl
 * @see {@link https://doc.oneentry.cloud/docs/blocks OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 * @returns                        all blocks as an array of PositionBlock objects or an empty array [] (if there is no data) for the selected parent
 */
export const getBlocksByPageUrl = async ({
  lang,
  pageUrl,
}: {
  lang: string;
  pageUrl: string;
}): Promise<{
  isError: boolean;
  error?: IError;
  blocks?: IPositionBlock[];
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  try {
    const data = await api.Pages.getBlocksByPageUrl(pageUrl, langCode);

    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, blocks: data };
    }
  } catch (error) {
    const apiError = handleApiError('getBlocksByPageUrl', error);
    return {
      isError: true,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.message,
      } as IError,
    };
  }
};
