import React, { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const PaymentButton: React.FC = () => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  // PaymentForm
  return (
    <button
      type="submit"
      onClick={() => {
        setOpen(true);
        setComponent('PaymentForm');
      }}
      className="mt-9 self-center rounded-[30px] border border-solid border-orange-500 bg-orange-500 px-16 py-4 text-base uppercase text-white max-md:px-5 lg:self-start"
    >
      GO TO PAY
    </button>
  );
};

export default PaymentButton;
