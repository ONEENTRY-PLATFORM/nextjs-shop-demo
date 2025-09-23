import Image from 'next/image';
import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import Placeholder from '@/components/shared/Placeholder';

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
      {imageSrc ? (
        <Image
          width={80}
          height={80}
          src={imageSrc}
          alt={title}
          className="aspect-auto size-full h-auto min-w-full shrink-0 rounded-lg object-cover"
        />
      ) : (
        <Placeholder />
      )}
    </Link>
  );
};

export default CarouselItemImage;
