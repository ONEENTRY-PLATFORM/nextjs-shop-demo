import { useTransitionRouter } from 'next-transition-router';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import Loader from '@/components/shared/Loader';

/**
 * Edit order button component.
 * Renders a button that allows users to navigate back to the cart to edit their order.
 * Shows a loader when in loading state.
 * @param   {object}           props           - Component properties.
 * @param   {IAttributeValues} props.dict      - Dictionary values containing localized text.
 * @param   {boolean}          props.isLoading - Loading state indicating if navigation is in progress.
 * @returns {JSX.Element}                      Edit order button component.
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
   * Handles the edit order button click event.
   * Navigates the user back to the cart page to make changes to their order.
   * @returns {Promise<void>} Promise that resolves when navigation is complete.
   */
  const onEditOrder = async (): Promise<void> => {
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
