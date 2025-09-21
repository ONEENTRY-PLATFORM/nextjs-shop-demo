import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

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
  const picVal = item.attributeValues.pic?.value || '';
  const imageSrc = Array.isArray(picVal)
    ? picVal[0]?.downloadLink
    : picVal.downloadLink;

  return (
    <Link href={'/' + lang + '/shop/product/' + item.id} title={title}>
      <OptimizedImage
        width={80}
        height={80}
        src={imageSrc}
        alt={title}
        quality={85}
        className="aspect-auto size-full h-auto min-w-full shrink-0 rounded-lg object-cover"
      />
    </Link>
  );
};

export default CarouselItemImage;
