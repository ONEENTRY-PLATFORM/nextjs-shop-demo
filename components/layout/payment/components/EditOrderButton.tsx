import { useTransitionRouter } from 'next-transition-router';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import Loader from '@/components/shared/Loader';

/**
 * Edit order button.
 * @param   {object}           props           - Edit order button props.
 * @param   {IAttributeValues} props.dict      - dictionary values.
 * @param   {boolean}          props.isLoading - loading state.
 * @returns {JSX.Element}                      JSX.Element.
 */
const EditOrderButton = ({
  dict,
  isLoading,
}: {
  dict: IAttributeValues;
  isLoading: boolean;
}): JSX.Element => {
  const router = useTransitionRouter();
  const { edit_order_text } = dict;

  /**
   * Edit order button click handler.
   */
  const onEditOrder = async () => {
    router.push('/cart');
  };

  return (
    <button
      disabled={isLoading}
      onClick={() => onEditOrder()}
      className="btn btn-o btn-sm btn-o-primary mt-5 px-12 max-md:w-full"
    >
      {isLoading && <Loader />}
      {edit_order_text?.value}
    </button>
  );
};

export default EditOrderButton;
