import Link from 'next/link';
import React from 'react';

import { useAppSelector } from '@/app/store/hooks';

const EmptyCart = () => {
  const { empty_cart_plug } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );

  return (
    <div className="text-center relative box-border flex shrink-0 flex-col">
      <h1 className="mb-5">{empty_cart_plug}</h1>
      <Link href="/shop" className="underline">
        Go to shop
      </Link>
    </div>
  );
};

export default EmptyCart;
