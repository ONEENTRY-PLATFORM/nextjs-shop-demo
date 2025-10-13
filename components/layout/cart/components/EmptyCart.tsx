import Image from 'next/image';
import Link from 'next/link';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import FadeTransition from '@/app/animations/FadeTransition';

/**
 * Empty cart component that displays when there are no products in the shopping cart
 * Shows a cart icon, descriptive message and a link to continue shopping
 * Wrapped with fade transition animation for smooth entrance effects
 * @param   {object}           props      - Empty cart props
 * @param   {string}           props.lang - Current language shortcode for URL localization
 * @param   {IAttributeValues} props.dict - Dictionary with localized values from server API
 * @returns {JSX.Element}                 Empty cart component with transition animation
 */
const EmptyCart = ({
  lang,
  dict,
}: {
  lang: string;
  dict: IAttributeValues;
}): JSX.Element => {
  /** Extract localized text values from dictionary */
  const { empty_cart_plug, go_to_shop } = dict;

  return (
    /** Wrap component with fade transition animation for smooth entrance effects */
    <FadeTransition
      className="relative box-border flex shrink-0 flex-col items-center text-center text-slate-800"
      index={2}
    >
      {/** Cart icon to visually represent empty cart state */}
      <Image
        width={100}
        height={100}
        src={'/icons/cart.svg'}
        alt={empty_cart_plug?.value}
        className="mb-5 size-20 opacity-20"
      />

      {/** Empty cart message from localized dictionary */}
      <h1 className="mb-5 text-lg font-bold uppercase text-slate-600">
        {empty_cart_plug?.value}
      </h1>

      {/** Link to continue shopping, directing user to the shop page */}
      <Link
        href={'/' + lang + '/shop/'}
        className="btn btn-sm btn-o btn-o-primary"
      >
        {go_to_shop?.value}
      </Link>
    </FadeTransition>
  );
};

export default EmptyCart;
