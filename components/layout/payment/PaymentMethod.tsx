import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { addPaymentMethod } from '@/app/store/reducers/OrderSlice';

type Props = {
  account: IAccountsEntity;
  onConfirmOrder: () => Promise<void> | undefined;
};

const PaymentMethod: React.FC<Props> = ({ account, onConfirmOrder }) => {
  const dispatch = useAppDispatch();
  const orderData = useAppSelector((state) => state.orderReducer.order);
  const isActive = orderData?.paymentAccountIdentifier === account.identifier;

  return (
    <div
      onClick={() => {
        if (!isActive) {
          dispatch(addPaymentMethod(account.identifier));
        }
      }}
      className={
        'relative w-full flex-row items-center justify-between rounded-md border border-solid border-neutral-300 bg-transparent p-2.5 transition-shadow hover:shadow-lg ' +
        (isActive ? 'min-h-48' : ' min-h-24')
      }
    >
      <div className={'flex-row items-center space-x-3'}>
        {account?.localizeInfos?.title}
        <button
          onClick={() => {
            if (isActive) {
              dispatch(addPaymentMethod(''));
            }
          }}
          className="absolute bottom-2 right-2 size-6 rounded-full bg-slate-50 text-center"
        >
          {isActive ? '-' : '+'}
        </button>
      </div>

      {isActive && (
        <button
          onClick={() => onConfirmOrder()}
          className="mt-5 rounded-[30px] border border-solid border-orange-500 bg-transparent px-16 py-3 text-base uppercase text-orange-500 max-md:px-8 max-md:py-3 lg:self-start"
        >
          Apply
        </button>
      )}
      {/* {isActive && <PaymentForm />} */}
    </div>
  );
};

export default PaymentMethod;
