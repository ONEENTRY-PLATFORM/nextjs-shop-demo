import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { FC } from 'react';

import Loader from '@/components/shared/Loader';

type ConfirmOrderButtonProps = {
  dict: IAttributeValues;
  account: IAccountsEntity;
  isLoading: boolean;
  onConfirmOrder: () => Promise<void>;
};

/**
 * Confirm order button
 * @param dict
 * @param account
 * @param isLoading loading state
 * @param onConfirmOrder Confirm order handle
 *
 * @returns JSX.Element
 */
const ConfirmOrderButton: FC<ConfirmOrderButtonProps> = ({
  dict,
  account,
  isLoading,
  onConfirmOrder,
}) => {
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
