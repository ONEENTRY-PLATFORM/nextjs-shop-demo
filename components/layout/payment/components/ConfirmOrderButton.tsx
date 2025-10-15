import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { JSX } from 'react';

import Loader from '@/components/shared/Loader';

/**
 * Confirm order button component.
 * Renders a button that allows users to confirm their order.
 * The button text changes based on the payment method (cash or stripe).
 * Shows a loader when the order confirmation is in progress.
 * @param   {object}           props                - Component properties.
 * @param   {IAttributeValues} props.dict           - Dictionary values containing localized text.
 * @param   {IAccountsEntity}  props.account        - Account information with payment method details.
 * @param   {boolean}          props.isLoading      - Loading state indicating if order confirmation is in progress.
 * @param   {void}             props.onConfirmOrder - Handler function to execute when confirming the order.
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
  /** Extract localized text values from the dictionary */
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
