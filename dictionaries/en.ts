import { getBlockByMarker, getSingleAttributeByMarkerSet } from '@/app/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dict = async (langCode: string): Promise<any> => {
  try {
    const { block } = await getBlockByMarker('system_content', langCode);
    // const { attribute } = await getSingleAttributeByMarkerSet({
    //   attributeMarker: 'system_content',
    //   setMarker: 'cart_item_options',
    //   langCode,
    // });
    return { ...block };
    // return { ...block, ...attribute };
  } catch (e) {
    // console.log(e);
  }
};

export default dict;
