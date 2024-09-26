import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';

export const getChildPagesByParentUrl = async (
  url: string,
  langCode: string,
): Promise<{
  pages?: IPagesEntity[];
  isError: boolean;
  err?: unknown;
}> => {
  try {
    const pages = await api.Pages.getChildPagesByParentUrl(url, langCode);
    return { isError: false, pages: pages };
  } catch (err) {
    return { isError: true, err: err };
  }
};
