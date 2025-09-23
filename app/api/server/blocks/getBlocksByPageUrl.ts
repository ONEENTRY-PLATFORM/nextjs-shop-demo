import type { IError } from 'oneentry/dist/base/utils';
import type { IPositionBlock } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';
import { getCachedData, setCachedData } from '@/app/api/utils/cache';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

interface HandleProps {
  lang: string;
  pageUrl: string;
}

/**
 * Get all blocks by page url.
 * @async
 * @param lang Current language shortcode
 * @param pageUrl Page URL
 * @see {@link https://doc.oneentry.cloud/docs/blocks OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 *
 * @returns all blocks as an array of PositionBlock objects or an empty array [] (if there is no data) for the selected parent
 */
export const getBlocksByPageUrl = async ({
  lang,
  pageUrl,
}: HandleProps): Promise<{
  isError: boolean;
  error?: IError;
  blocks?: IPositionBlock[];
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const cacheKey = `${pageUrl}-${langCode}`;

  // Check cache first
  const cached = getCachedData<IPositionBlock[]>(cacheKey);
  if (cached) {
    return { isError: false, blocks: cached };
  }

  try {
    const data = await api.Pages.getBlocksByPageUrl(pageUrl, langCode);

    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      // Cache the result
      setCachedData<IPositionBlock[]>(cacheKey, data);
      return { isError: false, blocks: data };
    }
  } catch (error) {
    const apiError = handleApiError(error);
    return {
      isError: true,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.message,
      } as IError,
    };
  }
};
