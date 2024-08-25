import React from 'react';

import { UsePrice } from '@/components/utils';

interface TotalAmountProps {
  amount: number;
}

const TotalAmount: React.FC<TotalAmountProps> = ({ amount }) => {
  const formattedPrice = UsePrice({
    amount: amount,
    currency: 'USD',
  });
  return (
    <div className="self-end text-xl leading-8 text-neutral-600">
      Total amount: {formattedPrice}
    </div>
  );
};

export default TotalAmount;
