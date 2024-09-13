import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { addPaymentMethod } from '@/app/store/reducers/OrderSlice';
import { PaymentForm } from '@/components/forms';

type Props = {
  account: IAccountsEntity;
};

const PaymentMethod: React.FC<Props> = ({ account }) => {
  const dispatch = useAppDispatch();
  const orderData = useAppSelector((state) => state.orderReducer.order);
  const isActive = orderData?.paymentAccountIdentifier === account.identifier;

  return (
    <div
      onClick={() => {
        dispatch(addPaymentMethod(account.identifier));
      }}
      className={
        'relative min-h-32 flex-row items-center justify-between rounded-md border border-solid border-neutral-300 bg-transparent p-2.5 transition-shadow hover:shadow-lg ' +
        (isActive ? 'w-full' : 'w-48')
      }
    >
      <div className={'flex-row items-center space-x-3'}>
        {account?.localizeInfos?.title}
        <div className="absolute bottom-2 right-2 size-6 rounded-full bg-slate-50 text-center">
          {isActive ? '-' : '+'}
        </div>
      </div>
      <PaymentForm />
    </div>
  );
};

export default PaymentMethod;
