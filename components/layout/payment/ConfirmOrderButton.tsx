import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { FC } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Loader from '@/components/shared/Loader';

type ConfirmOrderButtonProps = {
  account: IAccountsEntity;
  isLoading: boolean;
  onConfirmOrder: () => Promise<void> | undefined;
};

const ConfirmOrderButton: FC<ConfirmOrderButtonProps> = ({
  account,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isLoading,
  onConfirmOrder,
}) => {
  return (
    <button
      disabled={isLoading}
      onClick={() => onConfirmOrder()}
      className="btn btn-o btn-sm btn-o-primary mt-5 px-12 max-md:w-full"
    >
      {isLoading && <Loader />}
      {account.identifier === 'cash' ? 'Apply' : 'Pay with stripe'}
    </button>
  );
};

export default ConfirmOrderButton;
