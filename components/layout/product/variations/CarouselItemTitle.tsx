import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

interface CarouselItemTitleProps {
  lang: string;
  item: IProductsEntity;
}

/**
 * CarouselItem title
 *
 * @param item product object
 * @param lang current language shortcode
 * @returns title with link to product
 */
const CarouselItemTitle: FC<CarouselItemTitleProps> = ({
  item: { id, localizeInfos, attributeValues },
  lang,
}) => {
  const title = localizeInfos.title;
  const colors = attributeValues?.color?.value;

  return (
    <Link href={'/' + lang + '/shop/product/' + id} title={title}>
      {colors.map((color: { title: string }, i: number) => {
        return color.title + (i < colors.length - 1 ? ' + ' : '');
      })}
    </Link>
  );
};

export default CarouselItemTitle;
