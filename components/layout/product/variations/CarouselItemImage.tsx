import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import { getImageUrl } from '@/app/api/hooks/useAttributesData';
import OptimizedImage from '@/components/shared/OptimizedImage';

interface CarouselItemImageProps {
  lang: string;
  item: IProductsEntity;
}

/**
 * CarouselItem image
 *
 * @param item product object
 * @param lang current language shortcode
 *
 * @returns
 */
const CarouselItemImage: FC<CarouselItemImageProps> = ({ item, lang }) => {
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
