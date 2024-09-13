import React, { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const PaymentButton: React.FC = () => {
  return (
    <button
      type="submit"
      onClick={() => {}}
      className="mt-9 self-center rounded-[30px] border border-solid border-orange-500 bg-orange-500 px-16 py-4 text-base uppercase text-white max-md:px-8 max-md:py-3 lg:self-start"
    >
      GO TO PAY
    </button>
  );
};

export default PaymentButton;
