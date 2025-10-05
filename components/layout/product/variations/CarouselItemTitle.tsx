import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

/**
 * CarouselItem title.
 * @param   {object}          props      - component props.
 * @param   {IProductsEntity} props.item - product object.
 * @param   {string}          props.lang - current language shortcode.
 * @returns {JSX.Element}                title with link to product.
 */
const CarouselItemTitle = ({
  item: { id, localizeInfos, attributeValues },
  lang,
}: {
  lang: string;
  item: IProductsEntity;
}): JSX.Element => {
  const title = localizeInfos.title;
  const colors = attributeValues?.color?.value;

  return (
    <Link href={'/' + lang + '/shop/product/' + id} title={title}>
      {Array.isArray(colors)
        ? colors.map((color: { title: string }, i: number) => {
            return color.title + (i < colors.length - 1 ? ' + ' : '');
          })
        : ''}
    </Link>
  );
};

export default CarouselItemTitle;
