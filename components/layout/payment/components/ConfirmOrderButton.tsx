import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { FC } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import Loader from '@/components/shared/Loader';

type ConfirmOrderButtonProps = {
  account: IAccountsEntity;
  isLoading: boolean;
  onConfirmOrder: () => Promise<void>;
};

const ConfirmOrderButton: FC<ConfirmOrderButtonProps> = ({
  account,
  isLoading,
  onConfirmOrder,
}) => {
  const { apply_button_placeholder, pay_with_stripe } = useAppSelector(
    (state) => state.systemContentReducer.content,
  ) as {
    apply_button_placeholder: {
      value: string;
    };
    pay_with_stripe: {
      value: string;
    };
  };

  return (
    <button
      disabled={isLoading}
      onClick={() => onConfirmOrder()}
      className="btn btn-o btn-sm btn-o-primary mt-5 px-12 max-md:w-full"
    >
      {isLoading && <Loader />}
      {account.identifier === 'cash'
        ? apply_button_placeholder.value
        : pay_with_stripe.value}
    </button>
  );
};

export default ConfirmOrderButton;
