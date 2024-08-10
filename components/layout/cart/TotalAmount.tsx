import React from 'react';

interface TotalAmountProps {
  amount: number;
}

const TotalAmount: React.FC<TotalAmountProps> = ({ amount }) => {
  return (
    <div className="self-end text-xl leading-8 text-neutral-600">
      Total amount: $ {amount}
    </div>
  );
};

export default TotalAmount;
