import Link from 'next/link';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import FadeTransition from '@/app/animations/FadeTransition';
import EmptyCartIcon from '@/components/icons/empty-cart';

/**
 * Empty orders page component.
 * Displays a message when there are no orders with a link to the shop.
 * @param   {object}           props      - Component props
 * @param   {string}           props.lang - Current language shortcode (e.g., 'en', 'ru')
 * @param   {IAttributeValues} props.dict - Dictionary containing localized texts
 * @returns {JSX.Element}                 Empty orders page with link to shop
 */
const EmptyOrders = ({
  lang,
  dict,
}: {
  lang: string;
  dict: IAttributeValues;
}): JSX.Element => {
  /** Extract localized texts from the dictionary */
  const { empty_cart_plug, go_to_shop } = dict;

  /** Render the empty orders page with fade transition animation */
  return (
    <FadeTransition
      className="relative box-border flex shrink-0 flex-col items-center text-center text-slate-800"
      index={0}
    >
      {/* Heading with empty cart icon and localized message */}
      <h1 className="mb-5 text-lg font-bold uppercase text-slate-600">
        <EmptyCartIcon />
        {empty_cart_plug?.value}
      </h1>
      {/* Link to shop page with localized text */}
      <Link
        href={'/' + lang + '/shop/'}
        className="btn btn-sm btn-o btn-o-primary"
      >
        {go_to_shop?.value}
      </Link>
    </FadeTransition>
  );
};

export default EmptyOrders;
