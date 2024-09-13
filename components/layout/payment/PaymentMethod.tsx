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
        'relative w-full flex-row text-slate-700 items-center justify-between rounded-md border border-solid border-neutral-300 bg-transparent p-4 cursor-pointer ' +
        (isActive ? 'min-h-36' : ' min-h-10')
      }
    >
      <div className={'flex-col'}>
        <h1 className="text-bold text-lg">{account?.localizeInfos?.title}</h1>
        <p className="text-sm">Payment description {account?.localizeInfos?.title}</p>
        <button
          onClick={() => {
            if (isActive) {
              dispatch(addPaymentMethod(''));
            }
          }}
          className="absolute bottom-4 right-4 size-6 rounded-full bg-slate-50 text-center"
        >
          {isActive ? '-' : '+'}
        </button>
      </div>

      {isActive && (
        <button
          onClick={() => onConfirmOrder()}
          className="mt-5 rounded-[30px] border border-solid border-orange-500 bg-transparent px-16 py-2 text-base uppercase text-orange-500 max-md:px-8 max-md:py-3 lg:self-start"
        >
          Apply
        </button>
      )}
      {/* {isActive && <PaymentForm />} */}
    </div>
  );
};

export default PaymentMethod;
