import { getBlockByMarker } from '@/app/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dict = async (langCode: string): Promise<any> => {
  try {
    const { block } = await getBlockByMarker('system_content', langCode);
    return { ...block?.attributeValues };
  } catch (e) {
    console.log(e);
  }
};

export default dict;
