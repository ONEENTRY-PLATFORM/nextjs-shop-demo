import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import React, { useState } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { addPaymentMethod } from '@/app/store/reducers/OrderSlice';

// import CreditCard from '../assets/Card.svg';

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
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => {
        dispatch(
          addPaymentMethod(selected === index ? '' : account.identifier),
        );
        setSelected(selected === index ? undefined : index);
      }}
      // selected={selected === index}
      className={
        'flex-row items-center justify-between rounded-sm bg-transparent p-2.5'
      }
    >
      <div className={'flex-row items-center space-x-3'}>
        {account?.localizeInfos?.title}
      </div>
      {/* <Select selected={selected === index} /> */}
    </button>
  );
};

export default PaymentMethod;
