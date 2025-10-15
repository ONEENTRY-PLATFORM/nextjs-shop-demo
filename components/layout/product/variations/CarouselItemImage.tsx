import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import OptimizedImage from '@/components/shared/OptimizedImage';

/**
 * CarouselItemImage component displays an optimized image for a product in a carousel.
 * The image is wrapped in a link that navigates to the product details page.
 * It extracts the product title and image URL from the product object and passes them
 * to the OptimizedImage component for rendering.
 * @param   {object}          props      - Component properties
 * @param   {IProductsEntity} props.item - Product object containing product details including title and image
 * @param   {string}          props.lang - Current language shortcode for localization and URL generation
 * @returns {JSX.Element}                A link element containing an optimized image of the product
 */
const CarouselItemImage = ({
  item,
  lang,
}: {
  lang: string;
  item: IProductsEntity;
}): JSX.Element => {
  /** Extract product title from localized information */
  const title = item.localizeInfos.title;
  /** Extract product image URL from product attributes */
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
