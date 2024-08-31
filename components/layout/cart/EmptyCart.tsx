import React from 'react';

import { useAppSelector } from '@/app/store/hooks';

const EmptyCart = () => {
  const { empty_cart_plug } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );

  return (
    <div className="relative box-border flex shrink-0 flex-col">
      {empty_cart_plug}
    </div>
  );
};

export default EmptyCart;
