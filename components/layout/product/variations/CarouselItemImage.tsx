import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import OptimizedImage from '@/components/shared/OptimizedImage';

/**
 * CarouselItem image
 * @param   {object}          props      - component props.
 * @param   {IProductsEntity} props.item - product object.
 * @param   {string}          props.lang - current language shortcode.
 * @returns {JSX.Element}                JSX.Element.
 */
const CarouselItemImage = ({
  item,
  lang,
}: {
  lang: string;
  item: IProductsEntity;
}): JSX.Element => {
  const title = item.localizeInfos.title;
  const pic = item.attributeValues.pic;

  return (
    <Link href={'/' + lang + '/shop/product/' + item.id} title={title}>
      <OptimizedImage
        width={80}
        height={80}
        src={pic}
        alt={title}
        quality={75}
        className="aspect-auto size-full h-auto min-w-full shrink-0 rounded-lg object-cover"
        type="image"
      />
    </Link>
  );
};

export default CarouselItemImage;
