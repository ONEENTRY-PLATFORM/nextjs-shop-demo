import React from 'react';

interface TotalAmountProps {
  amount: number;
}

const TotalAmount: React.FC<TotalAmountProps> = ({ amount }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
  return (
    <div className="self-end text-xl leading-8 text-neutral-600">
      Total amount: {formattedPrice}
    </div>
  );
};

export default TotalAmount;
