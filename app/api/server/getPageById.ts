import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';

export const getPageById = async (
  id: number,
  langCode: string,
): Promise<{
  page?: IPagesEntity;
  isError: boolean;
  err?: unknown;
}> => {
  try {
    const page = await api.Pages.getPageById(id, langCode);
    return { isError: false, page: page };
  } catch (err) {
    return { isError: true, err: err };
  }
};
