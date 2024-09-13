import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';

const EmptyCart = () => {
  const [emptyText, setEmptyText] = useState('');
  const { empty_cart_plug } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );

  useEffect(() => {
    if (!empty_cart_plug) {
      return;
    }
    setEmptyText(empty_cart_plug);
  }, [empty_cart_plug]);

  return (
    <div className="relative box-border flex shrink-0 flex-col items-center text-center text-slate-800">
      <Image
        className="mb-5"
        width={100}
        height={100}
        src={'/icons/cart.svg'}
        alt={''}
      />
      <h1 className="mb-5">{emptyText}</h1>
      <Link href="/shop" className="underline">
        Go to shop
      </Link>
    </div>
  );
};

export default EmptyCart;
