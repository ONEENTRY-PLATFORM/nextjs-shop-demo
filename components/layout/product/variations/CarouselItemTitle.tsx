import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

/**
 * CarouselItemTitle component displays the title of a product in a carousel.
 * The title is linked to the product details page. If the product has multiple colors,
 * they are displayed as a concatenated string separated by '+' symbols.
 * @param   {object}          props      - Component properties
 * @param   {IProductsEntity} props.item - Product object containing product details including id, localized information and attributes
 * @param   {string}          props.lang - Current language shortcode for localization and URL generation
 * @returns {JSX.Element}                A link element containing the product title or color information
 */
const CarouselItemTitle = ({
  item: { id, localizeInfos, attributeValues },
  lang,
}: {
  lang: string;
  item: IProductsEntity;
}): JSX.Element => {
  /** Extract product title from localized information */
  const title = localizeInfos.title;
  /** Extract color information from product attributes */
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
