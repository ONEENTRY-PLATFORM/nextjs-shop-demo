import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { JSX } from 'react';

import Loader from '@/components/shared/Loader';

/**
 * Confirm order button.
 * @param   {object}           props                - button props object.
 * @param   {IAttributeValues} props.dict           - dictionary values.
 * @param   {IAccountsEntity}  props.account        - account.
 * @param   {boolean}          props.isLoading      - loading state.
 * @param   {void}             props.onConfirmOrder - Confirm order handle.
 * @returns {JSX.Element}                           Confirm order button.
 */
const ConfirmOrderButton = ({
  dict,
  account,
  isLoading,
  onConfirmOrder,
}: {
  dict: IAttributeValues;
  account: IAccountsEntity;
  isLoading: boolean;
  onConfirmOrder: () => Promise<void>;
}): JSX.Element => {
  const { apply_button_placeholder, pay_with_stripe } = dict;

  return (
    <button
      disabled={isLoading}
      onClick={() => onConfirmOrder()}
      className="btn btn-o btn-sm btn-o-primary mt-5 px-12 max-md:w-full"
    >
      {isLoading && <Loader />}
      {account.identifier === 'cash'
        ? apply_button_placeholder?.value
        : pay_with_stripe?.value}
    </button>
  );
};

export default ConfirmOrderButton;
