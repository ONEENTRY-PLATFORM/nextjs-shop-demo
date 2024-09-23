import { api } from '@/app/api';

export async function getBlocksByPageUrl({
  pageUrl,
  langCode,
}: {
  pageUrl: string;
  langCode: string;
}) {
  try {
    const blocks = await api.Pages.getBlocksByPageUrl(pageUrl, langCode);
    return { isError: false, blocks: blocks };
  } catch (e) {
    return { isError: true, err: e };
  }
}
