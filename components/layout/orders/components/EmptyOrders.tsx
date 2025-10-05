import Link from 'next/link';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import FadeTransition from '@/app/animations/FadeTransition';
import EmptyCartIcon from '@/components/icons/empty-cart';

/**
 * Empty orders page
 * @param   {object}           props      - Empty orders props
 * @param   {string}           props.lang - current language shortcode
 * @param   {IAttributeValues} props.dict - dictionary
 * @returns {JSX.Element}                 JSX.Element
 */
const EmptyOrders = ({
  lang,
  dict,
}: {
  lang: string;
  dict: IAttributeValues;
}): JSX.Element => {
  const { empty_cart_plug, go_to_shop } = dict;

  return (
    <FadeTransition
      className="relative box-border flex shrink-0 flex-col items-center text-center text-slate-800"
      index={0}
    >
      <h1 className="mb-5 text-lg font-bold uppercase text-slate-600">
        <EmptyCartIcon />
        {empty_cart_plug?.value}
      </h1>
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
