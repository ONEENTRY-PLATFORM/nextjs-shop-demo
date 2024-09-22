import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '../api/api';

export const getPageByUrl = async (
  url: string,
  langCode: string,
): Promise<{
  page?: IPagesEntity;
  isError: boolean;
  err?: unknown;
}> => {
  try {
    const page = await api.Pages.getPageByUrl(url, langCode);
    return { isError: false, page: page };
  } catch (err) {
    return { isError: true, err: err };
  }
};
