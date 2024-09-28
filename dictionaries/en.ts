import { getBlockByMarker, getSingleAttributeByMarkerSet } from '@/app/api';

const dict = async (langCode: string) => {
  const { block } = await getBlockByMarker('system_content', langCode);
  const { attribute } = await getSingleAttributeByMarkerSet({
    attributeMarker: 'system_content',
    setMarker: 'cart_item_options',
    langCode,
  });
  return block;
};

export default dict;
