import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import React, { useContext } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import { addPaymentMethod } from '@/app/store/reducers/OrderSlice';

type Props = {
  account: IAccountsEntity;
  selected?: number;
  index: number;
  setSelected: (index: number | undefined) => void;
};

const PaymentMethod: React.FC<Props> = ({
  account,
  selected,
  setSelected,
  index,
}) => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => {
        dispatch(
          addPaymentMethod(selected === index ? '' : account.identifier),
        );
        setSelected(selected === index ? undefined : index);
        setOpen(true);
        setComponent('PaymentForm');
      }}
      className={
        'relative h-32 w-48 flex-row items-center justify-between rounded-md border border-solid border-neutral-300 bg-transparent p-2.5 transition-shadow hover:shadow-lg'
      }
    >
      <div className={'flex-row items-center space-x-3'}>
        {account?.localizeInfos?.title}
        <div className="absolute bottom-2 right-2 size-6 rounded-full bg-slate-50">
          +
        </div>
      </div>
      {/* <Select selected={selected === index} /> */}
    </button>
  );
};

export default PaymentMethod;
