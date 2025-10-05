import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import { getImageUrl } from '@/app/api/hooks/useAttributesData';
import OptimizedImage from '@/components/shared/OptimizedImage';

/**
 * CarouselItem image
 * @param props      - component props.
 * @param props.item - product object.
 * @param props.lang - current language shortcode.
 * @returns          JSX.Element.
 */
const CarouselItemImage = ({
  item,
  lang,
}: {
  lang: string;
  item: IProductsEntity;
}): JSX.Element => {
  const title = item.localizeInfos.title;
  const imageSrc = getImageUrl('pic', item.attributeValues);

  return (
    <Link href={'/' + lang + '/shop/product/' + item.id} title={title}>
      <OptimizedImage
        width={80}
        height={80}
        src={imageSrc}
        alt={title}
        quality={75}
        className="aspect-auto size-full h-auto min-w-full shrink-0 rounded-lg object-cover"
        type="image"
      />
    </Link>
  );
};

export default CarouselItemImage;
